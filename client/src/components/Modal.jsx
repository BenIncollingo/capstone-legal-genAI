import React, {useRef, useState} from "react";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext/index.jsx";
import { useNavigate } from 'react-router-dom';

export default function Modal({ onClose }) {
  const modalRef = useRef();
  const [activeTab, setActiveTab] = useState();

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
            <button className="rounded py-2 text-left text-xl hover:bg-slate-500 px-3">
              Settings
            </button>
            <button className="rounded py-2 text-left text-xl hover:bg-slate-500 px-3">
              Profile
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h2 className="mb-4 text-2xl font-bold">Panel Content</h2>
          <button className="rounded bg-red-500 px-4 py-2 hover:bg-red-600">
            Action Button
          </button>
        </main>
        
      </div>
    </div>
  );
}