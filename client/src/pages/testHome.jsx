import DataButton from "../components/DataButton";
import { Link } from "react-router-dom";

export default function TestHome() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold tracking-tight">Legal Bot</div>
          <div className="text-xs text-zinc-400">Backend connected via DataButton</div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Sign In:</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Use the button below to hit the backend endpoint and confirm data flow.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <DataButton />
            <span className="text-xs text-zinc-500">
              If this works, frontend ↔ backend is wired correctly.
            </span>
          </div>

          <Link
            to="/LawGPT"
            className="text-sm text-blue-500 hover:underline"
          >
            Go to LawGPT Page
          </Link>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-sm font-semibold">Next step</div>
              <div className="mt-1 text-sm text-zinc-300">
                Show the returned data on the page instead of only logging it.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-sm font-semibold">UI polish</div>
              <div className="mt-1 text-sm text-zinc-300">
                Add consistent spacing, borders, and typography.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
