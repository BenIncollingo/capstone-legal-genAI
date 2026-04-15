import AuthBrandBlock from "./AuthBrandBlock.jsx";
import AuthHeroPanel from "./AuthHeroPanel.jsx";

export default function AuthShell({ heroProps, children }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <AuthHeroPanel {...heroProps} />

        <div className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-8 lg:min-h-0 lg:px-12">
          <div className="w-full max-w-md">
            <AuthBrandBlock mobile />
            {children}
            <p className="mt-6 text-center text-xs text-zinc-400 lg:hidden">
              &copy;2026 LegalAI Assistant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}