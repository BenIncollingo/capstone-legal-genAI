//this is the component for the staging area.  its contains the StagedDocumentItem component and is used in the Document upload page

import StagedDocumentItem from "./StagedDocumentItem.jsx";

export default function StagingArea({
  documents,
  formatSize,
  handleRemoveDocument,
  isUploading,
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Staging Area</h2>
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
            <StagedDocumentItem
              key={doc.id}
              doc={doc}
              formatSize={formatSize}
              handleRemoveDocument={handleRemoveDocument}
              isUploading={isUploading}
            />
          ))}
        </ul>
      )}
    </section>
  );
}