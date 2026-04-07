import React, { useRef, useState } from "react";
import { doSignOut, doPasswordReset, deleteUserAccount } from "../firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

function UploadOptions({ onUpload }) {
  return (
    <>
      <h4 className="font-semibold">Display</h4>
      <p>You can upload documents here if you are an admin.</p>
      <button 
        className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap mt-2" 
        onClick={onUpload}
      >
        Upload Document
      </button>
    </>
  );
}

function ChatOptions({ onDeleteChat }) {
  return (
    <>
      <h5 className="font-semibold">Delete Chat History?</h5>
      <p>This will permanently delete the chat history associated with your account.</p>
      <button 
        className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap mt-2" 
        onClick={onDeleteChat}
      >
        Delete Chat History
      </button>
    </>
  );
}

function ProfileOptions({ onDeleteAccount, onReset, onSet, passwordProp, checkPass }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetStatus, sentReset] = useState("false");

  async function handleUnlock(e) {
    e.preventDefault();
    setLoading(true);
    setShowError(false);

    // checkPass should be an async function that re-authenticates with Firebase
    const success = await checkPass();
    
    if (success) {
      setIsUnlocked(true);
    } else {
      setShowError(true);
    }
    setLoading(false);
  }

  return (
    <>
      <h5 className="font-semibold">Reset Password?</h5>
      <p>This button will reset your account's password.</p>
      <button 
        className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-2" 
        onClick={onReset}
      >
        Reset Password
      </button>

      <h5 className="font-semibold mt-6">Delete Account?</h5>
      <p className="text-sm text-gray-300">Re-enter password to enable the delete button.</p>
      
      <form
        onSubmit={handleUnlock}
        className="mb-4 mt-2 rounded-lg border border-gray-500 bg-slate-700 px-6 pt-4 pb-6 shadow-md"
      >
        <label className="block text-sm mb-2">Password:</label>
        <input
          className="w-full rounded border px-3 py-2 text-gray-900 focus:outline-none"
          type="password"
          placeholder="••••••••"
          value={passwordProp || ""} // FIX: Prevents Controlled/Uncontrolled error
          onChange={(e) => onSet(e.target.value)}
          required
        />
        
        {showError && <p className="text-red-400 text-sm mt-2">Incorrect password.</p>}
        
        <button 
          type="submit"
          disabled={loading || isUnlocked}
          className="mt-4 bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
        >
          {loading ? "Verifying..." : isUnlocked ? "Verified ✓" : "Unlock Delete"}
        </button>
      </form>

      <button 
        disabled={!isUnlocked} 
        onClick={onDeleteAccount}
        className={`w-full font-bold py-2 px-6 rounded transition-colors ${
          isUnlocked 
            ? "bg-red-600 hover:bg-red-700 text-white" 
            : "bg-slate-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        Permanently Delete Account
      </button>
    </>
  );
}

function DisplayOptions({ onViewTerms }) {
  return (
    <>
      <h4 className="font-semibold">Terms</h4>
      <p>View the terms of service.</p>
      <button 
        className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap mt-2" 
        onClick={onViewTerms}
      >
        View Terms
      </button>
    </>
  );
}

export default function Modal({ onClose }) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef();
  const auth = getAuth();
  const user = auth.currentUser;

  const tabSettings = {
    PROFILE: "profile",
    TERMS: "terms",
    CHAT: "chat",
    UPLOAD: "upload"
  };

  const [activeTab, setActiveTab] = useState(tabSettings.PROFILE);

  // Firebase Re-authentication Logic
  async function handleCheckPassword() {
    try {
      const auth = getAuth();
      const user = auth.currentUser; // ✅ REAL Firebase user

      if (!user) {
        console.error("No authenticated user");
        return false;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        password
      );

      await reauthenticateWithCredential(user, credential);

      return true;
    } catch (err) {
      console.error("Re-auth failed:", err.code, err.message);
      return false;
    }
}

  function navigateUpload() {
    onClose();
    navigate("/documentUpload");
  }

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure? This cannot be undone.");
    if (confirmed) {
      try {
        await deleteUserAccount();
        onClose();
        navigate("/login");
      } catch (err) {
        console.error(err);
      }
    }
  }

  const closeModal = (e) => {
    if (modalRef.current === e.target) onClose();
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4"
    >
      <div className="relative flex w-full max-w-4xl flex-col rounded-xl bg-slate-600 text-white shadow-2xl md:flex-row overflow-hidden border border-slate-500">
        
        <button 
          className="absolute right-4 top-4 z-10 hover:text-gray-400 font-bold" 
          onClick={onClose}
        >
          ✕
        </button>

        <aside className="w-full border-b border-slate-500 p-8 md:w-1/3 md:border-b-0 md:border-r bg-slate-700">
          <nav className="flex flex-col gap-4">
            {Object.entries(tabSettings).map(([key, value]) => (
              <button 
                key={key}
                className={`rounded py-2 text-left text-xl px-3 transition-colors ${activeTab === value ? 'bg-slate-500' : 'hover:bg-slate-500'}`} 
                onClick={() => setActiveTab(value)}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-slate-600 overflow-y-auto max-h-[80vh]">
          { activeTab === tabSettings.PROFILE && (
            <ProfileOptions 
              onDeleteAccount={handleDelete} 
              onReset={() => doPasswordReset(user.email)} 
              onSet={setPassword} 
              passwordProp={password} 
              checkPass={handleCheckPassword}
            />
          )}
          { activeTab === tabSettings.TERMS && <DisplayOptions onViewTerms={() => {}} /> }
          { activeTab === tabSettings.CHAT && <ChatOptions onDeleteChat={() => console.log("Delete Chat")} /> }
          { activeTab === tabSettings.UPLOAD && <UploadOptions onUpload={navigateUpload} /> }
        </main>
      </div>
    </div>
  );
}
