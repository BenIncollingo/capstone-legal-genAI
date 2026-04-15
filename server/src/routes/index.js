import express from "express";
import pool from "../database/index.js";
import { Router } from "express";
import chatRoutes from "./chat.routes.js";
import documentRoutes from "./documents.routes.js";
import conversationRoutes from "./conversation.routes.js";

const router = express.Router();

router.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    console.error("DB test failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
router.use("/chat", chatRoutes)
router.use("/documents", documentRoutes);
router.use("/db", conversationRoutes);

export default router;