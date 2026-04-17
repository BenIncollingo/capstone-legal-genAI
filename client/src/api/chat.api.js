//frontend file containing all API calls to our backend regarding chats, conversations, and messages

import { BACKEND_API_BASE_URL } from "./config";

const BASE_URL = BACKEND_API_BASE_URL;

//Function calls our /chat/uploadChat endpoint to upload a chat to the API
//Returns an object containing the response, sources and accuracy score of said sources. 
export async function uploadChatToBackend(userChat) {
  const res = await fetch(`${BACKEND_API_BASE_URL}/chat/uploadChat`, 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat: userChat //send the users question in POST req
        })
    }
  );

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`); //throw an error on fail
  }
  const data = await res.json();
  console.log("Recieved from backend after frontend call (infra response): " + data);
  return data; //return the data to the react page
}

//Function calls out /db/conversations/:userId endpoint 
//This returns all the conversations for a user to list on the sidebar of the main page
export async function fetchConversations(userId) {
  const res = await fetch(`${BASE_URL}/db/conversations/${userId}`); // get req

  if (!res.ok) { //throw error on fail
    throw new Error("Failed to fetch conversations");
  }

  return res.json(); //returns conversatins to react component.
}

//Function calls our /db/conversations endpoint
//This is a POST request to create a new entry in our DB 
export async function createConversation(userId, title = "New Chat") { //the chat gest names New Chat on default
  const res = await fetch(`${BASE_URL}/db/conversations`, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, title }), //sends userId and convo title in POST req
  });

  if (!res.ok) { //throw error on fail
    throw new Error("Failed to create conversation");
  }

  return res.json(); //returns a status to frontend react component
}

//Function calls our /db/messages/:conversationId/:userId endpoint
//This function is used to get all of the messages within the selected conversation
export async function fetchMessages(conversationId, userId) {
  const res = await fetch(`${BASE_URL}/db/messages/${conversationId}/${userId}`); //GET req

  if (!res.ok) { //throw error on fail
    throw new Error("Failed to fetch messages");
  }

  return res.json(); //returns an object containing all the messsages in the conversation (includes sources and score)
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

<<<<<<< HEAD
    if (!res.ok) {
      throw new Error("Failed to create message");
    }

    return res.json();
  }

=======
//Function calls our /db/messages endpoint 
//This function is called whenever a user writes sometihng or the bot responds and saves the message in a conversation
export async function createMessage(conversationId, userId, role, content, citations = []) {
  const res = await fetch(`${BASE_URL}/db/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ //passes all the needed componoents in a POST req
      conversationId,
      userId,
      role,
      content,
      citations,
    }),
  });

  if (!res.ok) { //throws error on fail
    throw new Error("Failed to create message");
  }

  return res.json(); //returns status to react componeont
}

//Function calls our /db/conversations/:conversationId/:userId endpoint
//this function deletes the conversation as well as all the messages within this conversation
>>>>>>> code-cleanup
export async function deleteConversation(conversationId, userId) {
  const res = await fetch(`${BASE_URL}/db/conversations/${conversationId}/${userId}`, { //DELETE req
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) { //throw error on fail
    throw new Error("Failed to delete conversation");
  }

  return res.json(); //returns status to react
}