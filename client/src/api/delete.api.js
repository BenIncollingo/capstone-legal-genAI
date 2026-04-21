import { BACKEND_API_BASE_URL } from "./config";

export async function deleteFile(fileName) {
  const res = await fetch(
    `${BACKEND_API_BASE_URL}/documents/deleteDocument?source=${fileName}`,
    {
      method: "DELETE",
    }
  );

  let data = null;

  try {
    data = await res.json();
  } catch {
    // ignore non-JSON response
  }

  if (!res.ok) {
    throw new Error(data?.message || `Delete failed: ${res.status}`);
  }

  return data;
}
