//This file contains all the routes regarding file uoloads to the infra DB for our team

import { Router } from "express";
import multer from "multer";
import { uploadDocumentToInfra, deleteDocumentFromInfra } from "../services/documents.service.js";

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


//endpoint to delte files from infra team document vector DB - /api/documents/deleteDocument
router.post("/deleteDocument", async (req, res) => {
  try {
    console.log("route hit: /api/documents/deleteDocument");

    const { source } = req.body; 

    if (!source) { //respond with error on misconfigured call
      return res.status(400).json({
        message: "Missing source in request body",
      });
    }

    const response = await deleteDocumentFromInfra(source); //call service function that calls infra delete endpoint

    return res.status(200).json({ //return with status and confirmation on succeess
      message: "Document deleted successfully",
      data: response,
    });
  } catch (error) { //catch any error on fail
    console.error("Error in deleteDocument route:", error);

    return res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
});

export default router;