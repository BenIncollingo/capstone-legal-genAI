import React, { useState } from "react";
import { doPasswordReset, deleteUserAccount } from "../firebase/auth";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SettingsHeader from "../components/Settings/SettingsHeader.jsx";
import SettingsTabs from "../components/Settings/SettingsTabs.jsx";
import ProfileSettingsPanel from "../components/Settings/ProfileSettingsPanel.jsx";
import TermsPanel from "../components/Settings/TermsPanel.jsx";
import NavigationPanel from "../components/Settings/NavigationPanel.jsx";

export default function SettingsPage() {
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "terms", label: "Terms" },
    { key: "documents", label: "Documents" },
  ];

  async function handleCheckPassword() {
    try {
      const authInstance = getAuth();
      const currentUser = authInstance.currentUser;

      if (!currentUser || !currentUser.email) {
        console.error("No authenticated user");
        return false;
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );

      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (err) {
      console.error("Re-auth failed:", err.code, err.message);
      return false;
    }
  }

  function navigateUpload() {
    navigate("/documentUpload");
  }

  function navigateLibrary() {
    navigate("/documentLibrary");
  }

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure? This cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteUserAccount();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleResetPassword() {
    if (!user?.email) return;

    try {
      await doPasswordReset(user.email);
      alert("Password reset email sent.");
    } catch (err) {
      console.error(err);
      alert("Failed to send password reset email.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <SettingsHeader />

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <SettingsTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            {activeTab === "profile" && (
              <ProfileSettingsPanel
                password={password}
                setPassword={setPassword}
                checkPass={handleCheckPassword}
                onDeleteAccount={handleDelete}
                onReset={handleResetPassword}
              />
            )}

            {activeTab === "terms" && <TermsPanel />}

            {activeTab === "documents" && (
              <NavigationPanel
                onUpload={navigateUpload}
                onLibrary={navigateLibrary}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}