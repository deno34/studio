
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { validateApiKey } from '@/lib/auth';
import { generateDashboardData } from '@/ai/flows/dashboard-generator-flow';
import * as z from 'zod';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string | null;
    const file = formData.get('file') as File | null;
    
    const validation = formSchema.safeParse({ prompt });
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid form data.', details: validation.error.flatten() }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'text/csv') {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a CSV file.' }, { status: 400 });
    }
    
    const fileContent = await file.text();

    const parsedCsv = await new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error),
        });
    });

    if (!Array.isArray(parsedCsv) || parsedCsv.length === 0) {
        return NextResponse.json({ error: 'Could not parse CSV or file is empty.' }, { status: 400 });
    }

    const jsonData = JSON.stringify(parsedCsv);
    
    const result = await generateDashboardData({
      data: jsonData,
      prompt: validation.data.prompt,
    });
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[DASHBOARD_GENERATION_ERROR]', error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid form data.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred during dashboard generation.', details: error.message }, { status: 500 });
  }
}
