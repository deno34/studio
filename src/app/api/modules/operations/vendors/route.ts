
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin';
import { VendorSchema, type Vendor } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// const db = admin.firestore();

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
    // Mock success
    return NextResponse.json({ message: 'Vendor created successfully (mocked)', id: vendorId }, { status: 201 });

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
    // MOCK DATA
    const mockVendors = [
        { id: 'v1', name: 'Apple Inc.', contactPerson: 'Tim Cook' },
        { id: 'v2', name: 'Logitech', contactPerson: 'Jane Doe' },
        { id: 'v3', name: 'Anker', contactPerson: 'John Smith' },
    ];
    return NextResponse.json(mockVendors, { status: 200 });
  } catch (error) {
    console.error('[OPERATIONS_VENDORS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
