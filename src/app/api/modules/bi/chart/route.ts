
import { NextRequest, NextResponse } from 'next/server';
import { formidable } from 'formidable';
import fs from 'fs/promises';
import Papa from 'papaparse';
import { validateApiKey } from '@/lib/auth';
import { generateChartData } from '@/ai/flows/chart-generator-flow';
import * as z from 'zod';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  chartType: z.enum(['bar', 'line', 'pie']),
});

// Helper to parse multipart form data
async function parseFormData(req: NextRequest) {
  const form = formidable({});
  const [fields, files] = await form.parse(req as any);

  const { prompt, chartType } = formSchema.parse({
    prompt: fields.prompt?.[0],
    chartType: fields.chartType?.[0],
  });
  
  const file = files.file?.[0];

  if (!file) {
    throw new Error('No file uploaded.');
  }

  if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/json') {
    throw new Error('Unsupported file type. Please upload a CSV or JSON file.');
  }
  
  return { file, prompt, chartType };
}

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { file, prompt, chartType } = await parseFormData(req);
    const fileContent = await fs.readFile(file.filepath, 'utf-8');

    let data: object[];
    if (file.mimetype === 'text/csv') {
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
      prompt,
      chartType,
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
