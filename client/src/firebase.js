// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "real-estate-6a0f1.firebaseapp.com",
  projectId: "real-estate-6a0f1",
  storageBucket: "real-estate-6a0f1.appspot.com",
  messagingSenderId: "777781979457",
  appId: "1:777781979457:web:411f852ceb8c8ef83619c0",
  measurementId: "G-0B8J481P66"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
