import React, { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth.js";
import { Link, useNavigate } from "react-router-dom";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const MAX_CREDENTIAL_LENGTH = 30;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !email ||
      !password ||
      !confirmPassword ||
      email.length > MAX_CREDENTIAL_LENGTH ||
      password.length > MAX_CREDENTIAL_LENGTH
    ) {
      setErrorMessage("Please enter valid credentials.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (isCreating) return;

    setIsCreating(true);

    try {
      await doCreateUserWithEmailAndPassword(email.trim(), password);
      setSuccessMessage("Account created! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Signup failed:", error);

      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("Email already in use.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email.");
          break;
        case "auth/weak-password":
          setErrorMessage("Password is too weak.");
          break;
        default:
          setErrorMessage("Failed to create account.");
      }
    } finally {
      setIsCreating(false);
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
              New account
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight xl:text-5xl">
              Create your account and start building the workflow.
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-white/70">
              Set up access to the legal assistant interface for document upload,
              research prompts, and cited responses.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Built for your capstone</div>
                <div className="mt-1 text-sm text-white/65">
                  A more polished product look that matches the main LawGPT UI.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Simple and focused</div>
                <div className="mt-1 text-sm text-white/65">
                  Clean authentication flow without the default starter-app feel.
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
                  Create account
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Get started with your legal assistant workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />

                  {errorMessage && (
                    <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                  )}

                  {successMessage && (
                    <p className="mt-2 text-sm text-green-600">
                      {successMessage}
                    </p>
                  )}
                </div>

                <button
                  disabled={isCreating}
                  type="submit"
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition ${
                    isCreating
                      ? "cursor-not-allowed bg-zinc-400"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                  }`}
                >
                  {isCreating ? "Creating..." : "Create Account"}
                </button>
              </form>
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-zinc-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign in
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