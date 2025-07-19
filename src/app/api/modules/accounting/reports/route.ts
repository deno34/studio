
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { generateFinancialReport } from '@/ai/flows/financial-report-flow';
import { FinancialReportInput } from '@/lib/types';

const db = admin.firestore();

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

    const expensesSnapshot = await db.collection('expenses').get();
    const expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FinancialReportInput['expenses'];

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
