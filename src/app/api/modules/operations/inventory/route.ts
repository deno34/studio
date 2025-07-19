
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { InventoryItemSchema, type InventoryItem } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const db = admin.firestore();

// POST a new inventory item
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = InventoryItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }

    const itemId = uuidv4();
    const itemData: Omit<InventoryItem, 'id'> & { userId: string } = {
      ...validation.data,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('inventory').doc(itemId).set({ id: itemId, ...itemData });

    return NextResponse.json({ message: 'Inventory item created successfully', id: itemId }, { status: 201 });

  } catch (error) {
    console.error('[OPERATIONS_INVENTORY_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}

// GET all inventory items
export async function GET(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const snapshot = await db.collection('inventory').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }
    const data = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[OPERATIONS_INVENTORY_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
