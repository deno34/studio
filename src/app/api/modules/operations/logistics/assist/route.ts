
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { generateLogisticsPlan } from '@/ai/flows/logistics-flow';
import { LogisticsPlanInputSchema } from '@/lib/types';


export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = LogisticsPlanInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const planResult = await generateLogisticsPlan(validation.data);

    return NextResponse.json(planResult);

  } catch (error: any) {
    console.error('[LOGISTICS_ASSIST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during plan generation.', details: error.message }, { status: 500 });
  }
}
