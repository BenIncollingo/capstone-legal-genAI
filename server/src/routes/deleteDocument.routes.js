import express from "express";
import { deleteDocumentService } from "../services/deleteDocument.service.js";

const router = express.Router();

router.delete("/deleteDocument", async (req, res) => {
  const { source } = req.query;

  try {
    const result = await deleteDocumentService(source);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;