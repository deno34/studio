
'use server';

import admin from './firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

const storage = admin.storage().bucket();

/**
 * Upload a file to Firebase Storage and get a secure download URL.
 * @param buffer - File buffer to upload.
 * @param path - The desired path and filename in the bucket (e.g., 'profile-pictures/user123.jpg').
 * @param contentType - The MIME type of the file (e.g., 'image/jpeg').
 * @returns A promise that resolves to the secure, tokenized download URL of the file.
 */
export async function uploadFileToStorage(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const file = storage.file(path);
  const token = uuidv4();

  await file.save(buffer, {
    metadata: {
      contentType,
      // Add a custom metadata token for secure access
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  // Construct the public URL with the token
  return `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

/**
 * Deletes a file from Firebase Storage.
 * @param path - The full path to the file in the bucket.
 * @returns A promise that resolves when the file is deleted.
 */
export async function deleteFileFromStorage(path: string): Promise<void> {
  await storage.file(path).delete({ ignoreNotFound: true });
}

/**
 * Checks if a file exists in Firebase Storage.
 * @param path - The full path to the file in the bucket.
 * @returns A promise that resolves to true if the file exists, false otherwise.
 */
export async function fileExistsInStorage(path: string): Promise<boolean> {
  const [exists] = await storage.file(path).exists();
  return exists;
}

/**
 * Generates a signed URL for a private file, valid for a limited time.
 * @param path - The full path to the file in the bucket.
 * @param durationMinutes - The number of minutes the URL should be valid for. Defaults to 60.
 * @returns A promise that resolves to the signed URL.
 */
export async function getSignedUrl(path: string, durationMinutes: number = 60): Promise<string> {
    const options = {
        version: 'v4' as const,
        action: 'read' as const,
        expires: Date.now() + durationMinutes * 60 * 1000,
    };

    const [url] = await storage.file(path).getSignedUrl(options);
    return url;
}
