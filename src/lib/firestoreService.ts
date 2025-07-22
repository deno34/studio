
'use server';

import admin from './firebaseAdmin';
import { type Business, type JobPosting } from './types';
import { CollectionReference } from 'firebase-admin/firestore';

const db = admin.firestore();

// Type assertion for collection with converter
const getTypedCollection = <T>(collectionPath: string) => {
  return db.collection(collectionPath) as CollectionReference<T>;
};

const businessesCollection = getTypedCollection<Business>('businesses');


// Business Functions
export async function saveBusiness(businessData: Omit<Business, 'createdAt'>): Promise<string> {
  console.log('[FirestoreService] Attempting to save business:', JSON.stringify(businessData, null, 2));
  const businessRef = businessesCollection.doc(businessData.id);
  const dataToSave = {
    ...businessData,
    createdAt: new Date().toISOString(),
  };

  try {
    await businessRef.set(dataToSave);
    console.log(`[FirestoreService] Successfully saved business with ID: ${businessData.id}`);
    return businessData.id;
  } catch (error) {
    console.error(`[FirestoreService] Error saving business with ID ${businessData.id}:`, error);
    throw new Error('Failed to save business data to Firestore.');
  }
}

export async function getBusinessesForUser(userId: string): Promise<Business[]> {
  console.log(`[FirestoreService] Fetching businesses for user ID: ${userId}`);
  try {
    const snapshot = await businessesCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      console.log(`[FirestoreService] No businesses found for user ID: ${userId}`);
      return [];
    }
    const businesses = snapshot.docs.map(doc => doc.data());
    console.log(`[FirestoreService] Found ${businesses.length} businesses for user ID: ${userId}`);
    return businesses;
  } catch (error) {
    console.error(`[FirestoreService] Error fetching businesses for user ${userId}:`, error);
    // Return empty array on failure to prevent breaking the frontend
    return [];
  }
}

export async function saveJob(jobData: Omit<JobPosting, 'createdAt'>): Promise<string> {
    console.log(`[FirestoreService Mock] Pretending to save job: ${jobData.title}`);
    return Promise.resolve(jobData.id);
}

export async function getJobs(userId: string): Promise<JobPosting[]> {
    console.log(`[FirestoreService Mock] Pretending to fetch jobs for user ${userId}`);
    const mockJobs: JobPosting[] = [
        {
            id: 'mock-job-1',
            userId: userId,
            title: 'Mock Senior AI Engineer',
            location: 'Remote',
            description: 'This is a mocked job description.',
            status: 'Open',
            createdAt: new Date().toISOString(),
        }
    ];
    return Promise.resolve(mockJobs);
}
