import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { generateFollowUpEmail, FollowUpEmailInputSchema } from '@/ai/flows/follow-up-email-flow';

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = FollowUpEmailInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const emailResult = await generateFollowUpEmail(validation.data);

    return NextResponse.json(emailResult);

  } catch (error: any) {
    console.error('[EMAIL_GENERATION_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during email generation.', details: error.message }, { status: 500 });
  }
}
