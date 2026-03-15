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
      await doSignInWithEmailAndPassword(email, password);
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
                <label
                  className="mb-2 block text-sm font-bold text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  className="mb-2 block text-sm font-bold text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="mb-2 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {errorMessage && (
                  <p className="text-xs italic text-red-500">{errorMessage}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  disabled={isSigningIn}
                  className={`rounded px-6 py-2 font-bold text-white focus:outline-none whitespace-nowrap ${
                    isSigningIn
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-500 hover:bg-blue-700"
                  }`}
                  type="submit"
                >
                  {isSigningIn ? "Signing In..." : "Sign In"}
                </button>

                <Link
                  className="inline-block text-sm font-bold text-blue-500 hover:text-blue-800"
                  to="/reset"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/create"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Create one
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