export function cleanSourceName(source = "") {
  if (!source) return "Unknown source";

  let cleaned = source;

  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {
    // leave as-is if decoding fails
  }

  return cleaned
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .replace(/Â§/g, "§")
    .trim();
}

export function extractUniqueSources(citations = []) {
  const seen = new Map();

  citations.forEach((citation) => {
    const sourceName = cleanSourceName(citation?.source || "");

    if (!seen.has(sourceName)) {
      seen.set(sourceName, {
        source: sourceName,
        url: citation?.url || "",
      });
    }
  });

  return Array.from(seen.values());
}