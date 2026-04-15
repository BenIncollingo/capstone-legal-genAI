import { useCounter } from "../contexts/Counter/CounterProvider";
import DocumentsHero from "../components/DocumentDashboard/DocumentsHeader.jsx";
import DocumentLibraryList from "../components/DocumentDashboard/DocumentLibraryList.jsx";

export default function DocumentLibraryPage() {
  const { stats } = useCounter();

  const recentFiles = stats?.recentFiles || [];
  const totalUploads = stats?.total || 0;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-7xl px-4 py-5">
        <DocumentsHero
          title="Document Library"
          description="Browse the files your upload tracker has recorded."
        />

        <div className="mt-6">
          <DocumentLibraryList files={recentFiles} />
        </div>
      </main>
    </div>
  );
}