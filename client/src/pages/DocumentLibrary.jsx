//This is the document library page, very simple, just calls a few componeonts to display everything

import { useCounter } from "../contexts/Counter/CounterProvider";
import DocumentsHero from "../components/DocumentDashboard/DocumentsHeader.jsx";
import DocumentLibraryList from "../components/DocumentDashboard/DocumentLibraryList.jsx";

export default function DocumentLibraryPage() {
  const { stats } = useCounter(); //fetches files from ../contexts/Counter/CounterProvider

  const recentFiles = stats?.recentFiles || []; //organizes stats and then passes into DocumentLibraryList

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