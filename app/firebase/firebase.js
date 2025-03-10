// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIf-c6lDb-BxH0eWj_Hn0OhZy0u9aTADc",
  authDomain: "pawfecthome-a7b3d.firebaseapp.com",
  projectId: "pawfecthome-a7b3d",
  storageBucket: "pawfecthome-a7b3d.firebasestorage.app",
  messagingSenderId: "511093891781",
  appId: "1:511093891781:web:04a1ace065f05d7840c6ac",
  measurementId: "G-SJ9ML0MZZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };