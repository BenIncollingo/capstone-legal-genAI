// This is a component for the Document Library page
// This is the section of the document library page that is list of all the DocumentLibraryItems
import DocumentLibraryItem from "./DocumentLibraryItem.jsx";

export default function DocumentLibraryList({ files }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Document Library
          </h2>
        </div>

        <div className="rounded-full px-3 py-1 text-xl text-black">
          {files.length}
        </div>
      </div>

      {files.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
          No uploaded files yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {files.map((file, i) => (
            <DocumentLibraryItem key={`${file}-${i}`} name={file} />
          ))}
        </ul>
      )}
    </section>
  );
}