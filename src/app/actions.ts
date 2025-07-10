'use server';

import {db} from '@/lib/firebase';
import {EarlyAccessRequest, EarlyAccessRequestSchema} from '@/lib/types';
import {addDoc, collection} from 'firebase/firestore';

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
    return {
      success: false,
      message: 'An unexpected error occurred.',
    };
  }
}
