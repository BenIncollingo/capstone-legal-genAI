import React, { use, useState } from 'react';

function buttonAction() {
  alert("Information was submitted.");
}

export default function SignIn() {
  const {username, setUsername} = useState('Hello');
  const {password, setPassword} = useState('');
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    // extracting name and value from target
    const {name, value} = e.target;
    setForm( (prevData) => ({
      ...prevData,
      [name]: value
  }))

  };
  return (
      <div class="">
        <header class="bg-blue-500 p-4 font-mono text-white">Lawbot</header>
        <div class="flex flex-col md:flex-row flex-grow items-center justify-center">
          <main class="flex-grow p-4 order-2 md:order-1">
            <div class="w-full max-w-xs">
              <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                    Username
                  </label>
                  <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" onChange={handleChange} required></input>
                </div>
                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                    Password
                  </label>
                  <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" onChange={handleChange} required></input>
                  <p class="text-red-500 text-xs italic">Please choose a password.</p>
                </div>
                <div class="flex items-center justify-between">
                  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={buttonAction}>
                    Sign In
                  </button>
                  <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                    Forgot Password?
                  </a>
                </div>
              </form>
              <p class="text-center text-gray-500 text-xs">
                &copy;2026 Lawbot Co. All rights reserved.
              </p>
            </div>
          </main>
          <aside class="w-full md:w-90 p-4 bg-white-200 order-1 md:order-2">
            <img src='client\public\logo512.png'></img>
          </aside>
        </div>
      </div>

  )
};