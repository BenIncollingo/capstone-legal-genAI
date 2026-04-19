//all endpoints regarding chatting

import { Router } from "express";
import { sendChatToInfra, sendWarmupToInfra } from "../services/chat.service.js";

const router = Router();

//This is the /api/chat/uploadChat endpoint which calls a service function to send a chat to the infra team API
router.post("/uploadChat", async (req, res) => {
    const { chat } = req.body; //define the chat variable
    console.log("route hit: /api/chat/uploadChat with req: " + chat);
    const infraResponse = await sendChatToInfra(chat); // pass the chat into the service function in chat.service.js
    res.json(infraResponse); //return infra Response to frontend - /client/src/api/chat.api.js
});

//This is the /api/chat/warmup endpoint which calls a service function to warm up the infra team API
router.get("/warmup", async (req, res) => {
  try {
    console.log("route hit: /api/chat/warmup");

    const infraResponse = await sendWarmupToInfra(); //call service function to hit infra warmup endpoint
    res.status(200).json(infraResponse); //return status and confirmation on success
  } catch (error) { //catch errors on fail
    console.error("warmup route error:", error);

    //if infra returned a status like 503, preserve it if possible
    res.status(error.status || 500).json({
      error: error.message || "Failed to warm up infra",
      details: error.details || null,
    });
  }
});

export default router;
