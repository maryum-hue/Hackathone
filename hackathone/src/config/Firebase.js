import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcaoVIzjoQIwAJ_9m_zxBcjPcWBjuSmBk",
  authDomain: "sign-up-login-page-af63e.firebaseapp.com",
  projectId: "sign-up-login-page-af63e",
  storageBucket: "sign-up-login-page-af63e.firebasestorage.app",
  messagingSenderId: "287209245759",
  appId: "1:287209245759:web:f70c09d0b6326e5d277c8a",
  measurementId: "G-HRDDHHJE3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export everything
export { 
  db, 
  auth,
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  getDoc 
};