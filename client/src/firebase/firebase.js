// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "insert api key",
  authDomain: "genai-legal-488518.firebaseapp.com",
  projectId: "genai-legal-488518",
  storageBucket: "genai-legal-488518.firebasestorage.app",
  messagingSenderId: "248972960755",
  appId: "1:248972960755:web:c7e408942e4e84a0ade886"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth }