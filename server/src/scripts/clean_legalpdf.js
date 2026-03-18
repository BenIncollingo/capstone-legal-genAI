import fs from "fs";
import path from "path";
import * as mupdf from "mupdf";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_PAGES = 1000;
const RAW_DOCS_DIR = path.resolve(__dirname, "../../../documents");
const CLEAN_DIR = path.resolve(__dirname, "../../../cleaned_documents");

function extractRawText(pdfPath) {
  const doc = mupdf.Document.openDocument(pdfPath);
  const totalPages = doc.countPages();
  const pagesToRead = Math.min(MAX_PAGES, totalPages);

  let text = "";

  for (let i = 0; i < pagesToRead; i++) {
    const page = doc.loadPage(i);
    text += page.toStructuredText().asText() + "\n";
    page.destroy?.();
  }

  doc.destroy?.();
  return text;
}

function cleanLegalText(text) {
  let t = text;

  t = t.replace(/Page \d+ of \d+/gi, "");
  t = t.replace(/-{3,}/g, "");
  t = t.replace(/\n+/g, "\n");
  t = t.replace(/[ \t]+/g, " ");     // collapse spaces only
  t = t.replace(/\n{2,}/g, "\n\n");  // preserve paragraph spacing
  t = t.replace(/§\s*/g, "\n§ ");
  t = t.replace(/\n§/g, "\n\n§"); // add spacing before sections

  return t.trim();
}

function processPDF(filePath, relativePath) {
  console.log("Cleaning PDF:", relativePath);

  const rawText = extractRawText(filePath);
  const cleaned = cleanLegalText(rawText);

  const outputPath = path.join(
    CLEAN_DIR,
    relativePath.replace(/\.pdf$/i, ".txt")
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, cleaned, "utf8");
}

function processTXT(filePath, relativePath) {
  console.log("Cleaning TXT:", relativePath);

  const raw = fs.readFileSync(filePath, "utf8");
  const cleaned = cleanLegalText(raw);

  const outputPath = path.join(CLEAN_DIR, relativePath);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, cleaned, "utf8");
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(RAW_DOCS_DIR, fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.toLowerCase().endsWith(".pdf")) {
      processPDF(fullPath, relativePath);
    } else if (file.toLowerCase().endsWith(".txt")) {
      processTXT(fullPath, relativePath);
    }
  }
}

function main() {
  console.log("Starting legal document cleaning...\n");
  scanDirectory(RAW_DOCS_DIR);
  console.log("\nCleaning complete.");
}

main();