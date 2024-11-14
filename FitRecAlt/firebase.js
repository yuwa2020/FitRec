// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Firebase app (only if not already initialized)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Firebase Auth with persistence using AsyncStorage (only if not already initialized)
const auth = getAuth(app) || initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, firestore };
export default app;
