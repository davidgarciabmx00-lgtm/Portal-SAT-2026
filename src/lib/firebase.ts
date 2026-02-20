// src/lib/firebase.ts
import { getApps, initializeApp, deleteApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBktykEWCAKYL6Y77dWYZvDPD7bKmuTl58", // This might need updating
  authDomain: "tickets-alfred-smart.firebaseapp.com",
  projectId: "tickets-alfred-smart",
  storageBucket: "tickets-alfred-smart.firebasestorage.app",
  messagingSenderId: "570783950947", // This might need updating
  appId: "1:570783950947:web:01bf00cb80ed5f52ed7056", // This might need updating
  measurementId: "G-PKP8ZLC0C1" // This might need updating
};

if (getApps().length > 0) {
  deleteApp(getApps()[0]);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);