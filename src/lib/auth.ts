
import type { NextRequest } from 'next/server';
import admin from './firebaseAdmin';

export async function validateApiKey(req: NextRequest) {
  const key = req.headers.get('x-api-key');
  if (!key || typeof key !== 'string') {
    throw new Error('API key missing or invalid');
  }

  // NOTE: This is a placeholder. In a real app, you would look up
  // the API key in a secure database table (e.g., a `users` or `api_keys` collection)
  // that maps keys to user IDs. For this demo, we'll assume a valid key
  // belongs to a test user if it matches a master key.

  const MASTER_API_KEY = process.env.MASTER_API_KEY;

  if (MASTER_API_KEY && key === MASTER_API_KEY) {
    // For demo purposes, returning a mock user object.
    // In a real implementation, you'd fetch the user data from Firestore.
    return { uid: 'test-user-id', email: 'test@example.com' };
  }


  // The code below is for a real implementation where keys are stored in Firestore.
  // It is commented out to allow for the simpler MASTER_API_KEY logic for now.
  /*
  const usersRef = admin.firestore().collection('users');
  const snapshot = await usersRef.where('apiKey', '==', key).limit(1).get();

  if (snapshot.empty) {
    throw new Error('Invalid API key');
  }

  const userDoc = snapshot.docs[0];
  return { uid: userDoc.id, ...userDoc.data() };
  */
  
  // If not using a master key, uncomment the logic above and remove this line.
   throw new Error('Invalid API key');
}
