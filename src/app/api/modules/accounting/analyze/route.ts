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
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Text for analysis is required' }, { status: 400 });
    }

    const result = await callMistral(`Analyze this receipt or financial document and extract key information like vendor, date, total amount, and items in a structured JSON format: \n\n${text}`);

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
