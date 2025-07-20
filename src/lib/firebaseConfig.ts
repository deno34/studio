
export function getFirebaseConfig() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Basic validation to ensure all keys are present
  for (const [key, value] of Object.entries(firebaseConfig)) {
    if (!value) {
      // This check is important for client-side execution
      if (typeof window !== 'undefined') {
        console.error(`Firebase config error: Missing value for NEXT_PUBLIC_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
      }
    }
  }
  
  return firebaseConfig;
}
