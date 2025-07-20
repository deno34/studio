
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { callMistral } from '@/lib/mistral';

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

    const result = await callMistral(`Analyze this receipt or financial document and extract key information like vendor, date, total amount, and items in a structured JSON format: \n\n${textContent}`);

    // Attempt to parse the string response from Mistral into JSON
    try {
      const jsonResponse = JSON.parse(result);
      return NextResponse.json({ analysis: jsonResponse });
    } catch {
       // If Mistral doesn't return valid JSON, return the raw text
      return NextResponse.json({ analysis: { raw_text: result } });
    }

  } catch (error) {
    console.error('[ACCOUNTING_ANALYZE_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
