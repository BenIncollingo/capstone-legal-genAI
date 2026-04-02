import { useEffect, useState } from "react";
import {
  fetchConversations,
  createConversation,
  fetchMessages,
  createMessage,
} from "../api/chatApi";

export default function ChatPage() {
  const userId = 1; // replace later with real logged-in user
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const data = await fetchConversations(userId);
      setConversations(data);

      if (data.length > 0) {
        setSelectedConversationId(data[0].id);
        loadMessages(data[0].id);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }

  async function loadMessages(conversationId) {
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
      setSelectedConversationId(conversationId);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  async function handleNewChat() {
    try {
      const newConversation = await createConversation(userId, "New Chat");
      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversationId(newConversation.id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  }

  async function handleSendMessage() {
    if (!input.trim()) return;

    try {
      let conversationId = selectedConversationId;

      if (!conversationId) {
        const newConversation = await createConversation(userId, "New Chat");
        setConversations((prev) => [newConversation, ...prev]);
        conversationId = newConversation.id;
        setSelectedConversationId(conversationId);
      }

      const savedMessage = await createMessage(conversationId, "user", input);

      setMessages((prev) => [...prev, savedMessage]);
      setInput("");

      // later this is where you would call your AI endpoint
      // then save the assistant reply with another createMessage(...)
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "300px", borderRight: "1px solid #ccc", padding: "1rem" }}>
        <button onClick={handleNewChat}>New Chat</button>

        <h3>Chat History</h3>

        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => loadMessages(conversation.id)}
            style={{
              padding: "0.5rem",
              marginTop: "0.5rem",
              cursor: "pointer",
              backgroundColor:
                selectedConversationId === conversation.id ? "#eee" : "transparent",
            }}
          >
            {conversation.title}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem" }}>
          {messages.map((message) => (
            <div key={message.id} style={{ marginBottom: "0.75rem" }}>
              <strong>{message.role}:</strong> {message.content}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}