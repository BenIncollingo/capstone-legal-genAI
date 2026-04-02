const BASE_URL = "http://localhost:8080/api";

export async function fetchConversations(userId) {
  const res = await fetch(`${BASE_URL}/conversations/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function createConversation(userId, title = "New Chat") {
  const res = await fetch(`${BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, title }),
  });

  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

export async function fetchMessages(conversationId) {
  const res = await fetch(`${BASE_URL}/messages/${conversationId}`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function createMessage(conversationId, role, content) {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversationId, role, content }),
  });

  if (!res.ok) throw new Error("Failed to create message");
  return res.json();
}

export async function uploadChatToBackend(message) {
  const res = await fetch("http://localhost:8080/api/chat/uploadChat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Failed to send chat to backend");

  return res.json();
}
