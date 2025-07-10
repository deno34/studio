
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getAuth,
} from "firebase/auth";
import { app } from './firebase'; // Import the initialized app

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const signOutUser = () => {
  return signOut(auth);
};
