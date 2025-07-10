
'use server';

import { EarlyAccessRequest, EarlyAccessRequestSchema } from '@/lib/types';
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { firebaseConfig } from '@/lib/firebaseConfig';

// This is a server-only file, so we can initialize a separate Firebase app instance here.
// This prevents conflicts with the client-side Firebase app.
let app: FirebaseApp;
const appName = 'server-actions-app'; // Unique name for the server-side app
if (!getApps().some(app => app.name === appName)) {
  app = initializeApp(firebaseConfig, appName);
} else {
  app = getApp(appName);
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
