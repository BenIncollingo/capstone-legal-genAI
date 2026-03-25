import React, {useRef, useState} from "react";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext/index.jsx";
import { useNavigate } from 'react-router-dom';

export default function Modal({ onClose }) {
  const modalRef = useRef();

  const tabSettings = {
    PROFILE: "profile",
    DISPLAY: "display",
    CHAT: "chat",
    UPLOAD: "upload"
  };

  const [toggleNight, setToggleNight] = useState("false");

  function ProfileOptions() { 
    return(
  <>
    <h5 className="font-semibold">Delete Account?</h5>
    <p>This button will delete your account and your chat history. Think twice before pressing this.</p>
    <button className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap">Delete Account</button>
  </>)};

  function DisplayOptions() {
    return(
      <>
      <h4 className="font-semibold">Display</h4>
      <p>Toggle Night Mode?</p>
      <button className="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap" onClick={() => {setToggleNight((prev) => !prev)}}>{toggleNight ? "Turn Night Mode on?" : "Turn off Night mode?"}</button>
      </>
    )
  }

  const [activeTab, setActiveTab] = useState(tabSettings.PROFILE);

  

  const closeModal = (e) => {
    if (modalRef.current === e.target) onClose();
  };

  const profileClick = (e) => {

  }

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
            <button className="rounded py-2 text-left text-xl hover:bg-slate-500 px-3" onClick={() => {setActiveTab(tabSettings.DISPLAY)}}>
              Display
            </button>
            <button className="rounded py-2 text-left text-xl hover:bg-slate-500 px-3" onClick={() => {setActiveTab(tabSettings.CHAT)}}>
              Chat
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          { activeTab === tabSettings.PROFILE && <>
          <ProfileOptions></ProfileOptions>
          </>}
          { activeTab === tabSettings.DISPLAY && <>
          <DisplayOptions></DisplayOptions>
          </>}
          { activeTab === tabSettings.CHAT && <>
          <h1>This is chat tab</h1>
          </>}
        </main>
        
      </div>
    </div>
  );
}