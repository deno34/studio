
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { formidable, type File } from 'formidable';
import fs from 'fs/promises';
import { uploadFile } from '@/lib/storage';
import { BusinessSchema, type Business } from '@/lib/types';
import * as z from 'zod';

const db = admin.firestore();

// Formidable middleware to parse multipart/form-data
async function parseFormData(req: NextRequest): Promise<{ fields: z.infer<typeof BusinessSchema>, file?: File }> {
  const form = formidable({});
  const [fields, files] = await form.parse(req as any);
  
  const validation = BusinessSchema.safeParse({
    name: fields.name?.[0],
    description: fields.description?.[0],
    industry: fields.industry?.[0],
  });

  if (!validation.success) {
    throw new z.ZodError(validation.error.issues);
  }

  const file = files.logo?.[0];
  
  return { fields: validation.data, file };
}

// POST a new business profile
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { fields, file } = await parseFormData(req);

    const businessId = uuidv4();
    let logoUrl = '';

    if (file) {
      const fileBuffer = await fs.readFile(file.filepath);
      const fileName = `businesses/${businessId}/logo-${file.originalFilename}`;
      logoUrl = await uploadFile(fileBuffer, fileName, file.mimetype || 'application/octet-stream');
    }

    const businessData = {
      id: businessId,
      ...fields,
      logoUrl: logoUrl,
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
