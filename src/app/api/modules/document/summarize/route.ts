
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { summarizeDocument } from '@/ai/flows/document-summary-flow';
import { DocumentSummaryInput } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let textContent = '';

    if (file.type === 'application/pdf') {
        const pdf = (await import('pdf-parse')).default;
        const data = await pdf(fileBuffer);
        textContent = data.text;
    } else if (file.type?.startsWith('text/')) {
        textContent = fileBuffer.toString('utf-8');
    } else {
        return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or text file.' }, { status: 400 });
    }

    if (!textContent) {
        return NextResponse.json({ error: 'Could not extract text from the document.' }, { status: 400 });
    }
    
    const input: DocumentSummaryInput = { documentText: textContent };
    const result = await summarizeDocument(input);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[DOCUMENT_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during document summarization.', details: error.message }, { status: 500 });
  }
}
