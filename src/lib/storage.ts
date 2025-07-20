
import admin from './firebaseAdmin';

export async function uploadFile(fileBuffer: Buffer, path: string, contentType: string): Promise<string> {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    throw new Error("Firebase Storage bucket name is not configured. Please check NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable.");
  }
  
  const bucket = admin.storage().bucket(bucketName);
  const file = bucket.file(path);
  
  await file.save(fileBuffer, {
    metadata: { contentType },
    public: true, // Make the file publicly readable upon upload
  });

  // Return the public URL. 
  // The format is `https://storage.googleapis.com/<bucket-name>/<file-path>`
  return file.publicUrl();
}
