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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || email.length > MAX_CREDENTIAL_LENGTH) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    if (isResetting) return;

    setIsResetting(true);

    try {
      await doPasswordReset(email.trim());
      setSuccessMessage("Password reset email sent.");
      setEmail("");
    } catch (error) {
      setErrorMessage(error.message || "Failed to send reset email.");
    } finally {
      setIsResetting(false);
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