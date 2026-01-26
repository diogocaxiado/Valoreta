// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMa6h39G8L7KKU5v1lfxxKFS0legaGo4w",
  authDomain: "valoreta-b52ed.firebaseapp.com",
  databaseURL: "https://valoreta-b52ed-default-rtdb.firebaseio.com",
  projectId: "valoreta-b52ed",
  storageBucket: "valoreta-b52ed.firebasestorage.app",
  messagingSenderId: "312127708790",
  appId: "1:312127708790:web:a861750df005c1af37c957",
  measurementId: "G-ZBJFSK4CB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize the Realtime Database and EXPORT
export const db = getDatabase(app); 
export { app };