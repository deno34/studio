
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { textToSpeech } from '@/ai/flows/tts-flow';
import * as z from 'zod';

const requestSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty.'),
});

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const result = await textToSpeech(validation.data);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[TTS_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during text-to-speech generation.', details: error.message }, { status: 500 });
  }
}
