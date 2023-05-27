// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZsWJ6ogF458uSuQosB6qlLridT8sZBmw",
  authDomain: "bytecare-21b4f.firebaseapp.com",
  projectId: "bytecare-21b4f",
  storageBucket: "bytecare-21b4f.appspot.com",
  messagingSenderId: "142222123913",
  appId: "1:142222123913:web:a0fadc325458e0907b3758"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);

export default db

export {
    auth,
    storage
}