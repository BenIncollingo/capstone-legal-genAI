//this is the component to display the empty state of the chat when the user clicks new chat
//this is used in the LawGPT page
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
    </>
  );
}