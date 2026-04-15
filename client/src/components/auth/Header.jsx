export default function Header({ mobile = false }) {
  return (
    <div className={mobile ? "mb-8 lg:hidden" : ""}>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl shadow-sm ${
            mobile ? "text-white" : ""
          }`}
        >
          ⚖️
        </div>
        <div>
          <div
            className={`text-lg font-semibold tracking-tight ${
              mobile ? "text-zinc-900" : "text-white"
            }`}
          >
            LegalAI Assistant
          </div>
          <div
            className={mobile ? "text-sm text-zinc-500" : "text-sm text-white/65"}
          >
            Employment law information support
          </div>
        </div>
      </div>
    </div>
  );
}