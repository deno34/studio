
'use server';

import admin from './firebaseAdmin';
import { type Business } from './types';

// Get a reference to the Realtime Database service
const db = admin.database();

/**
 * Saves business data to the Firebase Realtime Database.
 * @param businessData The business data to save.
 * @returns The ID of the saved business.
 */
export async function saveBusiness(businessData: Business): Promise<string> {
  console.log('[DatabaseService] Attempting to save business:', JSON.stringify(businessData, null, 2));
  const businessesRef = db.ref('businesses');
  const newBusinessRef = businessesRef.child(businessData.id);

  try {
    await newBusinessRef.set(businessData);
    console.log(`[DatabaseService] Successfully saved business with ID: ${businessData.id}`);
    return businessData.id;
  } catch (error) {
    console.error(`[DatabaseService] Error saving business with ID ${businessData.id}:`, error);
    throw new Error('Failed to save business data to Realtime Database.');
  }
}

/**
 * Fetches all businesses for a given user from the Realtime Database.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of Business objects.
 */
export async function getBusinessesForUser(userId: string): Promise<Business[]> {
  console.log(`[DatabaseService] Fetching businesses for user ID: ${userId}`);
  const businessesRef = db.ref('businesses');
  
  try {
    // This query is specific to Realtime Database syntax
    const snapshot = await businessesRef.orderByChild('userId').equalTo(userId).once('value');
    
    if (!snapshot.exists()) {
      console.log(`[DatabaseService] No businesses found for user ID: ${userId}`);
      return [];
    }

    const businessesData = snapshot.val();
    // Convert the object of businesses into an array
    const businesses = Object.values<Business>(businessesData);
    
    // Sort by createdAt descending
    businesses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[DatabaseService] Found ${businesses.length} businesses for user ID: ${userId}`);
    return businesses;
  } catch (error) {
    console.error(`[DatabaseService] Error fetching businesses for user ${userId}:`, error);
    return [];
  }
}
