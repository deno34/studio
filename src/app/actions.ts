
'use server';

import { EarlyAccessRequest, EarlyAccessRequestSchema } from '@/lib/types';
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase for server-side actions
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig, "server");
} else {
  app = getApp("server");
}

const db = getFirestore(app);


export async function saveEarlyAccessRequest(values: EarlyAccessRequest) {
  const parsed = EarlyAccessRequestSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Invalid data provided.',
    };
  }

  try {
    await addDoc(collection(db, 'earlyAccessRequests'), parsed.data);
    return {
      success: true,
      message: 'Registration successful!',
    };
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    // Provide a more generic error message to the user
    return {
      success: false,
      message: 'An unexpected error occurred while saving your request.',
    };
  }
}
