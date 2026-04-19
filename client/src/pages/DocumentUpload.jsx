//this is the document upload page

import { useRef, useState } from "react";
import { uploadDocumentToBackend } from "../api/documents.api";
import { useCounter } from "../contexts/Counter/CounterProvider";
import DocumentsHeader from "../components/DocumentDashboard/DocumentsHeader.jsx";
import DocumentUploadPanel from "../components/DocumentDashboard/DocumentUploadPanel.jsx";
import StagingArea from "../components/DocumentDashboard/StagingArea.jsx";

export default function DocumentUploadPage() {
  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { recordUpload } = useCounter();

  //function to open the file explorer for the user
  const handleOpenExplorer = () => {
    fileInputRef.current?.click();
  };

  //Handles when user selects files from file picker, Converts FileList into an array, creates document objects and adds them to the staged documents list
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newDocs = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`, // Generate unique ID for tracking each document
      file, // Original file object used for upload
      name: file.name, // temporary metadata for UI display
      size: file.size,
      type: file.type || "Unknown file type",
      status: "staged", // default status for newly uploaded files
      error: null, // default to no errors for newly uploaded files
      response: null, //default no response for newly uploaeded files
    }));

    setDocuments((prev) => [...prev, ...newDocs]); //adds the newly uploaeded files to the current files in "staged area" (documents)
    e.target.value = ""; //cleanup
  };


  //function to handle upload for only staged or failed files
  const handleUploadAll = async () => {
    //creates a list of all the files in staged area (documents) that are able to be uploaded
    const stagedDocs = documents.filter(
      (doc) => doc.status === "staged" || doc.status === "failed"
    );
    if (!stagedDocs.length) return;

    setIsUploading(true); //set to true while uploading process is happening

    //loop through all docs that are going to be uploaded
    for (const doc of stagedDocs) {
      setDocuments((prev) => //annoying fancy way to say that the current document is uploading
        prev.map((item) =>
          item.id === doc.id
            ? { ...item, status: "uploading", error: null }
            : item
        )
      );

      try {
        const result = await uploadDocumentToBackend(doc.file, { //call service function in docuements.api.js to upload document
          title: doc.name,
        });

        await recordUpload(doc.name); //counts the upload in ../contexts/Counter/CounterProvider to keep track in documentLibrary

        //on success mark the file as uploaded
        setDocuments((prev) => 
          prev.map((item) =>
            item.id === doc.id
              ? { ...item, status: "uploaded", response: result, error: null }
              : item
          )
        );
      } catch (err) {
        //on error mark the file as failed and display error message
        setDocuments((prev) =>
          prev.map((item) =>
            item.id === doc.id
              ? {
                  ...item,
                  status: "failed",
                  error: err.message || "Upload failed",
                }
              : item
          )
        );
      }
    }

    setIsUploading(false); //set to false because upload process is completed
  };

  //fucntion to remove a single document from staging area - disabled during upload
  const handleRemoveDocument = (id) => {
    if (isUploading) return;
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  //clears all staged/failed documents, also disabled during upload
  const handleClearStaged = () => {
    if (isUploading) return;
    setDocuments((prev) => prev.filter((doc) => doc.status === "uploaded"));
  };

  //function to foramt that file size into a readable value for user
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  //gets number of files in the staging area that need to be uploaded
  const stagedCount = documents.filter(
    (doc) => doc.status === "staged" || doc.status === "failed"
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto w-full max-w-6xl px-4 py-5">
        <DocumentsHeader
          title="Document Uploads"
          description="Choose files, stage them for review, and upload them to your backend workflow."
        />

        <div className="mt-6 space-y-6">
          <DocumentUploadPanel
            fileInputRef={fileInputRef}
            handleOpenExplorer={handleOpenExplorer}
            handleFileChange={handleFileChange}
            handleClearStaged={handleClearStaged}
            handleUploadAll={handleUploadAll}
            isUploading={isUploading}
            documents={documents}
            stagedCount={stagedCount}
          />

          <StagingArea
            documents={documents}
            formatSize={formatSize}
            handleRemoveDocument={handleRemoveDocument}
            isUploading={isUploading}
          />
        </div>
      </main>
    </div>
  );
}