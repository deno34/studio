
'use server';

import { EarlyAccessRequest, EarlyAccessRequestSchema } from '@/lib/types';
import { db } from '@/lib/firebase'; // Import the initialized db instance
import { addDoc, collection } from "firebase/firestore";

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
