
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { type Business, BusinessSchema } from '@/lib/types';
import * as z from 'zod';
import { saveBusiness } from '@/lib/firestoreService';
import { uploadFileToStorage } from '@/lib/storage';

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
    const logoFile = formData.get('logoFile') as File | null;

    console.log('[API /api/modules/business] Form data parsed:', { name, description, industry, logoFile: logoFile?.name });
    
    const validation = BusinessSchema.safeParse({ name, description, industry });

    if (!validation.success) {
      console.error('[API /api/modules/business] Validation failed:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    let logoUrl = 'https://placehold.co/100x100.png';
    if (logoFile) {
        console.log('[API /api/modules/business] Logo file found. Starting upload...');
        const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
        const filePath = `business-logos/${uuidv4()}-${logoFile.name}`;
        logoUrl = await uploadFileToStorage(fileBuffer, filePath, logoFile.type);
        console.log('[API /api/modules/business] Logo uploaded successfully:', logoUrl);
    } else {
        console.log('[API /api/modules/business] No logo file provided. Using default.');
    }

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

    console.log('[API /api/modules/business] Business data prepared. Calling saveBusiness...');
    await saveBusiness(businessData);
    console.log('[API /api/modules/business] saveBusiness completed successfully.');

    return NextResponse.json({ message: 'Business created successfully', id: businessId }, { status: 201 });

  } catch (error: any) {
    console.error('[API /api/modules/business] CRITICAL ERROR:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data provided.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred while creating the business profile.', details: error.message }, { status: 500 });
  }
}
