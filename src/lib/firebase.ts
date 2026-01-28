// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDLK0kYtulUzvkPsV1rAmEWtOI1_rQxDbE",
  authDomain: "soporte-sat.firebaseapp.com",
  projectId: "soporte-sat",
  storageBucket: "soporte-sat.firebasestorage.app",
  messagingSenderId: "1058754500488",
  appId: "1:1058754500488:web:a8040573120a5466620c3d",
  measurementId: "G-LYK134PVPJ",
  databaseURL: "https://soporte-sat-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);