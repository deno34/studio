
import admin from 'firebase-admin';
import { getFirebaseConfig } from './firebaseConfig';

// This check prevents re-initializing the app in Next.js hot-reload environments
if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin SDK...');
    const firebaseConfig = getFirebaseConfig();

    // When using separate env variables, you need to format the private key
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
        throw new Error('Firebase server credentials are not set in .env. Please check FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      storageBucket: firebaseConfig.storageBucket,
      databaseURL: firebaseConfig.databaseURL, // Added for Realtime Database
    });
     console.log('Firebase Admin SDK initialized successfully for Realtime Database.');
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization error:', error.message);
    // Propagate the error to make it clear that the server may not function correctly.
    throw error;
  }
}

export default admin;
