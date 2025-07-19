
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseConfig } from '@/lib/firebaseConfig';

// This function ensures that we initialize Firebase only once on the client.
function initializeClientApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  const firebaseConfig = getFirebaseConfig();
  return initializeApp(firebaseConfig);
}

const app: FirebaseApp = initializeClientApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
