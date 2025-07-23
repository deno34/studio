
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { type Business, BusinessSchema } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { saveBusiness } from '@/lib/databaseService'; // SWITCHED TO databaseService

// This is a self-contained route for creating a business profile.
export async function POST(req: NextRequest) {
  console.log('[API /api/modules/business/create] Received POST request.');
  let user;
  try {
    user = await validateApiKey(req);
    console.log('[API /api/modules/business/create] API Key validated for user:', user.uid);
  } catch (error: any) {
    console.error('[API /api/modules/business/create] API Key validation failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const industry = formData.get('industry') as string;

    const validation = BusinessSchema.safeParse({ name, description, industry });

    if (!validation.success) {
      console.error('[API /api/modules/business/create] Validation failed:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    const businessId = uuidv4();
    const businessData: Business = {
        id: businessId,
        userId: user.uid,
        name: validation.data.name,
        description: validation.data.description,
        industry: validation.data.industry,
        logoUrl: 'https://placehold.co/100x100.png', // Using default logo for simplicity
        selectedAgents: [],
        createdAt: new Date().toISOString(),
    };

    console.log('[API /api/modules/business/create] Business data prepared. Attempting to save to Realtime Database...');
    
    await saveBusiness(businessData);
    
    console.log('[API /api/modules/business/create] Successfully saved to Realtime Database.');

    return NextResponse.json({ message: 'Business created successfully via new route', id: businessId }, { status: 201 });

  } catch (error: any) {
    console.error('[API /api/modules/business/create] CRITICAL ERROR:', error);
    return NextResponse.json({ error: 'An internal error occurred in the new business creation route.', details: error.message }, { status: 500 });
  }
}
