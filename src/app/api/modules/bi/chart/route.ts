
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { validateApiKey } from '@/lib/auth';
import { generateChartData } from '@/ai/flows/chart-generator-flow';
import * as z from 'zod';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  chartType: z.enum(['bar', 'line', 'pie']),
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
    const chartType = formData.get('chartType') as 'bar' | 'line' | 'pie' | null;
    const file = formData.get('file') as File | null;
    
    const validation = formSchema.safeParse({ prompt, chartType });

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid form data.', details: validation.error.flatten() }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'text/csv' && file.type !== 'application/json') {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a CSV or JSON file.' }, { status: 400 });
    }

    const fileContent = await file.text();

    let data: object[];
    if (file.type === 'text/csv') {
        const parsedCsv = await new Promise<object[]>((resolve, reject) => {
            Papa.parse(fileContent, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: (results) => resolve(results.data as object[]),
                error: (error) => reject(error),
            });
        });
        data = parsedCsv;
    } else { // application/json
        data = JSON.parse(fileContent);
    }
    

    if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json({ error: 'Could not parse data or file is empty.' }, { status: 400 });
    }

    const jsonData = JSON.stringify(data);
    
    const result = await generateChartData({
      data: jsonData,
      prompt: validation.data.prompt,
      chartType: validation.data.chartType,
    });
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[CHART_GENERATION_ERROR]', error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid form data.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred during chart generation.', details: error.message }, { status: 500 });
  }
}
