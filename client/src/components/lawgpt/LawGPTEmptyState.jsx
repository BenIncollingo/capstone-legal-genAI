import { SUGGESTIONS } from "../../constants/lawgptSuggestions.js";

export default function LawGPTEmptyState({ setMessage }) {
  return (
    <>
      <div className="flex flex-col items-center pt-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm">
          ⚖️
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          LegalAI Assistant
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
          Your AI-powered legal research companion. Ask questions, get insights,
          and explore legal topics.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setMessage(s.desc)}
            className="group flex w-full items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300 hover:shadow"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg">
              {s.icon}
            </div>

            <div className="min-w-0">
              <div className="font-semibold">{s.title}</div>
              <div className="mt-1 text-sm text-zinc-600">{s.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            ⚠️
          </div>
          <div className="text-sm text-amber-900">
            <span className="font-semibold">Disclaimer:</span> This AI assistant
            provides general legal information only and should not be considered
            legal advice. Always consult with a licensed attorney for your
            specific situation.
          </div>
        </div>
      </div>
    </>
  );
}