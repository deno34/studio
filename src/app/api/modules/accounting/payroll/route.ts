
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { formidable } from 'formidable';
import { payrollSummaryFlow, PayrollSummaryInput, PayrollSummaryOutput } from '@/ai/flows/payroll-flow';
import fs from 'fs/promises';
import { z } from 'zod';
import pdf from 'pdf-parse';


// Helper to parse multipart form data
async function parseFormData(req: NextRequest) {
  const form = formidable({});
  const [fields, files] = await form.parse(req as any);
  
  const file = files.file?.[0];

  if (!file) {
    throw new Error('No file uploaded.');
  }
  
  return { file };
}

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { file } = await parseFormData(req);

    const fileBuffer = await fs.readFile(file.filepath);
    let documentContent: string;
    let mimeType = file.mimetype || 'application/octet-stream';

    if (mimeType === 'application/pdf') {
        const data = await pdf(fileBuffer);
        documentContent = data.text;
    } else if (mimeType.startsWith('image/')) {
        // For images, we will send the raw data URI to the multimodal model
        documentContent = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    }
     else {
        // Fallback for plain text if needed
        documentContent = fileBuffer.toString('utf-8');
    }

    const input: PayrollSummaryInput = {
        payslipDataUri: documentContent,
        mimeType: mimeType
    }

    const result: PayrollSummaryOutput = await payrollSummaryFlow(input);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[PAYROLL_ANALYSIS_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during payroll analysis.', details: error.message }, { status: 500 });
  }
}
