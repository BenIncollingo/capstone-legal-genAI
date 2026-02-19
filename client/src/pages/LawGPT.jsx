import { useMemo, useState } from "react";

const CONVERSATIONS = [
  { title: "Contract law basics", when: "Today" },
  { title: "Employment rights", when: "Yesterday" },
  { title: "Small business incorporation", when: "Feb 8" },
  { title: "Intellectual property", when: "Feb 7" },
];

const SUGGESTIONS = [
  {
    title: "Contract Review",
    desc: "What are the key elements of a valid contract?",
    icon: "📄",
  },
  {
    title: "Legal Rights",
    desc: "What are my rights as a tenant if my landlord wants to raise rent?",
    icon: "📘",
  },
  {
    title: "Business Law",
    desc: "What's the difference between an LLC and a corporation?",
    icon: "🛡️",
  },
  {
    title: "Legal Process",
    desc: "How does the small claims court process work?",
    icon: "ℹ️",
  },
];

export default function Assistant() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop default open
  const [activeIdx, setActiveIdx] = useState(0);
  const [message, setMessage] = useState("");

  const activeConversation = useMemo(
    () => CONVERSATIONS[activeIdx] ?? { title: "New Chat", when: "" },
    [activeIdx]
  );

  const onSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    console.log("Send:", trimmed, "to", activeConversation.title);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Layout wrapper */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-zinc-200 bg-gradient-to-b from-slate-950 to-slate-900 text-white",
            "transition-transform duration-200",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:static lg:translate-x-0",
          ].join(" ")}
        >
          <div className="flex h-full flex-col">
            {/* Top: New Chat */}
            <div className="p-3">
              <button
                type="button"
                onClick={() => {
                  // later: create new conversation in state
                  setActiveIdx(0);
                }}
                className="flex w-full items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
              >
                <span className="text-lg leading-none">＋</span>
                New Chat
              </button>
            </div>

            {/* Conversation list
            <div className="px-2 pb-2">
              <div className="space-y-1">
                {CONVERSATIONS.map((c, i) => {
                  const active = i === activeIdx;
                  return (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={[
                        "w-full rounded-xl px-3 py-2 text-left transition",
                        active ? "bg-white/15" : "hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 opacity-80">💬</span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">
                            {c.title}
                          </div>
                          <div className="text-xs text-white/60">{c.when}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div> */}

            {/* Conversation list (scrolls) */}
            <div className="flex-1 overflow-y-auto px-2 pb-2">
            <div className="space-y-1">
                {CONVERSATIONS.map((c, i) => {
                const active = i === activeIdx;
                return (
                    <button
                    key={c.title}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={[
                        "w-full rounded-xl px-3 py-2 text-left transition",
                        active ? "bg-white/15" : "hover:bg-white/10",
                    ].join(" ")}
                    >
                    <div className="flex items-start gap-2">
                        <span className="mt-0.5 opacity-80">💬</span>
                        <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{c.title}</div>
                        <div className="text-xs text-white/60">{c.when}</div>
                        </div>
                    </div>
                    </button>
                );
                })}
            </div>
            </div>


            <div className="mt-auto border-t border-white/10 p-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                  ⚖️
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">LegalAI</div>
                  <div className="text-xs text-white/60">Legal Assistant</div>
                </div>
                <button
                  type="button"
                  className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/10"
                  aria-label="Settings"
                >
                  ⚙️
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-zinc-100 lg:hidden"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Toggle sidebar"
              >
                <div className="space-y-1.5">
                  <div className="h-0.5 w-5 bg-zinc-900" />
                  <div className="h-0.5 w-5 bg-zinc-900" />
                  <div className="h-0.5 w-5 bg-zinc-900" />
                </div>
              </button>

              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {activeConversation.title}
                </div>
                <div className="text-xs text-zinc-500">
                  {activeConversation.when || " "}
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="mx-auto w-full max-w-6xl flex-1 px-4">
            <div className="flex flex-col items-center pt-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm">
                ⚖️
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                LegalAI Assistant
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
                Your AI-powered legal research companion. Ask questions, get insights, and explore
                legal topics.
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
                  <span className="font-semibold">Disclaimer:</span> This AI assistant provides
                  general legal information only and should not be considered legal advice. Always
                  consult with a licensed attorney for your specific situation.
                </div>
              </div>
            </div>

            <div className="h-32" />
          </main>

          {/* Sticky composer */}
          <div className="sticky bottom-0 border-t border-zinc-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a legal question..."
                    rows={1}
                    className="min-h-[52px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                      }
                    }}
                  />
                  <div className="mt-2 text-xs text-zinc-500">
                    This is an AI assistant. Always verify legal information with a licensed
                    attorney.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSend}
                  className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-zinc-700 text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]"
                  aria-label="Send"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: optional collapse toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen((v) => !v)}
        className="hidden lg:fixed lg:left-3 lg:top-3 lg:z-50 lg:inline-flex lg:h-10 lg:w-10 lg:items-center lg:justify-center lg:rounded-lg lg:bg-white lg:shadow-sm lg:hover:bg-zinc-50"
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        ☰
      </button>
    </div>
  );
}
