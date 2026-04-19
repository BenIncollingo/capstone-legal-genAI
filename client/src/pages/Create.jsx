//This is the react file for the Sign Up process
//it uses the components in  ../components/auth folder

import React, { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth.js";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell.jsx";
import CreateAccountFormCard from "../components/auth/CreateAccountFormCard.jsx";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const MAX_CREDENTIAL_LENGTH = 30;


  //function to submit users information to firebase - this function (along with all info inputted into form) get sent to the form card component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    //display error and quit if the users input does not meet the credentials needed
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

    //if the password and password confirmation dont match, display error and quit
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    //if the account is already in the process of being create (user clicked it again), quit
    if (isCreating) return;

    setIsCreating(true); //set to true while the creation process is taking place

    try {
      await doCreateUserWithEmailAndPassword(email.trim(), password); //call service function in ../firebase/auth.js to actually create account in firebase
      setSuccessMessage("Account created! Redirecting..."); //display success

      setTimeout(() => { //automatically redirect to login page after account was created
        navigate("/login");
      }, 1200);
    } catch (error) { //catch any errors on fail and display error meesage depending on error code
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
      setIsCreating(false); //regardles of outcome set to false because the process is over
    }
  };

  //the left side of the screen uses the AuthShell component and right side uses the create account form component
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