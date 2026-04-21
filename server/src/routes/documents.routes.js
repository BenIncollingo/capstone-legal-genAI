import { Router } from "express";
import { deleteDocumentService } from "../services/deleteDocument.service.js";

const router = Router();

router.delete("/deleteDocument", async (req, res) => {
  try {
    console.log("route hit: /api/documents/deleteDocument");

    const { source } = req.query;

    if (!source) {
      return res.status(400).json({
        message: "Missing document source",
      });
    }

    const result = await deleteDocumentService(source);

    return res.status(200).json({
      message: "Document deleted successfully",
      result,
    });

  } catch (error) {
    console.error("document delete route error:", error);

    return res.status(500).json({
      message: error.message || "Failed to delete document",
    });
  }
});

export default router;