//This is the compononent in the settings page that allows the user to manage their account
//they have the option to delete their accoutn or change their password

import React, { useState } from "react";

export default function ProfileSettingsPanel({
  onDeleteAccount,
  onReset,
  password,
  setPassword,
  checkPass,
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUnlock(e) {
    e.preventDefault();
    setLoading(true);
    setShowError(false);

    const success = await checkPass();

    if (success) {
      setIsUnlocked(true);
    } else {
      setShowError(true);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold tracking-tight">Profile Settings</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Manage your account security and account deletion options.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
        <h3 className="text-base font-semibold text-zinc-900">Reset Password</h3>
        <p className="mt-2 text-sm text-zinc-600">
          Send a password reset email to your account email address.
        </p>
        <button
          type="button"
          className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          onClick={onReset}
        >
          Reset Password
        </button>
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h3 className="text-base font-semibold text-red-700">Delete Account</h3>
        <p className="mt-2 text-sm text-zinc-700">
          Re-enter your password to unlock permanent account deletion.
        </p>

        <form
          onSubmit={handleUnlock}
          className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4"
        >
          <label
            className="mb-2 block text-sm font-medium text-zinc-700"
            htmlFor="settings-password"
          >
            Password
          </label>

          <input
            id="settings-password"
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            type="password"
            placeholder="••••••••"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {showError && (
            <p className="mt-2 text-sm text-red-600">Incorrect password.</p>
          )}

          <button
            type="submit"
            disabled={loading || isUnlocked}
            className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : isUnlocked ? "Verified ✓" : "Unlock Delete"}
          </button>
        </form>

        <button
          type="button"
          disabled={!isUnlocked}
          onClick={onDeleteAccount}
          className={`mt-4 w-full rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            isUnlocked
              ? "bg-red-600 text-white hover:bg-red-700"
              : "cursor-not-allowed bg-zinc-300 text-zinc-500"
          }`}
        >
          Permanently Delete Account
        </button>
      </section>
    </div>
  );
}