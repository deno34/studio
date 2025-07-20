
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { generateKpiSummary } from '@/ai/flows/kpi-summary-flow';
import { KpiSummaryInputSchema } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = KpiSummaryInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const result = await generateKpiSummary(validation.data);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[KPI_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during KPI summary generation.', details: error.message }, { status: 500 });
  }
}
