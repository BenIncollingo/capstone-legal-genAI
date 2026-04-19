//this is the componeont for the documents in the staging area ready to be uploaded
//this compononent is used in the StagingArea components

export default function StagedDocumentItem({
  doc,
  formatSize,
  handleRemoveDocument,
  isUploading,
}) {
  //these are the styles for status in each part of the process - when its staged its blue, when its uploading its yellow/amber, when its uploaded its green and its red on fail
  const statusStyles = {
    staged: "bg-blue-100 text-blue-700",
    uploading: "bg-amber-100 text-amber-700",
    uploaded: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    staged: "Staged",
    uploading: "Uploading...",
    uploaded: "Uploaded",
    failed: "Failed",
  };

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 pr-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            📄
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-zinc-900">{doc.name}</p>
            <p className="mt-1 text-sm text-zinc-500">
              {doc.type} • {formatSize(doc.size)}
            </p>

            <div className="mt-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[doc.status]
                }`}
              >
                {statusLabels[doc.status]}
              </span>
            </div>

            {doc.error && (
              <p className="mt-2 text-sm text-red-600">{doc.error}</p>
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
  );
}