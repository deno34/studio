
export function getFirebaseConfig() {
  const firebaseConfig = {
    apiKey: "AIzaSyAVMkl7ZKj1QyU2tRKlLRrSkHI8aBNT0Ug",
  authDomain: "find-me-d9858.firebaseapp.com",
  databaseURL: "https://find-me-d9858-default-rtdb.firebaseio.com",
  projectId: "find-me-d9858",
  storageBucket: "find-me-d9858.appspot.com",
  messagingSenderId: "988807644256",
  appId: "1:988807644256:web:02629da7d353afbf822f05",
  measurementId: "G-38C4M26XC3"
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
