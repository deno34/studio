
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin'; // DB interaction removed
import { generateFinancialReport } from '@/ai/flows/financial-report-flow';
import { FinancialReportInput } from '@/lib/types';

// const db = admin.firestore();

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { reportType } = await req.json();
    if (!reportType || (reportType !== 'pnl' && reportType !== 'balance_sheet')) {
      return NextResponse.json({ error: 'Valid reportType (pnl or balance_sheet) is required' }, { status: 400 });
    }

    // MOCK DATA: Replace Firestore call
    const expenses: FinancialReportInput['expenses'] = [
        { id: '1', note: 'Marketing Campaign', category: 'Marketing', amount: 5000, date: '2023-10-15' },
        { id: '2', note: 'SaaS Subscriptions', category: 'Software', amount: 1200, date: '2023-10-01' },
        { id: '3', note: 'Team Lunch', category: 'Food & Entertainment', amount: 8000, date: '2023-10-20' },
    ];

    const input: FinancialReportInput = {
        reportType,
        expenses,
    };
    
    const result = await generateFinancialReport(input);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[REPORTS_GENERATION_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during report generation.', details: error.message }, { status: 500 });
  }
}
