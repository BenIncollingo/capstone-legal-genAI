//this is the document upload panel component and it is used in the dicument upload page. 
//it allows the user to open their file explorer and select files to be uploaded.
export default function DocumentUploadPanel({
  fileInputRef,
  handleOpenExplorer,
  handleFileChange,
  handleClearStaged,
  handleUploadAll,
  isUploading,
  documents,
  stagedCount,
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Add documents</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Choose one or more files. They will be staged first, then uploaded
          together when you are ready.
        </p>
      </div>

      <button
        type="button"
        onClick={handleOpenExplorer}
        className="group w-full rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
          📄
        </div>

        <div className="mt-4 text-lg font-semibold text-zinc-900">
          Click to choose documents
        </div>

        <div className="mt-2 text-sm text-zinc-500">
          Files will be added to the staging area
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-6">
        <button
          type="button"
          onClick={handleUploadAll}
          disabled={isUploading || stagedCount === 0}
          className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isUploading ? "Uploading..." : `Upload All (${stagedCount})`}
        </button>

        <button
          type="button"
          onClick={handleClearStaged}
          disabled={isUploading || documents.length === 0}
          className="rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear Unuploaded Files
        </button>
      </div>
    </section>
  );
}