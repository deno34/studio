
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { formidable } from 'formidable';
import fs from 'fs/promises';
import { parseContract } from '@/ai/flows/contract-parser-flow';
import { ContractParserInput } from '@/lib/types';

// Helper to parse multipart form data
async function parseFormData(req: NextRequest) {
  const form = formidable({});
  const [fields, files] = await form.parse(req as any);
  
  const file = files.file?.[0];

  if (!file) {
    throw new Error('No file uploaded.');
  }
  
  return { file };
}

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { file } = await parseFormData(req);
    const fileBuffer = await fs.readFile(file.filepath);
    let textContent = '';

    if (file.mimetype === 'application/pdf') {
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
