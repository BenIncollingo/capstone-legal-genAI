export default function LawGPTHeader({
  sidebarOpen,
  setSidebarOpen,
  activeConversation,
  selectedConversationId,
}) {
  return (
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
            {selectedConversationId ? "Saved chat" : "Unsaved new chat"}
          </div>
        </div>
      </div>
    </header>
  );
}