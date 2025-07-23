
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseConfig } from '@/lib/firebaseConfig';

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
