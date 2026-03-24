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

  let data = null;

  try {
    data = await res.json();
  } catch {
    // ignore if response is not valid JSON
  }

  if (!res.ok) {
    throw new Error(data?.message || `Upload failed: ${res.status}`);
  }

  return data;
}