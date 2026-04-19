//this file contains all firebase authentication functions and exports them for use in the react pages

import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  updatePassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  deleteUser
} from "firebase/auth";


//function to create a new user account with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};


//function to sign in an existing user with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};


//function to sign the current user out
export const doSignOut = () => {
  return auth.signOut();
};


//function to send password reset email to user
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};


//function to change password for currently logged in user
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};


//function to send email verification to current user
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`, //redirect after verification
  });
};


//function to delete the currently logged in user account
export const deleteUserAccount = () => {
  return deleteUser(auth.currentUser);
};