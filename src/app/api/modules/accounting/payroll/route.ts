
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { summarizePayroll } from '@/ai/flows/payroll-flow';
import { PayrollSummaryInput, PayrollSummaryOutput } from '@/lib/types';

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
    let documentContent: string;
    let mimeType = file.type || 'application/octet-stream';

    if (mimeType === 'application/pdf') {
        const pdf = (await import('pdf-parse')).default;
        const data = await pdf(fileBuffer);
        documentContent = data.text;
    } else if (mimeType.startsWith('image/')) {
        documentContent = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    }
     else {
        documentContent = fileBuffer.toString('utf-8');
    }

    const input: PayrollSummaryInput = {
        payslipDataUri: documentContent,
        mimeType: mimeType
    }

    const result: PayrollSummaryOutput = await summarizePayroll(input);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[PAYROLL_ANALYSIS_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during payroll analysis.', details: error.message }, { status: 500 });
  }
}
