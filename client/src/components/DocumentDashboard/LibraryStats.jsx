export default function LibraryStats({ totalUploads, recentCount }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-500">
          Total uploads tracked
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
          {totalUploads}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-500">
          Recent uploaded files
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
          {recentCount}
        </div>
      </div>
    </section>
  );
}