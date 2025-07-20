
import type { NextRequest } from 'next/server';
import admin from './firebaseAdmin';

export async function validateApiKey(req: NextRequest) {
  const key = req.headers.get('x-api-key');
  if (!key || typeof key !== 'string') {
    throw new Error('API key missing or invalid');
  }

  // NOTE: This is a placeholder for the demo. In a real app, you would look up
  // the API key in a secure database table that maps keys to user IDs.
  // We'll use a single master API key stored in environment variables.
  // This allows the frontend to securely talk to the backend.

  const MASTER_API_KEY = process.env.MASTER_API_KEY;

  if (MASTER_API_KEY && key === MASTER_API_KEY) {
    // For demo purposes, returning a mock user object.
    // In a real implementation, you'd fetch the user data from Firestore.
    // A better approach would be to validate a user's session token here.
    return { uid: 'test-user-id', email: 'test@example.com' };
  }

  // If not using a master key or the key is invalid, throw an error.
   throw new Error('Invalid API key');
}
