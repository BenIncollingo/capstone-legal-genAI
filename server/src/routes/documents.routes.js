import { Router } from "express";
import multer from "multer";
import { uploadDocumentToInfra } from "../services/documents.service.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/uploadDocument", upload.single("file"), async (req, res) => {
  try {
    console.log("route hit: /api/documents/uploadDocument");

    const file = req.file;

    let metadata = null;
    if (req.body.metadata) {
      try {
        metadata = JSON.parse(req.body.metadata);
      } catch {
        metadata = req.body.metadata;
      }
    }

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await uploadDocumentToInfra(file, metadata);

    return res.status(200).json({
      message: "Document uploaded successfully",
      document: result,
    });
  } catch (error) {
    console.error("document upload route error:", error);

    return res.status(500).json({
      message: error.message || "Failed to upload document",
    });
  }
});

export default router;