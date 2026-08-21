import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUCpfrYXuSeGFqKeMupbTvaDdo70jJKGk",
    authDomain: "my-portfolio-8ca8b.firebaseapp.com",
    projectId: "my-portfolio-8ca8b",
    storageBucket: "my-portfolio-8ca8b.firebasestorage.app",
    messagingSenderId: "584601515105",
    appId: "1:584601515105:web:3ad4dad366a7d40a3d2620",
    measurementId: "G-4ENWHR5EQ3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.FB = {
    db,
    auth,
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
};

window.dispatchEvent(new Event('firebase-ready'));
