
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
// import { uploadFile } from '@/lib/storage';
import { type Document } from '@/lib/types';
import { categorizeDocument } from '@/ai/flows/document-categorizer-flow';

// const db = admin.firestore();

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
    
    // MOCK SUCCESS: Skip upload and DB write
    const docId = uuidv4();
    const documentData: Document = {
      id: docId,
      businessId,
      userId: user.uid,
      fileName: file.name || 'Untitled',
      fileUrl: `https://example.com/mock-doc/${docId}`,
      contentType: file.type || 'application/octet-stream',
      category: 'General Document', // Mock category
      createdAt: new Date().toISOString(),
      status: 'Categorized',
    };

    return NextResponse.json({ message: 'Document uploaded successfully (mocked)', document: documentData }, { status: 201 });

  } catch (error: any) {
    console.error('[DOCUMENT_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during file upload.', details: error.message }, { status: 500 });
  }
}
