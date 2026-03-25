export async function sendChatToInfra(question) {
  try {
    const response = await fetch(`${process.env.INFRA_BASE_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        question: question,
        project_id: process.env.PROJECT_ID,
        system_prompt: process.env.SYSTEM_PROMPT
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Infra response:", data);
    return data;
  } catch (error) {
    console.error("Infra error:", error);
    throw error;
  }
}