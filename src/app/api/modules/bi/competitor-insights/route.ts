
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { analyzeCompetitor } from '@/ai/flows/competitor-analysis-flow';
import { CompetitorAnalysisInputSchema, CompetitorAnalysisInput } from '@/lib/types';
import * as z from 'zod';

const formSchema = z.object({
  url: z.string().url(),
  categories: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = formSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const { url, categories } = validation.data;

    // Fetch the HTML content of the URL
    // NOTE: This is a basic fetch. It won't work for sites that heavily rely on client-side JavaScript to render.
    // A more robust solution would use a service like Puppeteer, but that's a much heavier setup.
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch the URL. Status: ${response.status}` }, { status: 500 });
    }
    const htmlContent = await response.text();

    const input: CompetitorAnalysisInput = {
      htmlContent,
      categories: categories as any, // Cast because zod enum is already validated
    };
    
    const result = await analyzeCompetitor(input);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[COMPETITOR_ANALYSIS_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during analysis.', details: error.message }, { status: 500 });
  }
}
