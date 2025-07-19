
import admin from './firebaseAdmin';

export async function uploadFile(fileBuffer: Buffer, path: string, contentType: string): Promise<string> {
  const bucket = admin.storage().bucket();
  const file = bucket.file(path);
  
  await file.save(fileBuffer, {
    metadata: { contentType },
    public: true, // Make the file publicly readable upon upload
  });

  // Return the public URL. 
  // The format is `https://storage.googleapis.com/<bucket-name>/<file-path>`
  return file.publicUrl();
}
