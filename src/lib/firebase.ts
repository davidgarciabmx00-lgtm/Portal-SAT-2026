// src/lib/firebase.ts
import { getApps, initializeApp, deleteApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBktykEWCAKYL6Y77dWYZvDPD7bKmuTl58",
  authDomain: "portal-sat.firebaseapp.com",
  projectId: "portal-sat",
  storageBucket: "portal-sat.firebasestorage.app",
  messagingSenderId: "570783950947",
  appId: "1:570783950947:web:01bf00cb80ed5f52ed7056",
  measurementId: "G-PKP8ZLC0C1"
};

if (getApps().length > 0) {
  deleteApp(getApps()[0]);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);