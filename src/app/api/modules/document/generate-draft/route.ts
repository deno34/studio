
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { generateDocumentDraft } from '@/ai/flows/document-writer-flow';
import { DocumentWriterInputSchema } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = DocumentWriterInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const result = await generateDocumentDraft(validation.data);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[DOCUMENT_DRAFT_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during draft generation.', details: error.message }, { status: 500 });
  }
}
