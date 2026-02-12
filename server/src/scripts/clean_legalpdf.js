// clean_legal_pdf.js
// npm i mupdf
// (MuPDF's Node bindings are the simplest "fitz-like" option in JavaScript.)

const fs = require("fs");
const mupdf = require("mupdf");

const MAX_PAGES = 30; // 👈 limit here

function extractRawText(pdfPath, maxPages = MAX_PAGES) {
  const doc = mupdf.Document.openDocument(pdfPath);
  const totalPages = doc.countPages();
  const pagesToRead = Math.min(maxPages, totalPages);

  let text = "";
  for (let i = 0; i < pagesToRead; i++) {
    const page = doc.loadPage(i);
    // get text from page
    text += page.toText() + "\n";
  }
  return text;
}

function cleanLegalText(text) {
  let t = text;

  t = t.replace(/Page \d+ of \d+/g, "");
  t = t.replace(/-{3,}/g, "");
  t = t.replace(/UNITED STATES DISTRICT COURT.*?\n/gi, "");
  t = t.replace(/\n+/g, "\n");
  t = t.replace(/\s+/g, " ");

  return t.trim();
}

function extractFirstPage(pdfPath) {
  const doc = mupdf.Document.openDocument(pdfPath);
  const page = doc.loadPage(0);
  return page.toText();
}

function main() {
  const pdfFile = "usc05@119-73not60.pdf";

  const rawText = extractRawText(pdfFile);
  const cleanText = cleanLegalText(rawText);

  fs.writeFileSync("case_clean.txt", cleanText, { encoding: "utf8" });

  const totalPages = mupdf.Document.openDocument(pdfFile).countPages();
  console.log(" Extraction and cleaning complete.");
  console.log("Pages processed:", Math.min(MAX_PAGES, totalPages));
  console.log("Raw length:", rawText.length);
  console.log("Clean length:", cleanText.length);

  const firstPageRaw = extractFirstPage(pdfFile);
  const firstPageClean = cleanLegalText(firstPageRaw);

  console.log("\n===== CLEANED FIRST PAGE =====\n");
  console.log(firstPageClean.slice(0, 800)); // limit print size
}

if (require.main === module) {
  main();
}
