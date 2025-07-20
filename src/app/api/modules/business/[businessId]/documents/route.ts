
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { formidable, type File } from 'formidable';
import fs from 'fs/promises';
import { uploadFile } from '@/lib/storage';
import { type Document } from '@/lib/types';
import * as z from 'zod';

const db = admin.firestore();

// Formidable middleware to parse multipart/form-data
async function parseFormData(req: NextRequest): Promise<{ file: File }> {
  const form = formidable({});
  const [fields, files] = await form.parse(req as any);
  
  const file = files.file?.[0];
  if (!file) {
      throw new Error("No file uploaded.");
  }
  
  return { file };
}


// POST a new document for a business
export async function POST(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const { businessId } = params;
  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
  }

  try {
    const { file } = await parseFormData(req);
    const fileBuffer = await fs.readFile(file.filepath);

    // TODO: Add AI categorization step here in the future.
    // For now, we'll use a placeholder category.
    const aiCategory = 'Uncategorized';
    
    // Store file in Firebase Storage
    const filePath = `businesses/${businessId}/documents/${uuidv4()}-${file.originalFilename}`;
    const downloadUrl = await uploadFile(fileBuffer, filePath, file.mimetype || 'application/octet-stream');
    
    // Store metadata in Firestore
    const docId = uuidv4();
    const documentData: Document = {
      id: docId,
      businessId,
      userId: user.uid,
      fileName: file.originalFilename || 'Untitled',
      fileUrl: downloadUrl,
      contentType: file.mimetype || 'application/octet-stream',
      category: aiCategory,
      createdAt: new Date().toISOString(),
      status: 'Uploaded',
    };

    await db.collection('documents').doc(docId).set(documentData);

    return NextResponse.json({ message: 'Document uploaded successfully', document: documentData }, { status: 201 });

  } catch (error: any) {
    console.error('[DOCUMENT_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during file upload.', details: error.message }, { status: 500 });
  }
}
