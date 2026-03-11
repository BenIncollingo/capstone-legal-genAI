export async function uploadDocumentToInfra(file, metadata) {

  const projectId = process.env.AI_PROJECT_ID;
  const baseUrl = process.env.AI_BASE_URL;

  const formData = new FormData();

  const blob = new Blob([file.buffer], { type: file.mimetype });

  formData.append("file", blob, file.originalname);

  if (metadata) {
    formData.append("metadata", metadata);
  }

  const res = await fetch(
    `${baseUrl}/ingest/${projectId}/upload`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`
      }
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Infra upload failed: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  console.log("Infra upload response:", data);

  return data;
}