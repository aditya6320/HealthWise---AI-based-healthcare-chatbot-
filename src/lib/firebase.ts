import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkmdDVmPgnnhnQYkddEa--YRJLvBqft4E",
  authDomain: "healthwise-4694a.firebaseapp.com",
  projectId: "healthwise-4694a",
  storageBucket: "healthwise-4694a.firebasestorage.app",
  messagingSenderId: "512443060871",
  appId: "1:512443060871:web:f96533bae3d78918e0de22",
  measurementId: "G-J9W4ZSN9L7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const functions = getFunctions(app);

export { app, auth, analytics, functions };