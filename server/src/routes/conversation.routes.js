const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConversationsByUser,
  createMessage,
  getMessagesByConversation,
} = require("../services/conversation.service");

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
    const { conversationId, role, content } = req.body;

    if (!conversationId || !role || !content) {
      return res.status(400).json({
        error: "conversationId, role, and content are required",
      });
    }

    const message = await createMessage(conversationId, role, content);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

router.get("/messages/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await getMessagesByConversation(conversationId);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;