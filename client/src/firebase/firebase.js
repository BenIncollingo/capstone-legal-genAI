// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.,
  authDomain: "legal-chatbot-31533.firebaseapp.com",
  projectId: "legal-chatbot-31533",
  storageBucket: "legal-chatbot-31533.firebasestorage.app",
  messagingSenderId: "72850530246",
  appId: "1:72850530246:web:2b73085cb85ee7bbfb1cc7",
  measurementId: "G-K4Q08VTVLH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth }