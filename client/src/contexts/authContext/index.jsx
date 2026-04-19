//this file creates the authentication context for the application
//it tracks whether a user is signed in and makes auth state available throughout the app

import { auth } from "../../firebase/firebase";
import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doSignOut } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext(); //create auth context object

export function useAuth() {
  return useContext(AuthContext); //custom hook to access auth context values in other components
}

//provider component wraps the application and provides auth state
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); //store current signed in user
  const [userLoggedIn, setUserLoggedIn] = useState(false); //track whether user is logged in
  const [loading, setLoading] = useState(true); //prevent app rendering before auth check completes

  //listen for Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser); //register Firebase listener for login/logout changes
    return unsubscribe; //cleanup listener when component unmounts
  }, []);

  //function runs whenever auth state changes
  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user }); //store authenticated user data
      setUserLoggedIn(true); //mark user as logged in
    } else {
      setCurrentUser(null); //clear current user state
      setUserLoggedIn(false); //mark user as logged out
    }

    setLoading(false); //auth check complete
  }

  const value = {
    currentUser,
    userLoggedIn
  }; //values shared to all components using auth context

  //provide auth data to child components
  //only render app after initial auth loading finishes
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}