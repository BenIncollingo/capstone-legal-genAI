import React, { use, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword, doPasswordReset } from '../firebase/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isReseting, setIsReseting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const MAXCREDENTIALLENGTH = 30;



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if login credentials actually have values inside
    if (!email || (email.length > MAXCREDENTIALLENGTH)) {
      alert("Please enter a valid email.");

      return;
    }

    if(!isReseting) {
      setIsReseting(true);
      try {
        await doPasswordReset(email);
        console.log("Successful reset!")
      } catch (error) {
        console.error("Reset failed.");
        alert("Enter valid email address.");
        setErrorMessage(error.message);
      } finally {
        setIsReseting(false);
      }
    }

    // reset the email field
    setEmail('');

    console.log('Reset attempt with:', { email });
  };



  return (
    <>
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-500 p-4 font-mono text-white">Lawbot</header>
      
      {/* Container for sign in form, button, and forgotten password link */}
      <div className="flex flex-col md:flex-row flex-grow items-center justify-center max-w-6xl mx-auto w-full">
        
        <main className="flex-1 flex justify-center items-center p-8 w-full order-2 md:order-1">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-100">
              <h1 class="bold text-2xl font-semibold">Forgot your password? Send a password reset email:</h1>
              <br></br>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Enter your email:
                </label>
                <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="text" placeholder="email@example.com" required />
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none whitespace-nowrap" type="button" onClick={handleSubmit}>
                  Reset Password
                </button>
              </div>
            </form>
            <p className="text-center text-gray-400 text-xs">
              &copy;2026 Lawbot Co. All rights reserved.
            </p>
          </div>
        </main>

        {/* Image Section: flex-1 ensures it also takes 50% width */}
        <aside className="flex-1 flex justify-center items-center p-8 order-1 md:order-2">
          <div className="max-w-xs md:max-w-md">
            <img src="client\public\logo512.png" alt="Lawbot Logo" className="w-full h-auto object-contain" />
          </div>
        </aside>
      </div>
    </div>
    </>


  )
}