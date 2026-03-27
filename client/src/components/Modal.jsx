import React, {useRef, useState} from "react";
import { doSignOut } from "../firebase/auth";
import { doPasswordReset } from "../firebase/auth";
import { useAuth } from "../contexts/authContext/index.jsx";
import { Link, useNavigate } from "react-router-dom";


function UploadOptions({ onUpload }) {
    return(
      <>
      <h4 className="font-semibold">Display</h4>
      <p>You can upload documents here if you are an admin.</p>
      <button className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap" onClick={onUpload}>Upload Document</button>
      </>
    )
}

function ChatOptions({ onDeleteChat }) {
  return (
    <>
      <h5 className="font-semibold">Delete Chat History?</h5>
      <p>This will permanently delete the chat history associated with your account.</p>
      <button className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap" onClick={onDeleteChat}>Delete Chat History</button>
    </>
  )
};

function ProfileOptions({ onReset }) { 
  return(
  <>
    <h5 className="font-semibold">Reset Password?</h5>
    <p>This button will reset your account's password.</p>
    <button className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap" onClick={onReset}>Reset Password</button>
</>)};

function DisplayOptions({onViewTerms}) {
  return(
    <>
    <h4 className="font-semibold">Terms</h4>
    <p>View the terms of service.</p>
    <button className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap" onClick={onViewTerms}>View Terms</button>
    </>
  )
}


export default function Modal({ onClose }) {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef();

  const tabSettings = {
    PROFILE: "profile",
    TERMS: "terms",
    CHAT: "chat",
    UPLOAD: "upload"
  };

  const [toggleNight, setToggleNight] = useState("false");

  function navigateUpload() {
    onClose();
    navigate("/documentUpload");
    console.log("navigate Upload");
  }

  const [activeTab, setActiveTab] = useState(tabSettings.PROFILE);

  
  const closeModal = (e) => {
    if (modalRef.current === e.target) onClose();
  };


  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4"
    >
      <div className="relative flex w-full max-w-4xl flex-col rounded-xl bg-slate-600 text-white shadow-2xl md:flex-row overflow-hidden">
        

        <button 
          className="absolute right-4 top-4 z-10 hover:text-gray-400 font-bold" 
          onClick={onClose}
        >
          ✕
        </button>

        <aside className="w-full border-b border-slate-500 p-8 md:w-1/3 md:border-b-0 md:border-r">
          <nav className="flex flex-col gap-4">
            <button className="rounded py-2 text-left text-xl hover:bg-slate-500 px-3" onClick={() => {setActiveTab(tabSettings.PROFILE)}}>
              Profile
            </button>
            <button className="rounded py-2 text-left text-xl hover:bg-slate-500 px-3" onClick={() => {setActiveTab(tabSettings.TERMS)}}>
              Terms
            </button>
            <button className="rounded py-2 text-left text-xl hover:bg-slate-500 px-3" onClick={() => {setActiveTab(tabSettings.CHAT)}}>
              Chat
            </button>
            <button className="rounded py-2 text-left text-xl hover:bg-slate-500 px-3" onClick={() => {setActiveTab(tabSettings.UPLOAD)}}>
              Upload
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          { activeTab === tabSettings.PROFILE && <>
          <ProfileOptions onReset={doPasswordReset}></ProfileOptions>
          </>}
          { activeTab === tabSettings.TERMS && <>
          <DisplayOptions onViewTerms={() => {}}></DisplayOptions>
          </>}
          { activeTab === tabSettings.CHAT && <>
          <ChatOptions onDeleteChat={() => {console.log("onDeleteChat")}}></ChatOptions>
          </>}
          { activeTab === tabSettings.UPLOAD && <>
          <UploadOptions onUpload={navigateUpload}></UploadOptions>
          </>}
        </main>
        
      </div>
    </div>
  );
}