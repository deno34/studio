import admin from 'firebase-admin';

// This check prevents re-initializing the app in Next.js hot-reload environments
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
     console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    // A more detailed error log to help with debugging
    if (error.code === 'invalid-credential') {
      console.error('Firebase Admin SDK initialization failed: Invalid credentials. Make sure FIREBASE_SERVICE_ACCOUNT_KEY is set correctly.', error.message);
    } else {
      console.error('Firebase Admin SDK initialization error:', error.message);
    }
    // Don't rethrow, as it can crash the server during build
  }
}

export default admin;
