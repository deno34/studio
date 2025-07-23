
'use server';

import admin from './firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload a file to Firebase Storage and get a secure download URL.
 * @param buffer - File buffer to upload.
 * @param path - The desired path and filename in the bucket (e.g., 'profile-pictures/user123.jpg').
 * @param contentType - The MIME type of the file (e.g., 'image/jpeg').
 * @returns A promise that resolves to the public URL of the uploaded file.
 */
export async function uploadFileToStorage(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const bucket = admin.storage().bucket();
  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: {
      contentType: contentType,
      // Add a unique token to prevent caching issues and allow public access
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    },
  });

  // Construct the public URL manually.
  // This format is faster and more reliable than getSignedUrl for public files.
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(path)}`;
  
  console.log(`[StorageService] File uploaded successfully to: ${publicUrl}`);
  return publicUrl;
}

/**
 * Deletes a file from Firebase Storage.
 * @param path - The full path to the file in the bucket.
 */
export async function deleteFileFromStorage(path: string): Promise<void> {
    const bucket = admin.storage().bucket();
    const file = bucket.file(path);
    try {
        await file.delete();
        console.log(`[StorageService] Successfully deleted file: ${path}`);
    } catch (error: any) {
        if (error.code === 404) {
            console.warn(`[StorageService] Warning: File not found for deletion, skipping: ${path}`);
        } else {
            console.error(`[StorageService] Error deleting file ${path}:`, error);
            throw new Error(`Failed to delete file from storage.`);
        }
    }
}
