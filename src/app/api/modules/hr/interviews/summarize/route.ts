
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { summarizeInterview } from '@/ai/flows/interview-summary-flow';
import { InterviewSummaryInputSchema } from '@/lib/types';


export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = InterviewSummaryInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const summaryResult = await summarizeInterview(validation.data);

    return NextResponse.json(summaryResult);

  } catch (error: any) {
    console.error('[INTERVIEW_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during interview summarization.', details: error.message }, { status: 500 });
  }
}
