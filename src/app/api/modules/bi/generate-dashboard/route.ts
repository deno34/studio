
import { NextRequest, NextResponse } from 'next/server';
import { formidable } from 'formidable';
import fs from 'fs/promises';
import Papa from 'papaparse';
import { validateApiKey } from '@/lib/auth';
import { generateDashboardData } from '@/ai/flows/dashboard-generator-flow';
import * as z from 'zod';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

// Helper to parse multipart form data
async function parseFormData(req: NextRequest) {
  const form = formidable({});
  const [fields, files] = await form.parse(req as any);

  const { prompt } = formSchema.parse({
    prompt: fields.prompt?.[0],
  });
  
  const file = files.file?.[0];

  if (!file) {
    throw new Error('No file uploaded.');
  }

  if (file.mimetype !== 'text/csv') {
    throw new Error('Unsupported file type. Please upload a CSV file.');
  }
  
  return { file, prompt };
}

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { file, prompt } = await parseFormData(req);
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

    const jsonData = JSON.stringify(parsedCsv);
    
    const result = await generateDashboardData({
      data: jsonData,
      prompt,
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
