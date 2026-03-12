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