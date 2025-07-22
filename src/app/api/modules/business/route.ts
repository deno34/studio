
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
    const body = await req.json();
    console.log('[API /api/modules/business] Request body parsed:', body);
    
    const validation = BusinessSchema.safeParse(body);

    if (!validation.success) {
      console.error('[API /api/modules/business] Validation failed:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    const businessId = uuidv4();
    const businessData: Omit<Business, 'createdAt' | 'logoUrl'> & { logoUrl?: string } = {
        id: businessId,
        userId: user.uid,
        name: validation.data.name,
        description: validation.data.description,
        industry: validation.data.industry,
        selectedAgents: [], // Start with no agents selected
    };

    console.log('[API /api/modules/business] Business data prepared. Calling saveBusiness...');
    await saveBusiness(businessData);
    console.log('[API /api/modules/business] saveBusiness completed successfully.');

    return NextResponse.json({ message: 'Business created successfully (without logo)', id: businessId }, { status: 201 });

  } catch (error: any) {
    console.error('[API /api/modules/business] CRITICAL ERROR:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data provided.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred while creating the business profile.', details: error.message }, { status: 500 });
  }
}
