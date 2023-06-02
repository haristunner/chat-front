// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0z9f_Gg772S3prrb-KYTPHdFz1Tn5uCk",
  authDomain: "chat-app-f520c.firebaseapp.com",
  projectId: "chat-app-f520c",
  storageBucket: "chat-app-f520c.appspot.com",
  messagingSenderId: "274724097072",
  appId: "1:274724097072:web:fad6ad70b8c873ddcef1f5",
  measurementId: "G-71T576E9BV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
