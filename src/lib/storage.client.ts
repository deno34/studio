'use client';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseClient } from '@/lib/firebase/client';

/**
 * Uploads a file to Firebase Storage from the client-side.
 * @param file The file object to upload.
 * @param path The path where the file will be stored in the bucket.
 * @returns A promise that resolves with the public download URL of the file.
 */
export async function uploadFileToStorage(file: File, path: string): Promise<string> {
    const { storage } = getFirebaseClient();
    const storageRef = ref(storage, path);
    
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    
    return downloadUrl;
}
