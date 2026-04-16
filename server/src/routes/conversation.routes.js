import express from "express";

import {
  createConversation,
  getConversationsByUser,
  createMessage,
  getMessagesByConversation,
  deleteConversation,
} from "../services/conversation.service.js";

const router = express.Router();

router.post("/conversations", async (req, res) => {
  try {
    const { userId, title } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const conversation = await createConversation(userId, title);
    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await getConversationsByUser(userId);
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { conversationId, userId, role, content } = req.body;

    if (!conversationId || !userId || !role || !content) {
      return res.status(400).json({
        error: "conversationId, userId, role, and content are required",
      });
    }

    const message = await createMessage(conversationId, userId, role, content);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

router.get("/messages/:conversationId/:userId", async (req, res) => {
  try {
    const { conversationId, userId } = req.params;
    const messages = await getMessagesByConversation(conversationId, userId);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


router.delete("/conversations/:conversationId/:userId", async (req, res) => {
  try {
    const { conversationId, userId } = req.params;

    if (!conversationId || !userId) {
      return res.status(400).json({
        error: "conversationId and userId are required",
      });
    }

    const deletedConversation = await deleteConversation(conversationId, userId);

    if (!deletedConversation) {
      return res.status(404).json({
        error: "Conversation not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Conversation deleted successfully",
      conversation: deletedConversation,
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

export default router;