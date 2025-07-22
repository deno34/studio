
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
const jobsCollection = getTypedCollection<JobPosting>('jobPostings');


// Business Functions
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
    return [];
  }
}


// Job Posting Functions
export async function saveJob(jobData: Omit<JobPosting, 'createdAt'>): Promise<string> {
    const jobRef = jobsCollection.doc(jobData.id);
    await jobRef.set({
        ...jobData,
        createdAt: new Date().toISOString(),
    });
    return jobData.id;
}

export async function getJobs(userId: string): Promise<JobPosting[]> {
    try {
        const snapshot = await jobsCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
}
