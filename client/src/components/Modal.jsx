import React from "react";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext/index.jsx";
import { useNavigate } from 'react-router-dom';

export default function Modal({onClose}) {

    const navigate = useNavigate(); // Initialize the navigate function

    const { currentUser } = useAuth();

    function onLogout() {
        if (currentUser) {
            doSignOut();
            console.log("onLogout called.");
            navigate("/home");
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="mt-10 flex flex-col gap-5 text-white pt-3">
                <button className="place-self-end hover:bg-gray-400 py-3 gap-3 rounded" onClick={onClose}>X</button>
                <div className="bg-slate-600 rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4">
                    <h1 className="text-3xl font-extrabold max-w-md">Logout?</h1>
                    <button className="text-3xl font-normal text-white flex hover:bg-gray-500 py-3 gap-3 rounded" onClick={ () => onLogout() }>Yes</button>
                    <button className="text-3xl font-normal text-white flex hover:bg-gray-500 py-3 gap-3 rounded" onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    )
}