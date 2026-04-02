import express from "express";
import conversationRoutes from "./conversation.routes.js";
import pool from "../database/index.js";

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

router.use("/", conversationRoutes);

export default router;