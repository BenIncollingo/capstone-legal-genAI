import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import FormData from "form-data";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const CLEAN_DIR = path.resolve(__dirname, "../../../cleaned_documents");

const BASE_URL = process.env.INFRA_BASE_URL;
const PROJECT_ID = process.env.PROJECT_ID;
const API_KEY = process.env.API_KEY;

console.log("BASE_URL:", BASE_URL);
console.log("PROJECT_ID:", PROJECT_ID);
console.log("API_KEY loaded:", API_KEY ? "yes" : "no");
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
  form.append("chunk_size", "1000");
  form.append("chunk_overlap", "100");
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