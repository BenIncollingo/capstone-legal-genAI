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

  const handleOpenExplorer = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newDocs = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type || "Unknown file type",
      status: "staged",
      error: null,
      response: null,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
    e.target.value = "";
  };

  const handleUploadAll = async () => {
    const stagedDocs = documents.filter(
      (doc) => doc.status === "staged" || doc.status === "failed"
    );
    if (!stagedDocs.length) return;

    setIsUploading(true);

    for (const doc of stagedDocs) {
      setDocuments((prev) =>
        prev.map((item) =>
          item.id === doc.id
            ? { ...item, status: "uploading", error: null }
            : item
        )
      );

      try {
        const result = await uploadDocumentToBackend(doc.file, {
          title: doc.name,
        });

        await recordUpload(doc.name);

        setDocuments((prev) =>
          prev.map((item) =>
            item.id === doc.id
              ? { ...item, status: "uploaded", response: result, error: null }
              : item
          )
        );
      } catch (err) {
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

    setIsUploading(false);
  };

  const handleRemoveDocument = (id) => {
    if (isUploading) return;
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleClearStaged = () => {
    if (isUploading) return;
    setDocuments((prev) => prev.filter((doc) => doc.status === "uploaded"));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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