// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwkRoz0BK6-BJviKtmyPumfu6VRSUNtJk",
  authDomain: "login-with-54f76.firebaseapp.com",
  projectId: "login-with-54f76",
  storageBucket: "login-with-54f76.firebasestorage.app",
  messagingSenderId: "20276017264",
  appId: "1:20276017264:web:b3a7a3ffe0d5678baa1cb5",
  measurementId: "G-6LRGEJZV5G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

