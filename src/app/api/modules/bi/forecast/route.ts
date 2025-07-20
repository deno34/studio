
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { validateApiKey } from '@/lib/auth';
import { generateForecast } from '@/ai/flows/forecasting-flow';
import * as z from 'zod';

const formSchema = z.object({
  metric: z.string().min(1, 'Metric is required'),
  period: z.coerce.number().int().min(1, 'Period must be at least 1').max(24, 'Period cannot exceed 24'),
});

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const metric = formData.get('metric') as string | null;
    const period = formData.get('period') as string | null;
    const file = formData.get('file') as File | null;
    
    const validation = formSchema.safeParse({ metric, period });

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
    
    const metricKey = validation.data.metric;
    const headers = Object.keys(parsedCsv[0] as object);
    const dateColumn = headers.find(h => h.toLowerCase().includes('date'));
    if (!headers.includes(metricKey) || !dateColumn) {
        return NextResponse.json({ error: `CSV must contain a '${metricKey}' column and a date column.` }, { status: 400 });
    }

    // Prepare data for the AI flow
    const jsonData = JSON.stringify(
      parsedCsv.map((row: any) => ({
        date: row[dateColumn],
        value: row[metricKey],
      }))
    );
    
    const result = await generateForecast({
      jsonData,
      metric: metricKey,
      period: validation.data.period,
    });
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[FORECASTING_ERROR]', error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid form data.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred during forecasting.', details: error.message }, { status: 500 });
  }
}
