import React, { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth.js";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/Auth/AuthShell.jsx";
import CreateAccountFormCard from "../components/Auth/CreateAccountFormCard.jsx";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const MAX_CREDENTIAL_LENGTH = 30;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !email ||
      !password ||
      !confirmPassword ||
      email.length > MAX_CREDENTIAL_LENGTH ||
      password.length > MAX_CREDENTIAL_LENGTH
    ) {
      setErrorMessage("Please enter valid credentials.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (isCreating) return;

    setIsCreating(true);

    try {
      await doCreateUserWithEmailAndPassword(email.trim(), password);
      setSuccessMessage("Account created! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("Email already in use.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email.");
          break;
        case "auth/weak-password":
          setErrorMessage("Password is too weak.");
          break;
        default:
          setErrorMessage("Failed to create account.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AuthShell
      heroProps={{
        badge: "New account",
        title: "Create your account and start building the workflow.",
        description:
          "Set up access to the legal assistant interface for document upload, research prompts, and cited responses."
      }}
    >
      <CreateAccountFormCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        errorMessage={errorMessage}
        successMessage={successMessage}
        isCreating={isCreating}
        handleSubmit={handleSubmit}
      />
    </AuthShell>
  );
}