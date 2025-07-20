
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { parseContract } from '@/ai/flows/contract-parser-flow';
import { ContractParserInput } from '@/lib/types';

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
    } else {
        return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF file.' }, { status: 400 });
    }

    if (!textContent) {
        return NextResponse.json({ error: 'Could not extract text from the document.' }, { status: 400 });
    }
    
    const input: ContractParserInput = { contractText: textContent };
    const result = await parseContract(input);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[CONTRACT_PARSE_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during contract parsing.', details: error.message }, { status: 500 });
  }
}
