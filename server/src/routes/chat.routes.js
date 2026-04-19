//all endpoints regarding chatting

import { Router } from "express";
import { sendChatToInfra } from "../services/chat.service.js";

const router = Router();

//This is the /api/chat/uploadChat endpoint which calls a service function to send a chat to the infra team API
router.post("/uploadChat", async (req, res) => {
    const { chat } = req.body; //define the chat variable
    console.log("route hit: /api/chat/uploadChat with req: " + chat);
    const infraResponse = await sendChatToInfra(chat); // pass the chat into the service function in chat.service.js
    res.json(infraResponse); //return infra Response to frontend - /client/src/api/chat.api.js
});

export default router;
