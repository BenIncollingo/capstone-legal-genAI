//This is a file containing all the logic for chatting with the infra team

//this function gets called from the chat.routes.js /api/chat/uploadChat endpoint
//it uses the fetch function to call the infra teams API
export async function sendChatToInfra(question) {
  try {
    const url = `${process.env.INFRA_BASE_URL}/api/v1/chat`; //full url of infra endpoint
    console.log("Calling infra URL:", url);

    //calling the infra endpoint
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}` 
      },
      body: JSON.stringify({ 
        question: question, //the user chat/question
        project_id: process.env.PROJECT_ID, //project ID of the douments that we want to search
        min_score: 0.4, //if the accuracy score of the response is less than 0.4 the infra teams response should say it doesnt know
        system_prompt: process.env.SYSTEM_PROMPT //we also upload our system prompt to help the bot answer the users question with the correct guidelines
      }),
    });

    if (!response.ok) { //throw an error on fail
      const errorText = await response.text();
      console.error("Infra response status:", response.status); //logging for troubleshooting purposes
      console.error("Infra response body:", errorText);
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json(); // ensure infra response is in json format
    console.log("Infra response:", data);
    return data; //return AI response on success
  } catch (error) {
    console.error("Infra error:", error);
    throw error;
  }
}