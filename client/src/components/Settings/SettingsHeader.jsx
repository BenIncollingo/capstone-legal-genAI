import { useNavigate } from "react-router-dom";

//This is the header component for the settings page.

export default function SettingsHeader() {
  const navigate = useNavigate();

  return (
    <section className="rounded-3xl bg-gradient-to-r from-slate-950 to-slate-900 px-6 py-6 text-white shadow-sm">

      {/* Back Button */}
      <button
        onClick={() => navigate("/lawgpt")}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        ← Back to Chat
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl shadow-sm">
          ⚖️
        </div>

        <div className="min-w-0">
          <div className="text-sm font-medium uppercase tracking-[0.16em] text-white/60">
            LegalAI Assistant
          </div>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
            Manage account options, review terms, and navigate to your document tools.
          </p>
        </div>
      </div>
    </section>
  );
}