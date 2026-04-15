import React, { useState } from "react";
import { doSignInWithEmailAndPassword } from "../firebase/auth.js";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/Auth/AuthShell.jsx";
import SignInFormCard from "../components/Auth/SignInFormCard.jsx";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_CREDENTIAL_LENGTH = 30;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !email ||
      !password ||
      email.length > MAX_CREDENTIAL_LENGTH ||
      password.length > MAX_CREDENTIAL_LENGTH
    ) {
      setErrorMessage("Please enter a valid email and password.");
      return;
    }

    if (isSigningIn) return;

    setIsSigningIn(true);

    try {
      await doSignInWithEmailAndPassword(email.trim(), password);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Failed to sign in.");
    } finally {
      setIsSigningIn(false);
    }
  };

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