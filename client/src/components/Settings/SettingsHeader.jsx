//This is the header compopnent for the settings page.

export default function SettingsHeader() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-slate-950 to-slate-900 px-6 py-6 text-white shadow-sm">
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