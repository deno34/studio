
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { VendorSchema, type Vendor } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const db = admin.firestore();

// POST a new vendor
export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = VendorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }

    const vendorId = uuidv4();
    const vendorData = {
      id: vendorId,
      ...validation.data,
      createdAt: new Date().toISOString(),
    };

    await db.collection('vendors').doc(vendorId).set(vendorData);

    return NextResponse.json({ message: 'Vendor created successfully', id: vendorId }, { status: 201 });

  } catch (error) {
    console.error('[OPERATIONS_VENDORS_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}

// GET all vendors
export async function GET(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const snapshot = await db.collection('vendors').orderBy('name', 'asc').get();
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }
    const data = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[OPERATIONS_VENDORS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
