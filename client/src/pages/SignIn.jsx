//This is the sign in page

import React, { useState } from "react";
import { doSignInWithEmailAndPassword } from "../firebase/auth.js";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell.jsx";
import SignInFormCard from "../components/auth/SignInFormCard.jsx";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_CREDENTIAL_LENGTH = 30;


  //function to handle submit to sign user in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    //display error if the user forgets something then quit
    if (
      !email ||
      !password ||
      email.length > MAX_CREDENTIAL_LENGTH ||
      password.length > MAX_CREDENTIAL_LENGTH
    ) {
      setErrorMessage("Please enter a valid email and password.");
      return;
    }

    //quit if already if process already started
    if (isSigningIn) return;

    setIsSigningIn(true); //set to true when process starts

    try {
      await doSignInWithEmailAndPassword(email.trim(), password); //service function in ../firebase/auth.js to sign user in
      navigate("/"); // once user is signed in, navigate to LawGPT page
    } catch (error) { //display error and quit on fail
      setErrorMessage(error.message || "Failed to sign in.");
    } finally {
      setIsSigningIn(false); //regardless of outcome, set to false because process is over
    }
  };

  //uses auth shell on left hand side, and then the sign in form card on the right which takes in all form data and handleSubmit function
  return (
    <AuthShell
      heroProps={{
        badge: "Welcome",
        title: "Sign in to continue your legal research workflow.",
        description:
          "Ask legal questions, upload supporting documents, and review AI-generated responses in one clean workspace.",
        features: [
          {
            title: "Document Uploads",
            description:
              "Stage and send legal documents to your backend workflow.",
          },
          {
            title: "Cited Responses",
            description:
              "Review answers alongside the sources returned by your system.",
          },
        ],
      }}
    >
      <SignInFormCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        errorMessage={errorMessage}
        isSigningIn={isSigningIn}
        handleSubmit={handleSubmit}
      />
    </AuthShell>
  );
}