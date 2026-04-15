import { Link } from "react-router-dom";

export default function SignInFormCard({
  email,
  setEmail,
  password,
  setPassword,
  errorMessage,
  isSigningIn,
  handleSubmit,
}) {
  return (
    <>
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Sign in to access your legal assistant workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-zinc-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                className="block text-sm font-medium text-zinc-700"
                htmlFor="password"
              >
                Password
              </label>

              <Link
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                to="/reset"
              >
                Forgot password?
              </Link>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>

          <button
            disabled={isSigningIn}
            type="submit"
            className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition ${
              isSigningIn
                ? "cursor-not-allowed bg-zinc-400"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
            }`}
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/create"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </>
  );
}