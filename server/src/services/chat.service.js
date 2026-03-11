export async function sendChatToInfra(message) {
  console.log("BACKEND SERVICE got message:", message);

  return {
    response: "example AI response message: wow very interesting question",
  };
}