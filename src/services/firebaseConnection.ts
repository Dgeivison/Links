
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGL8fZ0qX9JcODXFt5goe3F8s5IYfIYY8",
  authDomain: "links-c4af0.firebaseapp.com",
  projectId: "links-c4af0",
  storageBucket: "links-c4af0.appspot.com",
  messagingSenderId: "332665558256",
  appId: "1:332665558256:web:1737611c43b1c7892e9e35"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };