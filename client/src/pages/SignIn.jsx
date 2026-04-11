import React, { useState } from "react";
import { doSignInWithEmailAndPassword } from "../firebase/auth.js";
import { useAuth } from "../contexts/authContext/index.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_CREDENTIAL_LENGTH = 30;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !email ||
      !password ||
      email.length > MAX_CREDENTIAL_LENGTH ||
      password.length > MAX_CREDENTIAL_LENGTH
    ) {
      setErrorMessage("Please enter a valid email and password.");
      return;
    }

    if (isSigningIn) return;

    setIsSigningIn(true);

    try {
      await doSignInWithEmailAndPassword(email.trim(), password);
      console.log("User successfully logged in!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorMessage(error.message || "Failed to sign in.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex lg:flex-col lg:justify-between bg-gradient-to-b from-slate-950 to-slate-900 text-white p-10 xl:p-14">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl shadow-sm">
                ⚖️
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight">
                  LegalAI Assistant
                </div>
                <div className="text-sm text-white/65">
                  Employment law information support
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">
              Secure access
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight xl:text-5xl">
              Sign in to continue your legal research workflow.
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-white/70">
              Ask legal questions, upload supporting documents, and review
              AI-generated responses in one clean workspace.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Document Uploads</div>
                <div className="mt-1 text-sm text-white/65">
                  Stage and send legal documents to your backend workflow.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Cited Responses</div>
                <div className="mt-1 text-sm text-white/65">
                  Review answers alongside the sources returned by your system.
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/45">
            &copy;2026 LegalAI Assistant
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white shadow-sm">
                  ⚖️
                </div>
                <div>
                  <div className="text-lg font-semibold tracking-tight">
                    LegalAI Assistant
                  </div>
                  <div className="text-sm text-zinc-500">
                    Employment law information support
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h2>
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

            <p className="mt-6 text-center text-xs text-zinc-400 lg:hidden">
              &copy;2026 LegalAI Assistant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}