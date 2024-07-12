// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAIELMSkennH5KuRe_67h76eR52Q15L2w0",
  authDomain: "my-first-project-25b53.firebaseapp.com",
  projectId: "my-first-project-25b53",
  storageBucket: "my-first-project-25b53.appspot.com",
  messagingSenderId: "239094844578",
  appId: "1:239094844578:web:096674f5e39d65b2c19bfb",
  measurementId: "G-7QXFHY5GLL"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE = getFirestore(FIREBASE_APP);
export const DATABASE = getDatabase(FIREBASE_APP);
const analytics = getAnalytics(FIREBASE_APP);
