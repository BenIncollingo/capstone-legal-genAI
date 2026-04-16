export default function LawGPTSidebar({
  sidebarOpen,
  handleNewChat,
  conversations,
  activeIdx,
  loadConversationMessages,
  currentUser,
  settingsRef,
  settingsOpen,
  setSettingsOpen,
  handleLogout,
  isLoggingOut,
  onOpenSettings,
  handleDeleteConversation,
}) {
  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-zinc-200 bg-gradient-to-b from-slate-950 to-slate-900 text-white",
        "transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:static lg:translate-x-0",
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        <div className="p-3">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
          >
            <span className="text-lg leading-none">＋</span>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="space-y-1">
            {conversations.map((c, i) => {
              const active = i === activeIdx;

              return (
                <div
                  key={c.id}
                  className={[
                    "flex items-center gap-2 rounded-xl px-2 py-1 transition",
                    active ? "bg-white/15" : "hover:bg-white/10",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => loadConversationMessages(c.id, i)}
                    className="min-w-0 flex-1 rounded-xl px-1 py-1 text-left"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 opacity-80">💬</span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {c.title}
                        </div>
                        <div className="text-xs text-white/60">
                          {c.updated_at
                            ? new Date(c.updated_at).toLocaleString()
                            : ""}
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(c.id);
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm text-white/60 transition hover:bg-red-500/20 hover:text-red-400"
                    aria-label={`Delete ${c.title}`}
                    title="Delete conversation"
                  >
                    🗑️
                  </button>
                </div>
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
              <div className="truncate text-sm font-semibold">
                {currentUser ? currentUser.email : "Not logged in"}
              </div>
              <div className="text-xs text-white/60">Legal Assistant</div>
            </div>

            <div className="relative ml-auto" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setSettingsOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/10"
                aria-label="Settings"
              >
                ⚙️
              </button>

              {settingsOpen && (
                <div className="absolute right-0 bottom-12 z-50 w-44 rounded-xl border border-zinc-200 bg-white py-2 text-zinc-900 shadow-xl">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-zinc-100"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}