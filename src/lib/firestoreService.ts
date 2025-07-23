
'use server';

import admin from './firebaseAdmin';
import { type Business, type JobPosting } from './types';
import { CollectionReference } from 'firebase-admin/firestore';

// DO NOT initialize db here. It can cause a race condition on server start.
// Instead, get the db instance inside each function.

// Type assertion for collection with converter
const getTypedCollection = <T>(collectionPath: string): CollectionReference<T> => {
  const db = admin.firestore();
  return db.collection(collectionPath) as CollectionReference<T>;
};

// Business Functions
export async function saveBusiness(businessData: Business): Promise<string> {
  const businessesCollection = getTypedCollection<Business>('businesses');
  console.log('[FirestoreService] Attempting to save business:', JSON.stringify(businessData, null, 2));
  const businessRef = businessesCollection.doc(businessData.id);
  
  // The createdAt is already part of the businessData object from the API route
  const dataToSave = businessData;

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
  const businessesCollection = getTypedCollection<Business>('businesses');
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

// Job Posting Functions
export async function saveJob(jobData: JobPosting): Promise<string> {
    const jobsCollection = getTypedCollection<JobPosting>('jobPostings');
    console.log(`[FirestoreService] Attempting to save job: ${jobData.title}`);
    const jobRef = jobsCollection.doc(jobData.id);
    await jobRef.set(jobData); // Assumes createdAt is already set
    console.log(`[FirestoreService] Successfully saved job with ID: ${jobData.id}`);
    return jobData.id;
}

export async function getJobs(userId: string): Promise<JobPosting[]> {
    const jobsCollection = getTypedCollection<JobPosting>('jobPostings');
    console.log(`[FirestoreService] Fetching jobs for user ID: ${userId}`);
    try {
        const snapshot = await jobsCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            console.log(`[FirestoreService] No jobs found for user ID: ${userId}`);
            return [];
        }
        const jobs = snapshot.docs.map(doc => doc.data());
        console.log(`[FirestoreService] Found ${jobs.length} jobs for user ID: ${userId}`);
        return jobs;
    } catch (error) {
        console.error(`[FirestoreService] Error fetching jobs for user ${userId}:`, error);
        return [];
    }
}

export async function getJobById(jobId: string): Promise<JobPosting | null> {
    const jobsCollection = getTypedCollection<JobPosting>('jobPostings');
    console.log(`[FirestoreService] Fetching job with ID: ${jobId}`);
    try {
        const doc = await jobsCollection.doc(jobId).get();
        if (!doc.exists) {
            console.log(`[FirestoreService] No job found with ID: ${jobId}`);
            return null;
        }
        return doc.data() as JobPosting;
    } catch (error) {
        console.error(`[FirestoreService] Error fetching job with ID ${jobId}:`, error);
        return null;
    }
}
