export async function testData() {
  const res = await fetch("/api/data/test");

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  // Parse the response body ONCE
  const data = await res.json();
  return data;
}
