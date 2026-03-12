// client/src/pages/Admin.jsx

import { useState, useRef } from "react";

async function uploadDocumentToBackend(file, metadata) {
  const formData = new FormData();
  formData.append("file", file);
  if (metadata) formData.append("metadata", JSON.stringify(metadata));

  const res = await fetch("/api/documents/uploadDocument", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return await res.json();
}

export default function Admin() {
  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpload = async (file) => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      await uploadDocumentToBackend(file, { title: file.name });
      setUploads((prev) => [
        {
          id: Date.now(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      showToast(`"${file.name}" uploaded successfully`);
    } catch (err) {
      console.error(err);
      showToast(err.message || `Failed to upload "${file.name}"`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const fileExt = (name) => name?.split(".").pop()?.toUpperCase() ?? "FILE";

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="flex min-h-screen flex-col">

        {/* Header — matches LawGPT */}
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="text-sm font-semibold">Document Manager</div>
            <div className="text-xs text-zinc-500">Admin</div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Upload Documents
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Upload legal documents to make them available for AI processing.
            </p>
          </div>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            className={[
              "rounded-2xl border-2 border-dashed px-6 py-16 text-center cursor-pointer transition-colors",
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100",
              uploading ? "pointer-events-none opacity-60" : "",
            ].join(" ")}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.md"
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-600" />
                <span className="text-sm text-zinc-500">Uploading…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  📄
                </div>
                <p className="text-sm text-zinc-600">
                  Drop a file here, or{" "}
                  <span className="text-blue-600 underline underline-offset-2">browse</span>
                </p>
                <p className="text-xs text-zinc-400">PDF, DOCX, TXT, MD</p>
              </div>
            )}
          </div>

          {/* Documents list */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
              <span className="text-sm font-semibold">Uploaded This Session</span>
              <span className="text-xs text-zinc-400">
                {uploads.length} document{uploads.length !== 1 ? "s" : ""}
              </span>
            </div>

            {uploads.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-zinc-400">
                No documents uploaded yet.
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {uploads.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
                      {fileExt(doc.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{doc.name}</div>
                      <div className="text-xs text-zinc-400">{formatDate(doc.uploadedAt)}</div>
                    </div>
                    <div className="shrink-0 text-xs text-zinc-400">{formatSize(doc.size)}</div>
                    <div className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                      Uploaded
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Disclaimer — matches LawGPT amber box */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                ⚠️
              </div>
              <div className="text-sm text-amber-900">
                <span className="font-semibold">Note:</span> This list resets on
                page refresh. Document persistence depends on your backend storage
                configuration.
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={[
            "fixed bottom-6 right-6 z-50 max-w-xs rounded-xl px-4 py-3 text-sm shadow-lg",
            toast.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700",
          ].join(" ")}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}