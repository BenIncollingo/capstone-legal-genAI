// //React compononent in auth pages.  This is the actual left panel shell that goes into AuthShell
import Header from "./Header.jsx";

export default function LeftPanel({
  badge,
  title,
  description,
  features = [],
}) {
  return (
    <div className="hidden min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-center xl:p-14">
      <div className="w-full max-w-xl">
        <Header />

        <div className="mt-12">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">
            {badge}
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight xl:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-lg text-base leading-7 text-white/70">
            {description}
          </p>

          {features.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="text-sm font-semibold">{feature.title}</div>
                  <div className="mt-1 text-sm text-white/65">
                    {feature.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}