
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToStorage } from '@/lib/storage';
import { BusinessSchema, type Business } from '@/lib/types';
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
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const industry = formData.get('industry') as string | null;
    const logoFile = formData.get('logo') as File | null;

    const validation = BusinessSchema.safeParse({ 
      name: name || '', 
      description: description || '', 
      industry: industry || '' 
    });

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    let logoUrl = 'https://placehold.co/100x100.png'; // Default logo
    if (logoFile) {
        const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
        const path = `businesses/logos/${uuidv4()}-${logoFile.name}`;
        logoUrl = await uploadFileToStorage(fileBuffer, path, logoFile.type);
    }
    
    const businessId = uuidv4();
    const businessData: Omit<Business, 'createdAt'> = {
        id: businessId,
        userId: user.uid,
        name: validation.data.name,
        description: validation.data.description,
        industry: validation.data.industry,
        logoUrl,
        selectedAgents: [], // Start with no agents selected
    };

    await saveBusiness(businessData);

    return NextResponse.json({ message: 'Business created successfully', id: businessId }, { status: 201 });

  } catch (error: any) {
    console.error('[BUSINESS_POST_ERROR]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data provided.', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal error occurred while creating the business profile.', details: error.message }, { status: 500 });
  }
}
