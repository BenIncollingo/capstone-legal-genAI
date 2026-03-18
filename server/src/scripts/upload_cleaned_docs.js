import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLEAN_DIR = path.resolve(__dirname, "../../../cleaned_documents");

const BASE_URL = "https://api-service-4xa2fuayfa-ue.a.run.app";
const PROJECT_ID = process.env.AI_PROJECT_ID || "genai-legal-488518";
const API_KEY = process.env.AI_API_KEY || "";

const INGEST_URL = `${BASE_URL}/ingest/${PROJECT_ID}/upload`;

function getAllTxtFiles(dir) {
  let results = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getAllTxtFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".txt")) {
      results.push(fullPath);
    }
  }

  return results;
}

async function uploadFile(filePath) {
  const relativePath = path.relative(CLEAN_DIR, filePath);

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append(
    "metadata",
    JSON.stringify({
      title: path.basename(filePath),
      source_path: relativePath,
      team: "legal"
    })
  );

  const headers = {
    ...form.getHeaders()
  };

  if (API_KEY) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }

  const res = await fetch(INGEST_URL, {
    method: "POST",
    headers,
    body: form
  });

  const bodyText = await res.text();

  if (!res.ok) {
    throw new Error(`Upload failed for ${relativePath}: ${res.status} ${bodyText}`);
  }

  console.log(`Uploaded: ${relativePath}`);
  console.log(`Response: ${bodyText}`);
}

async function main() {
  console.log("API key loaded:", API_KEY ? "yes" : "no");
  console.log("Upload script starting...");
  console.log("Cleaned docs folder:", CLEAN_DIR);
  console.log("Ingest URL:", INGEST_URL);

  const files = getAllTxtFiles(CLEAN_DIR);

  if (files.length === 0) {
    console.log("No cleaned txt files found.");
    return;
  }

  console.log(`Found ${files.length} cleaned txt files.`);
  console.log("Testing first file only...\n");

  await uploadFile(files[0]);
}

main().catch((err) => {
  console.error("Script failed:");
  console.error(err.message);
});