// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getStorage } from "firebase/storage"; // Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9frfp5leXVd4X4eBg0itRZIn2qDjBlPE",
  authDomain: "invoiced-5cc76.firebaseapp.com",
  projectId: "invoiced-5cc76",
  storageBucket: "invoiced-5cc76.appspot.com",
  messagingSenderId: "549554208370",
  appId: "1:549554208370:web:ddd28cc23e90a868e4cceb",
  measurementId: "G-5JHNSR725P"
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them for use throughout your app
export const auth = getAuth(app); // Authentication
export const googleProvider = new GoogleAuthProvider(); // Google Auth provider
export const db = getFirestore(app); // Firestore instance for database operations
export const storage = getStorage(app); // Storage instance for file uploads

// Export the Firebase app instance if needed elsewhere
export default app;
