
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '@/lib/storage';
import { type Document } from '@/lib/types';
import { categorizeDocument } from '@/ai/flows/document-categorizer-flow';

const db = admin.firestore();

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
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // AI Categorization Step
    let textContent = '';
    let aiCategory = 'General Document'; // Default category

    try {
        if (file.type === 'application/pdf') {
            const pdf = (await import('pdf-parse')).default;
            const data = await pdf(fileBuffer);
            textContent = data.text;
        } else if (file.type?.startsWith('text/')) {
            textContent = fileBuffer.toString('utf-8');
        }

        if (textContent) {
            const result = await categorizeDocument({
                fileName: file.name || 'document',
                fileContent: textContent
            });
            aiCategory = result.category;
        }
    } catch (aiError) {
        console.warn('[AI_CATEGORIZATION_WARNING] Could not categorize document, falling back to default.', aiError);
        // We don't throw an error here, just fall back to the default category.
    }
    
    // Store file in Firebase Storage
    const filePath = `businesses/${businessId}/documents/${uuidv4()}-${file.name}`;
    const downloadUrl = await uploadFile(fileBuffer, filePath, file.type || 'application/octet-stream');
    
    // Store metadata in Firestore
    const docId = uuidv4();
    const documentData: Document = {
      id: docId,
      businessId,
      userId: user.uid,
      fileName: file.name || 'Untitled',
      fileUrl: downloadUrl,
      contentType: file.type || 'application/octet-stream',
      category: aiCategory, // Use the AI-determined category
      createdAt: new Date().toISOString(),
      status: 'Categorized', // Status is now 'Categorized'
    };

    await db.collection('documents').doc(docId).set(documentData);

    return NextResponse.json({ message: 'Document uploaded successfully', document: documentData }, { status: 201 });

  } catch (error: any) {
    console.error('[DOCUMENT_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during file upload.', details: error.message }, { status: 500 });
  }
}
