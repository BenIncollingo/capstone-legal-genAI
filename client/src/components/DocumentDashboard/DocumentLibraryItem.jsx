// component in the document library page
// this is the componoent for the boxes in the list of document names

import { useState } from "react";
import { deleteDocument } from "../../api/documents.api.js"; // adjust path if needed

export default function DocumentLibraryItem({ name, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmed = window.confirm(`Delete ${name}?`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteDocument(name);

      if (onDeleteSuccess) {
        onDeleteSuccess(name);
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
          📄
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-900">{name}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="shrink-0 rounded-xl px-3 py-2 text-xs font-medium text-zinc-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
}