import { extractUniqueSources } from "../../utils/citations.js";

export default function LawGPTMessageList({ messages, isSending }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {messages.map((msg, i) => {
        const uniqueSources =
          msg.role === "assistant"
            ? extractUniqueSources(msg.citations)
            : [];

        return (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-zinc-100 text-zinc-900"
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.text}</div>

            {msg.role === "assistant" && uniqueSources.length > 0 && (
              <div className="mt-3 border-t border-zinc-200 pt-3">
                <details className="group">
                  <summary className="cursor-pointer list-none text-xs font-medium text-zinc-500 hover:text-zinc-700">
                    Sources ({uniqueSources.length})
                  </summary>

                  <div className="mt-2 space-y-2">
                    {uniqueSources.map((item, idx) => (
                      <div
                        key={`${item.source}-${idx}`}
                        className="rounded-xl bg-white/70 px-3 py-2 text-xs text-zinc-700"
                      >
                        <div className="break-words">{item.source}</div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        );
      })}

      {isSending && (
        <div className="mr-auto max-w-[80%] rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-900 shadow-sm">
          <div className="whitespace-pre-wrap">
            <span className="font-semibold">Waiting for response...</span>
            {"\n"}
            This may take a few minutes if the AI service is starting up.
          </div>
        </div>
      )}
    </div>
  );
}