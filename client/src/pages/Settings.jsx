//this is the settings page

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

  //function to check password for account deletion process
  async function handleCheckPassword() {
    try {
      //get users auth instance
      const authInstance = getAuth();
      const currentUser = authInstance.currentUser;

      if (!currentUser || !currentUser.email) { //if there is no authenticated user (not signed in) then quit
        console.error("No authenticated user");
        return false;
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );

      await reauthenticateWithCredential(currentUser, credential); //attempt to reauthenticate with current user (do this to make sure the current user is the one deleting their account)
      return true;
    } catch (err) { //catch error on fail then quit
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


  //fucntion to handle the actual account deletion
  async function handleDelete() {
    const confirmed = window.confirm("Are you sure? This cannot be undone.");
    if (!confirmed) return;

    try { 
      await deleteUserAccount(); //serice function to delete users accoutn - found in ../firebase/auth.js
      navigate("/login"); //on success navigate to the sign in page
    } catch (err) { //catch error on fail
      console.error(err);
    }
  }

  //function to handle password reset
  async function handleResetPassword() {
    if (!user?.email) return; //if the user email not found then quit

    try {
      await doPasswordReset(user.email); //service function to send password reset email - ../firease/auth.js
      alert("Password reset email sent."); //notify user on success
    } catch (err) { //catch error on fail
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