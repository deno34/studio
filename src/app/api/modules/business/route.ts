
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { type Business, BusinessSchema } from '@/lib/types';
import * as z from 'zod';
import { saveBusiness } from '@/lib/firestoreService';

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // We are only validating text fields now
    const validation = BusinessSchema.safeParse(body);

    if (!validation.success) {
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

    // Since we are not handling file upload, we will save the data without the logoUrl for now
    await saveBusiness(businessData);

    return NextResponse.json({ message: 'Business created successfully (without logo)', id: businessId }, { status: 201 });

  } catch (error: any) {
    console.error('[BUSINESS_POST_ERROR]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data provided.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred while creating the business profile.', details: error.message }, { status: 500 });
  }
}
