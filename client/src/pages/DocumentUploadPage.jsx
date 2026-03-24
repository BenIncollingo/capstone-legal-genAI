import { useRef, useState } from "react";
import { uploadDocumentToBackend } from "../api/documents.api";

export default function DocumentsPage() {
  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
    const stagedDocs = documents.filter((doc) => doc.status === "staged" || doc.status === "failed");
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
    <div className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-700">
          Upload Documents
        </h1>

        <p className="mb-6 text-gray-600">
          Add files to the staging area, then upload them all at once.
        </p>

        <div
          onClick={handleOpenExplorer}
          className="cursor-pointer rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 p-10 text-center transition hover:border-blue-600 hover:bg-blue-100"
        >
          <p className="text-lg font-semibold text-blue-700">
            Click to choose documents
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Files will be added to the staging area first
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Staging Area
            </h2>

            <div className="text-sm text-gray-500">
              {documents.length} file{documents.length === 1 ? "" : "s"}
            </div>
          </div>

          {documents.length === 0 ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-gray-500">
              No files added yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="pr-4">
                    <p className="font-medium text-gray-800">{doc.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {doc.type} • {formatSize(doc.size)}
                    </p>

                    <div className="mt-2 text-sm">
                      {doc.status === "staged" && (
                        <span className="font-medium text-blue-600">
                          Staged
                        </span>
                      )}
                      {doc.status === "uploading" && (
                        <span className="font-medium text-yellow-600">
                          Uploading...
                        </span>
                      )}
                      {doc.status === "uploaded" && (
                        <span className="font-medium text-green-600">
                          Uploaded
                        </span>
                      )}
                      {doc.status === "failed" && (
                        <span className="font-medium text-red-600">
                          Failed
                        </span>
                      )}
                    </div>

                    {doc.error && (
                      <p className="mt-1 text-sm text-red-600">{doc.error}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc.id)}
                    disabled={isUploading}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleClearStaged}
            disabled={isUploading || documents.length === 0}
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Unuploaded Files
          </button>

          <button
            type="button"
            onClick={handleUploadAll}
            disabled={isUploading || stagedCount === 0}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isUploading ? "Uploading..." : `Upload All (${stagedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}