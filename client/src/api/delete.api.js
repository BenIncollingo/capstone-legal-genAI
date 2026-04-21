import { BACKEND_API_BASE_URL } from "./config";

export async function deleteFile(fileName) {
  const baseUrl = "https://your-api-base-url.com"; // Replace with your $BASE
  const url = `${BACKEND_API_BASE_URL}/query/${process.env.PROJECT_ID}/document?source=${fileName}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Deleted successfully:', result);
  } catch (error) {
    console.error('Deletion failed:', error);
  }
};
