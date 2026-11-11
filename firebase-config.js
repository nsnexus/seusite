// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACrA-Nhn8EcywufaESE-Fvwr2WZkkIfRs",
  authDomain: "link-cd398.firebaseapp.com",
  projectId: "link-cd398",
  storageBucket: "link-cd398.firebasestorage.app",
  messagingSenderId: "316777181691",
  appId: "1:316777181691:web:7014a489da396209035b5e",
  measurementId: "G-RS6G7Q6R8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
