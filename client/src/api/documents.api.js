//frontend file containing all API calls to our backend regarding document uploads


import { BACKEND_API_BASE_URL } from "./config";

//Function calls our /documents/uploadDocument endpoint 
// this funciton is used for when a user wants to upload a document to our document library
export async function uploadDocumentToBackend(file, metadata) {
  const formData = new FormData(); //uses form data to store all the file data
  formData.append("file", file);

  if (metadata) { //we arent using any metadata right now, but we stored metadata incase
    formData.append("metadata", JSON.stringify(metadata));
  }

  const res = await fetch(`${BACKEND_API_BASE_URL}/documents/uploadDocument`, { //POST req with file data
    method: "POST",
    body: formData,
  });

  let data = null;

  try {
    data = await res.json(); //try and have response as JSON object
  } catch {
    // ignore if response is not valid JSON
  }

  if (!res.ok) { //throw error on fail
    throw new Error(data?.message || `Upload failed: ${res.status}`);
  }

  return data; //return status to react component
}


//Function calls our /documents/deleteDocument endpoint
//this funciton is sued if a user wants to deltee a document from the infra vector DB library
export async function deleteDocument(source) {
  if (!source) {
    throw new Error("No document source provided");
  }

  const response = await fetch(
    `${BACKEND_API_BASE_URL}/documents/deleteDocument`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete document");
  }

  console.log("Hopefully this worked: " + response);

  return await response.json();
}