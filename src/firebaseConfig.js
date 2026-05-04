import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB50ibccJsOeZSw86zaE73BSpd7j11Xcww",
  authDomain: "guide---101.firebaseapp.com",
  projectId: "guide---101",
  storageBucket: "guide---101.firebasestorage.app",
  messagingSenderId: "873610222403",
  appId: "1:873610222403:web:fdbec1d0471c7964a0edf6",
  measurementId: "G-41H8H37M2T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);