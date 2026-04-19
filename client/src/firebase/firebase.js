//this file initializes and configures the Firebase connection for the application
//it connects the app to Firebase services for authentication and database access

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


//firebase project configuration values loaded from environment variables
//these values identify and connect this app to the correct Firebase project
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

//initialize Firebase application instance
const app = initializeApp(firebaseConfig);


//initialize Firebase services used by the application
const analytics = getAnalytics(app); //tracks usage analytics, not used currecntly
const auth = getAuth(app); //handles user authentication
const db = getFirestore(app); //connects to Firestore database


//export initialized services so they can be used throughout the project
export { app, auth, db };