// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB7nKMT5DaUdXWTjOCzcsjq0VsuDGlOjgc",
    authDomain: "fitrecdemo.firebaseapp.com",
    projectId: "fitrecdemo",
    storageBucket: "fitrecdemo.firebasestorage.app",
    messagingSenderId: "655268056102",
    appId: "1:655268056102:web:c51a5f6cf46b782ac06ae7",
    measurementId: "G-RMZQ6S6DNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
export default app;
