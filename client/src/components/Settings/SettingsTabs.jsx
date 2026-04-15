export default function SettingsTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}