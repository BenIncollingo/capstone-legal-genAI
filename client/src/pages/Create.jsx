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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-blue-500 p-4 font-mono text-white">Lawbot</header>

      <div className="mx-auto flex w-full max-w-6xl flex-grow flex-col items-center justify-center md:flex-row">
        <main className="order-2 flex w-full flex-1 items-center justify-center p-8 md:order-1">
          <div className="w-full max-w-sm">
            <form
              onSubmit={handleSubmit}
              className="mb-4 rounded-lg border border-gray-100 bg-white px-8 pt-6 pb-8 shadow-md"
            >
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email
                </label>
                <input
                  className="w-full appearance-none rounded border px-3 py-2 text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Password
                </label>
                <input
                  className="w-full appearance-none rounded border px-3 py-2 text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Confirm Password
                </label>
                <input
                  className="mb-2 w-full appearance-none rounded border px-3 py-2 text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                {errorMessage && (
                  <p className="text-xs italic text-red-500">
                    {errorMessage}
                  </p>
                )}

                {successMessage && (
                  <p className="text-xs italic text-green-600">
                    {successMessage}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  disabled={isCreating}
                  className={`rounded px-6 py-2 font-bold text-white whitespace-nowrap ${
                    isCreating
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-500 hover:bg-blue-700"
                  }`}
                  type="submit"
                >
                  {isCreating ? "Creating..." : "Create Account"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm font-bold text-blue-500 hover:text-blue-800"
                >
                  Back to Login
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              &copy;2026 Lawbot Co. All rights reserved.
            </p>
          </div>
        </main>

        <aside className="order-1 flex flex-1 items-center justify-center p-8 md:order-2">
          <div className="max-w-xs md:max-w-md">
            <img
              src=""
              alt="Lawbot Logo"
              className="h-auto w-full object-contain"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}