//this is the forgot password page

import React, { useState } from "react";
import { doPasswordReset } from "../firebase/auth.js";
import AuthShell from "../components/auth/AuthShell.jsx";
import ForgotPasswordFormCard from "../components/auth/ForgotPasswordFormCard.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const MAX_CREDENTIAL_LENGTH = 30;


  //function to handle the submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    //if there was no email provided, display error and quit
    if (!email || email.length > MAX_CREDENTIAL_LENGTH) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    if (isResetting) return; //if already in the prcoess of resetting, quit

    setIsResetting(true); // the to true while process starts

    try {
      await doPasswordReset(email.trim()); //service function in ../fireavse/auth.js to sent the reset email to the user
      setSuccessMessage("Password reset email sent."); //display success
      setEmail("");
    } catch (error) {
      setErrorMessage(error.message || "Failed to send reset email."); //display fail on error
    } finally {
      setIsResetting(false); //regardless of outcome, the process is done so set to false.
    }
  };

  return (
    <AuthShell
      heroProps={{
        badge: "Account recovery",
        title: "Reset your password and get back into your workspace.",
        description:
          "We’ll send a password reset email so you can securely regain access to your legal assistant account."
      }}
    >
      <ForgotPasswordFormCard
        email={email}
        setEmail={setEmail}
        errorMessage={errorMessage}
        successMessage={successMessage}
        isResetting={isResetting}
        handleSubmit={handleSubmit}
      />
    </AuthShell>
  );
}