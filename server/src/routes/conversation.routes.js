//this file contains all the routes regarding saving our chats in our cloudSQL DB

import express from "express";

//import all the needed functions from our service file - conversation.service.js
import {
  createConversation,
  getConversationsByUser,
  createMessage,
  getMessagesByConversation,
  deleteConversation,
} from "../services/conversation.service.js";

const router = express.Router();

//this is the endpoint that cretes a new conversation in the DB - /api/db/conversations
router.post("/conversations", async (req, res) => {
  try { 
    const { userId, title } = req.body; //frontend sends the request with the userId and the chat title

    if (!userId) { //responds with 400 error if there is not enough information
      return res.status(400).json({ error: "userId is required" });
    }

    const conversation = await createConversation(userId, title); //this is the service function that creates the conversation
    res.status(201).json(conversation); //sends a success message with confirmation back to frontend
  } catch (error) { //catch any errors on fail
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

//endpoint for fetching all the conversations for a user - /api/db/conversations/:userID
//used when loading the main GPT page so the user can see all their chat history
router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params; //frontend only need to request with the UserID
    const conversations = await getConversationsByUser(userId); //calls the service function to call the cloud SQL api with userId
    res.json(conversations); //send confirmation on success
  } catch (error) { //catch any errors on fail
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

//endpoint called for creating a new message within a conversation - /api/db/messages
//used everytime the user sends a chat or the bot responds
router.post("/messages", async (req, res) => {
  try {
    const { conversationId, userId, role, content, citations } = req.body;

    if (!conversationId || !userId || !role || !content) { //throw an error if all of these arent here (besides citations bc the user chats wont have those)
      return res.status(400).json({error: "conversationId, userId, role, and content are required",});
    }

    const message = await createMessage( //calls the service function to insert the message into the SQL table
      conversationId,
      userId,
      role,
      content,
      citations || []
    );

    res.status(201).json(message); //returns success status and confirmation on success
  } catch (error) { //catches any errors on fail
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

//endpoint to get all the messages within a conversation - /api/db/messages/:conversationId/:userId
//needed when a user selects a past conversation, it gets all the messages from within that conversation so the user can see chat history
router.get("/messages/:conversationId/:userId", async (req, res) => {
  try {
    const { conversationId, userId } = req.params; // needs the userId and conversationId
    const messages = await getMessagesByConversation(conversationId, userId); //calls service funciton to select * from messages under the given userId
    res.json(messages); //responds with a json object containing all the messages
  } catch (error) { //catches any errors on fail
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

//endpoint to delete a conversation - /api/db/conversatoins/:conversationId/:userId
//the user has the option to delete conversations if they want
router.delete("/conversations/:conversationId/:userId", async (req, res) => {
  try {
    const { conversationId, userId } = req.params; // the frontend needs the conversationId and userId

    if (!conversationId || !userId) { // throws a 400 error if they arent provided
      return res.status(400).json({
        error: "conversationId and userId are required",
      });
    }

    const deletedConversation = await deleteConversation(conversationId, userId); //calls service function to clean out conversation and then delete the row

    if (!deletedConversation) { //throw a 404 error if the service function cant find the conversation
      return res.status(404).json({
        error: "Conversation not found or unauthorized",
      });
    }

    res.status(200).json({ //respond with success status and confirmation on success
      message: "Conversation deleted successfully",
      conversation: deletedConversation,
    });
  } catch (error) { //catch any errors on fail
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

export default router;