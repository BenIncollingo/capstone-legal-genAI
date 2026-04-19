//This file contains all the routes regarding file uoloads to the infra DB for our team

import { Router } from "express";
import multer from "multer";
import { uploadDocumentToInfra } from "../services/documents.service.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); //multer is a library that allows to store files in a buffer before uploading - acts as middleware for uploading files

//endpoint to upload files to infra team - /api/documents/uploadDocument
//upload.single("file") just allows the endpoint to accept 1 file
router.post("/uploadDocument", upload.single("file"), async (req, res) => {
  try {
    console.log("route hit: /api/documents/uploadDocument");

    const file = req.file; //needs the file front the frontend in order to upload

    let metadata = null;
    if (req.body.metadata) { //collects metadata if there is any, we put this in here in case we wanted to use it, but we didnt end up using any metadata.
      try {
        metadata = JSON.parse(req.body.metadata);
      } catch {
        metadata = req.body.metadata;
      }
    }

    if (!file) { //if the file isnt part of the call, throw a 400 error
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await uploadDocumentToInfra(file, metadata); //calls service file that uploads to infra team

    return res.status(200).json({ //resposd with success message and confirmation on success
      message: "Document uploaded successfully",
      document: result,
    });
  } catch (error) { //catch any errors on fail
    console.error("document upload route error:", error);

    return res.status(500).json({
      message: error.message || "Failed to upload document",
    });
  }
});

export default router;