'use client';

import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { firebaseConfig } from './firebase';

// Initialize the Firebase app on the client-side only
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signOutUser = () => {
  return signOut(auth);
};

// Export onAuthStateChanged and User type for use in the AuthContext
export { onAuthStateChanged, type User };
