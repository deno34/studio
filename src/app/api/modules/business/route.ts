
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { type Business, BusinessSchema } from '@/lib/types';
import * as z from 'zod';
import { saveBusiness } from '@/lib/firestoreService';

export async function POST(req: NextRequest) {
  console.log('[API /api/modules/business] Received POST request.');
  let user;
  try {
    user = await validateApiKey(req);
    console.log('[API /api/modules/business] API Key validated for user:', user.uid);
  } catch (error: any) {
    console.error('[API /api/modules/business] API Key validation failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const industry = formData.get('industry') as string;
    
    // Temporarily disable file upload logic
    const logoFile = null; 

    console.log('[API /api/modules/business] Form data parsed:', { name, description, industry });
    
    const validation = BusinessSchema.safeParse({ name, description, industry });

    if (!validation.success) {
      console.error('[API /api/modules/business] Validation failed:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    const logoUrl = 'https://placehold.co/100x100.png'; // Default logo
    console.log('[API /api/modules/business] Using default logo.');

    const businessId = uuidv4();
    const businessData: Omit<Business, 'createdAt'> = {
        id: businessId,
        userId: user.uid,
        name: validation.data.name,
        description: validation.data.description,
        industry: validation.data.industry,
        selectedAgents: [], // Start with no agents selected
        logoUrl: logoUrl,
    };

    // MOCK: Temporarily skip saving to Firestore to isolate the error
    // console.log('[API /api/modules/business] Business data prepared. SKIPPING saveBusiness...');
    // await saveBusiness(businessData);
    // console.log('[API /api/modules/business] saveBusiness SKIPPED.');

    return NextResponse.json({ message: 'Business created successfully (mocked)', id: businessId }, { status: 201 });

  } catch (error: any) {
    console.error('[API /api/modules/business] CRITICAL ERROR:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data provided.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred while creating the business profile.', details: error.message }, { status: 500 });
  }
}
