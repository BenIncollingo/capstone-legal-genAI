//This is the component in the settings page that allows the user to navigate to the docuemnt upload or document library pages

export default function NavigationPanel({ onUpload, onLibrary }) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold tracking-tight">Documents</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Jump to your document upload and library pages.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="text-base font-semibold text-zinc-900">Document Uploads</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Upload files to our library.
          </p>
          <button
            type="button"
            className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={onUpload}
          >
            Go to Uploads
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="text-base font-semibold text-zinc-900">Document Library</h3>
          <p className="mt-2 text-sm text-zinc-600">
            View our document library.
          </p>
          <button
            type="button"
            className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={onLibrary}
          >
            Go to Library
          </button>
        </div>
      </div>
    </div>
  );
}