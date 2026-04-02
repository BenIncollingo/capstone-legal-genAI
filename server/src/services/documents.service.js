export async function uploadDocumentToInfra(file, metadata) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  const fileBlob = new Blob([file.buffer], { type: file.mimetype });

  formData.append("file", fileBlob, file.originalname);
  formData.append("chunk_size", "1000");
  formData.append("chunk_overlap", "100");

  const url = `${process.env.INFRA_BASE_URL}/ingest/${process.env.PROJECT_ID}/upload`;

  try {
    const infraResponse = await fetch(url, {
      method: "POST",
      body: formData, 
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!infraResponse.ok) {
      const errText = await infraResponse.text();
      throw new Error(`Infra upload failed: ${errText}`);
    }

    const data = await infraResponse.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}