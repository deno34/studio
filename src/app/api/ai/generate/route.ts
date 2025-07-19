
import { NextResponse, type NextRequest } from 'next/server';
import { callMistral } from '@/lib/mistral';
import { validateApiKey } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const output = await callMistral(prompt);

    return NextResponse.json({ result: output });

  } catch (error: any) {
    console.error('[AI_GENERATE_ERROR]', error);
    if (error.message.includes('API key') || error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
