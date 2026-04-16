import { BACKEND_API_BASE_URL } from "./config";

const BASE_URL = BACKEND_API_BASE_URL;

export async function uploadChatToBackend(userChat) {
  const res = await fetch(`${BACKEND_API_BASE_URL}/chat/uploadChat`, 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat: userChat
        })
    }
  );

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  const data = await res.json();
  console.log("Recieved from backend after frontend call (infra response): " + data);
  return data;
}

export async function fetchConversations(userId) {
  const res = await fetch(`${BASE_URL}/db/conversations/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return res.json();
}

export async function createConversation(userId, title = "New Chat") {
  const res = await fetch(`${BASE_URL}/db/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, title }),
  });

  if (!res.ok) {
    throw new Error("Failed to create conversation");
  }

  return res.json();
}

export async function fetchMessages(conversationId, userId) {
  const res = await fetch(`${BASE_URL}/db/messages/${conversationId}/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  return res.json();
}
  export async function createMessage(
    conversationId,
    userId,
    role,
    content,
    citations = []
  ) {
    const res = await fetch(`${BASE_URL}/db/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        userId,
        role,
        content,
        citations,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create message");
    }

    return res.json();
  }

export async function deleteConversation(conversationId, userId) {
  const res = await fetch(`${BASE_URL}/db/conversations/${conversationId}/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete conversation");
  }

  return res.json();
}