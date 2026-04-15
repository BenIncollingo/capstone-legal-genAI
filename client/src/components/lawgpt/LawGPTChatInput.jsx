export default function LawGPTChatInput({
  message,
  setMessage,
  onSend,
  isSending,
}) {
  return (
    <div className="sticky bottom-0 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a legal question..."
              rows={1}
              disabled={isSending}
              className="min-h-[52px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={onSend}
            disabled={isSending}
            className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-zinc-700 text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-400"
            aria-label="Send"
          >
            {isSending ? "…" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}