import fs from "fs/promises";
import path from "path";

export async function uploadDocumentToInfra(file, metadata) {
  if (!file) {
    throw new Error("No file provided to service");
  }



  //temporary use until we figure out how to upload to infra team API...
  // root of project
  const projectRoot = process.cwd();

  // create /testInfraDB in root
  const uploadDir = path.join(projectRoot, "testInfraDB");
  await fs.mkdir(uploadDir, { recursive: true });

  // keep original filename for now
  const filePath = path.join(uploadDir, file.originalname);

  // write buffer from multer memory storage
  await fs.writeFile(filePath, file.buffer);

  console.log(`Saved file to: ${filePath}`);
  console.log("Metadata received:", metadata);

  return {
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    savedTo: filePath,
    metadata: metadata || null,
  };
}

