
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '@/lib/storage';
import { BusinessSchema, type Business } from '@/lib/types';
import * as z from 'zod';

const db = admin.firestore();

// POST a new business profile
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const industry = formData.get('industry') as string;
    const logoFile = formData.get('logo') as File | null;

    const validation = BusinessSchema.safeParse({ name, description, industry });
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    const businessId = uuidv4();
    let logoUrl = '';

    if (logoFile) {
      const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
      const fileName = `businesses/${businessId}/logo-${logoFile.name}`;
      logoUrl = await uploadFile(fileBuffer, fileName, logoFile.type || 'application/octet-stream');
    }

    const businessData: Business = {
      id: businessId,
      ...validation.data,
      logoUrl,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      selectedAgents: [], // Initially no agents are selected
    };

    await db.collection('businesses').doc(businessId).set(businessData);

    return NextResponse.json({ message: 'Business created successfully', id: businessId }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data provided.', details: error.flatten() }, { status: 400 });
    }
    console.error('[BUSINESS_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
