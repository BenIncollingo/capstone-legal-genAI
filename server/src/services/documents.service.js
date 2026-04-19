//this file holds all the logic for uploading files to the infra teams environment

export async function uploadDocumentToInfra(file, metadata) {
  if (!file) throw new Error("No file provided"); // throw an error again if there was no file found

  const formData = new FormData(); //essentially creates an object to hold all information about the file
  const fileBlob = new Blob([file.buffer], { type: file.mimetype }); //converts the multer file buffer into an object suitable for upload

  formData.append("file", fileBlob, file.originalname); //adds the file object to the formdata
  formData.append("chunk_size", "1000"); //adds required info for infra upload
  formData.append("chunk_overlap", "100"); //adds required info for infra upload

  const url = `${process.env.INFRA_BASE_URL}/ingest/${process.env.PROJECT_ID}/upload`; //url to upload to infra team

  try {
    //this is the actual request to the infra team
    const infraResponse = await fetch(url, {
      method: "POST",
      body: formData,  //needs all the data about the file - formdata object
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
      },
    });

    //throw an error on fail
    if (!infraResponse.ok) {
      const errText = await infraResponse.text(); //log in GCP for troubleshooting
      throw new Error(`Infra upload failed: ${errText}`);
    }

    const data = await infraResponse.json();
    console.log(data);
    return data; //return data back to documents.routes.js on success with infra response.

  } catch (error) { //catch any errors on fail
    console.error(`Error: ${error.message}`);
    throw error;
  }
}