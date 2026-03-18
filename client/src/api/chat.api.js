import { BACKEND_API_BASE_URL } from "./config"

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
