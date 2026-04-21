//this is the componeont that lists all the messages on the LawGPT page
//this displays the messages with the sourcres, accuracy score, and the citations from the sources

import { extractUniqueSources } from "../../utils/citations.js";

export default function LawGPTMessageList({ messages, isSending }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {messages.map((msg, i) => {
        const uniqueSources =
          msg.role === "assistant"
            ? extractUniqueSources(msg.citations)
            : [];

        const topScore =
          msg.role === "assistant" &&
          Array.isArray(msg.citations) &&
          msg.citations.length > 0 &&
          typeof msg.citations[0]?.score === "number"
            ? msg.citations[0].score
            : null;

        return (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-zinc-100 text-zinc-900"
            }`}
          >
            <div className="whitespace-pre-wrap">
              {msg.text}
            </div>

            {msg.role === "assistant" && topScore !== null && (
              <div className="mt-2 text-xs text-zinc-500">
                Accuracy: {topScore.toFixed(4)}
              </div>
            )}

            {msg.role === "assistant" && uniqueSources.length > 0 && (
              <div className="mt-3 border-t border-zinc-200 pt-3">
                <details className="group">
                  <summary className="cursor-pointer list-none text-xs font-medium text-zinc-500 hover:text-zinc-700">
                    {uniqueSources.length === 1
                      ? "Source (1)"
                      : `Sources (${uniqueSources.length})`}
                  </summary>

                  <div className="mt-2 space-y-3">
                    {uniqueSources.map((item, idx) => (
                     <a
                        key={`${item.source}-${item.content}-${idx}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl bg-white/70 px-3 py-2 text-xs text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-800"
                     >
                        {/*filename*/}
                        <div className="break-words font-semibold text-zinc-900">
                          {item.source}
                        </div>

                        {/*content directly under filename*/}
                        {item.content && (
                          <div className="mt-1 whitespace-pre-wrap break-words text-zinc-600">
                            {item.content}
                          </div>
                        )}

                        {/*score*/}
                        {typeof item.score === "number" && (
                          <div className="mt-2 text-[11px] text-zinc-500">
                            Score: {item.score.toFixed(4)}
                          </div>
                        )}
                      </a>
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
            We are processing your request now.
          </div>
        </div>
      )}
    </div>
  );
}