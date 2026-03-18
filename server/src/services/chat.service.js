export async function sendChatToInfra(question) {
  try {
    const response = await fetch("https://api-service-4xa2fuayfa-ue.a.run.app/");

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