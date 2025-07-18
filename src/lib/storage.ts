
import admin from './firebaseAdmin';

export async function uploadFile(fileBuffer: Buffer, path: string, contentType: string): Promise<string> {
  const bucket = admin.storage().bucket();
  const file = bucket.file(path);
  
  await file.save(fileBuffer, {
    metadata: { contentType },
  });

  // Make the file public and get its URL
  await file.makePublic();
  
  return file.publicUrl();
}
