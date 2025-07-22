
import admin from 'firebase-admin';

// This check prevents re-initializing the app in Next.js hot-reload environments
if (!admin.apps.length) {
  try {
    // We will not initialize here to prevent errors.
    // The functions that need it will be mocked.
    console.log('Firebase Admin SDK initialization skipped for debugging.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
  }
}

export default admin;
