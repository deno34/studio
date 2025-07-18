
import type { NextRequest } from 'next/server';
import admin from './firebaseAdmin';

export async function validateApiKey(req: NextRequest) {
  const key = req.headers.get('x-api-key');
  if (!key || typeof key !== 'string') {
    throw new Error('API key missing or invalid');
  }

  // NOTE: This assumes you have a 'users' collection where each document
  // has an 'apiKey' field. You will need a way to generate and assign these keys.
  const usersRef = admin.firestore().collection('users');
  const snapshot = await usersRef.where('apiKey', '==', key).limit(1).get();

  if (snapshot.empty) {
    throw new Error('Invalid API key');
  }

  const userDoc = snapshot.docs[0];
  return { uid: userDoc.id, ...userDoc.data() };
}
