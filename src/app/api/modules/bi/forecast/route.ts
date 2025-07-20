
import { NextRequest, NextResponse } from 'next/server';
import { formidable } from 'formidable';
import fs from 'fs/promises';
import Papa from 'papaparse';
import { validateApiKey } from '@/lib/auth';
import { generateForecast } from '@/ai/flows/forecasting-flow';
import * as z from 'zod';

const formSchema = z.object({
  metric: z.string().min(1, 'Metric is required'),
  period: z.coerce.number().int().min(1, 'Period must be at least 1').max(24, 'Period cannot exceed 24'),
});

// Helper to parse multipart form data
async function parseFormData(req: NextRequest) {
  const form = formidable({});
  const [fields, files] = await form.parse(req as any);

  const { metric, period } = formSchema.parse({
    metric: fields.metric?.[0],
    period: fields.period?.[0],
  });
  
  const file = files.file?.[0];

  if (!file) {
    throw new Error('No file uploaded.');
  }

  if (file.mimetype !== 'text/csv') {
    throw new Error('Unsupported file type. Please upload a CSV file.');
  }
  
  return { file, metric, period };
}

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { file, metric, period } = await parseFormData(req);
    const fileContent = await fs.readFile(file.filepath, 'utf-8');

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

    // Check if metric and a date column exist
    const headers = Object.keys(parsedCsv[0] as object);
    const dateColumn = headers.find(h => h.toLowerCase().includes('date'));
    if (!headers.includes(metric) || !dateColumn) {
        return NextResponse.json({ error: `CSV must contain a '${metric}' column and a date column.` }, { status: 400 });
    }

    // Prepare data for the AI flow
    const jsonData = JSON.stringify(
      parsedCsv.map((row: any) => ({
        date: row[dateColumn],
        value: row[metric],
      }))
    );
    
    const result = await generateForecast({
      jsonData,
      metric,
      period,
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
