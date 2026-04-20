//this is a utility function for cleaning citations when they come back from the infra team.

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
    const content = (citation?.content || "").trim();

    //uniqueness is filename + content
    const uniqueKey = `${sourceName}|||${content}`;

    if (!seen.has(uniqueKey)) {
      seen.set(uniqueKey, {
        source: sourceName,
        content,
        url: citation?.url || "",
        score: citation?.score,
      });
    }
  });

  return Array.from(seen.values());
}