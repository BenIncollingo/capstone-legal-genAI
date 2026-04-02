import { BACKEND_API_BASE_URL } from "./config";

export async function testData() {
  const res = await fetch(`${BACKEND_API_BASE_URL}/data/test`);

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  // Parse the response body ONCE
  const data = await res.json();
  return data;
}
