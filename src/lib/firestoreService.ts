
'use server';

import admin from './firebaseAdmin';
import { type Business } from './types';
import { CollectionReference } from 'firebase-admin/firestore';

const db = admin.firestore();

// Type assertion for collection with converter
const getTypedCollection = <T>(collectionPath: string) => {
  return db.collection(collectionPath) as CollectionReference<T>;
};

const businessesCollection = getTypedCollection<Business>('businesses');

export async function saveBusiness(businessData: Omit<Business, 'createdAt'>): Promise<string> {
  const businessRef = businessesCollection.doc(businessData.id);
  await businessRef.set({
    ...businessData,
    createdAt: new Date().toISOString(),
  });
  return businessData.id;
}

export async function getBusinessesForUser(userId: string): Promise<Business[]> {
  try {
    const snapshot = await businessesCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching businesses for user:", error);
    // Depending on requirements, you might want to throw the error
    // or return an empty array.
    return [];
  }
}
