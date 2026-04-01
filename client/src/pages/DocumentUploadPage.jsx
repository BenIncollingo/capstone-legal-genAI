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

  const uploadedCount = documents.filter(
    (doc) => doc.status === "uploaded"
  ).length;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white shadow-sm">
            ⚖️
          </div>

          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Document Uploads
            </h1>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Add documents
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Choose one or more files. They will be staged first, then
                uploaded together when you are ready.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenExplorer}
              className="group w-full rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                📄
              </div>

              <div className="mt-4 text-lg font-semibold text-zinc-900">
                Click to choose documents
              </div>

              <div className="mt-2 text-sm text-zinc-500">
                Supported files will be added to the staging area below
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleClearStaged}
                disabled={isUploading || documents.length === 0}
                className="rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear Unuploaded Files
              </button>

              <button
                type="button"
                onClick={handleUploadAll}
                disabled={isUploading || stagedCount === 0}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isUploading ? "Uploading..." : `Upload All (${stagedCount})`}
              </button>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Summary
              </h3>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="text-2xl font-semibold">{documents.length}</div>
                  <div className="text-sm text-zinc-600">Total files</div>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="text-2xl font-semibold">{stagedCount}</div>
                  <div className="text-sm text-zinc-600">Ready to upload</div>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="text-2xl font-semibold">{uploadedCount}</div>
                  <div className="text-sm text-zinc-600">Uploaded</div>
                </div>
              </div>
            </div>

            
          </aside>
        </div>

        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Staging Area
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Review file details and upload status before sending.
              </p>
            </div>

            <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600">
              {documents.length} file{documents.length === 1 ? "" : "s"}
            </div>
          </div>

          {documents.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
              No files added yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        📄
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-zinc-900">
                          {doc.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {doc.type} • {formatSize(doc.size)}
                        </p>

                        <div className="mt-3">
                          {doc.status === "staged" && (
                            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              Staged
                            </span>
                          )}

                          {doc.status === "uploading" && (
                            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              Uploading...
                            </span>
                          )}

                          {doc.status === "uploaded" && (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Uploaded
                            </span>
                          )}

                          {doc.status === "failed" && (
                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Failed
                            </span>
                          )}
                        </div>

                        {doc.error && (
                          <p className="mt-2 text-sm text-red-600">
                            {doc.error}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc.id)}
                    disabled={isUploading}
                    className="self-start rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}