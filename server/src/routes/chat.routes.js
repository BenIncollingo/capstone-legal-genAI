import { Router } from "express";
import { sendChatToInfra } from "../services/chat.service.js";

const router = Router();

router.post("/uploadChat", async (req, res) => {
    const { chat } = req.body;
    console.log("route hit: /api/data/uploadChat with req: " + chat);
    const infraResponse = await sendChatToInfra(chat);
    res.json(infraResponse);
});

export default router;
