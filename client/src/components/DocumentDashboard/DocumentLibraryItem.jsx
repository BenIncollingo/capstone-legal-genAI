export default function DocumentLibraryItem({ name }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
        📄
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-900">{name}</p>
      </div>
    </li>
  );
}