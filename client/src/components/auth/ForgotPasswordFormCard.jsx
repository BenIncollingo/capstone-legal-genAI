////React compononent in auth pages.  This is the form for the forgot password sequence
import { Link } from "react-router-dom";

export default function ForgotPasswordFormCard({
  email,
  setEmail,
  errorMessage,
  successMessage,
  isResetting,
  handleSubmit,
}) {
  return (
    <>
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Reset password
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Enter your email and we&apos;ll send you a password reset link.
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

            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}

            {successMessage && (
              <p className="mt-2 text-sm text-green-600">{successMessage}</p>
            )}
          </div>

          <button
            disabled={isResetting}
            type="submit"
            className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition ${
              isResetting
                ? "cursor-not-allowed bg-zinc-400"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
            }`}
          >
            {isResetting ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm text-zinc-600">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </>
  );
}