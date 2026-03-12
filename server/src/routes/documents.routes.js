import { Router } from "express";
import multer from "multer";
import { uploadDocumentToInfra } from "../services/documents.service.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/uploadDocument", upload.single("file"), async (req, res) => {
  try {
    console.log("route hit: /api/documents/uploadDocument");

    const file = req.file;
    const metadata = req.body.metadata;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const infraResponse = await uploadDocumentToInfra(file, metadata);

    res.json(infraResponse);
  } catch (error) {
    console.error("document upload route error:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

export default router;



/*Front end example call to this endpoint (should go into docuemnts.api.js)


export async function uploadDocumentToBackend(file, metadata) {
  const formData = new FormData();
  formData.append("file", file);

  if (metadata) {
    formData.append("metadata", JSON.stringify(metadata));
  }

  const res = await fetch("/api/documents/uploadDocument", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }

  return await res.json();
}
  

Example for react element:
<input
  type="file"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadDocumentToBackend(file, {
        title: file.name,
      });
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }}
/>

*/