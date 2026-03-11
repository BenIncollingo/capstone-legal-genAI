import React, { use, useState } from 'react';
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext/index.jsx"
import { Link } from 'react-router-dom';



export default function SignIn() {
  const { userLoggedIn } = useAuth();
  const { currentUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const MAXCREDENTIALLENGTH = 30;

  const handleSubmit = async (e) => {
    e.preventDefault();

        // Check if login credentials actually have values inside
    if (!email || !password || (email.length > MAXCREDENTIALLENGTH) || (password > MAXCREDENTIALLENGTH) ) {
      alert("Please enter a valid email and password.");

      return;
    }

    console.log('Login attempt with:', { email, password });

    if (!isSigningIn) {
      setIsSigningIn(true);
          try {
            await doSignInWithEmailAndPassword(email, password);
            console.log("User successfully logged in!");
          } catch (error) {
            console.error("Login failed:", error.message);
          } finally {
            setIsSigningIn(false);
          }

    }
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-500 p-4 font-mono text-white">Lawbot</header>
      
      {/* Container for sign in form, button, and forgotten password link */}
      <div className="flex flex-col md:flex-row flex-grow items-center justify-center max-w-6xl mx-auto w-full">
        
        <main className="flex-1 flex justify-center items-center p-8 w-full order-2 md:order-1">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-100">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="text" placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500" id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <p className="text-red-500 text-xs italic" hidden>Wrong Password</p>
              </div>
              
              <div className="flex items-center justify-between gap-4">                          
                    <Link to={`/LawGPT`}>
                      <button className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none whitespace-nowrap" type="button">
                        Sign In
                      </button>
                    </Link>

                <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                  Forgot Password?
                </a>
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

  )
};