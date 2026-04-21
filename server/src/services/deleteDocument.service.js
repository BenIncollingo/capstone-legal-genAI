export async function deleteDocumentService(source) {
  const base = process.env.INFRA_BASE_URL;
  const project = process.env.PROJECT_ID;
  const key = process.env.API_KEY;

  if (!base || !project || !key) {
    throw new Error("Missing required environment variables");
  }

  const url = `${base}/query/${project}/document?source=${encodeURIComponent(source)}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Delete failed: ${response.status}`);
  }

  return text ? JSON.parse(text) : { success: true };
}