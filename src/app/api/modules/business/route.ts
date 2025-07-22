
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { type Business, BusinessSchema } from '@/lib/types';
import * as z from 'zod';

export async function POST(req: NextRequest) {
  console.log('[API /api/modules/business] Received POST request.');
  try {
    await validateApiKey(req);
    console.log('[API /api/modules/business] API Key validated.');
  } catch (error: any) {
    console.error('[API /api/modules/business] API Key validation failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const industry = formData.get('industry') as string;

    console.log('[API /api/modules/business] Form data parsed:', { name, description, industry });
    
    const validation = BusinessSchema.safeParse({ name, description, industry });

    if (!validation.success) {
      console.error('[API /api/modules/business] Validation failed:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    const businessId = uuidv4();
    console.log(`[API /api/modules/business] Mock success for businessId: ${businessId}`);
    
    return NextResponse.json({ message: 'Business created successfully (mocked)', id: businessId }, { status: 201 });

  } catch (error: any) {
    console.error('[API /api/modules/business] CRITICAL ERROR:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data provided.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred while creating the business profile.', details: error.message }, { status: 500 });
  }
}
