import React, { use, useState } from 'react';


export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if login credentials actually have values inside
    if (!username || !password ) {
      alert("Please enter a username and a password.");
      return;
    }

    console.log('Login attempt with:', { username, password });
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-500 p-4 font-mono text-white">Lawbot</header>
      
      {/* Container for sign in form, button, and forgotten password link */}
      <div className="flex flex-col md:flex-row flex-grow items-center justify-center max-w-6xl mx-auto w-full">
        
        <main className="flex-1 flex justify-center items-center p-8 w-full order-2 md:order-1">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-100">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="username" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500" id="password" type="password" placeholder="" onChange={(e) => setPassword(e.target.value)} required />
                <p className="text-red-500 text-xs italic" hidden>Wrong Password</p>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none whitespace-nowrap" type="button" onClick={handleSubmit}>
                  Sign In
                </button>
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