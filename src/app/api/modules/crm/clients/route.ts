
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { ClientSchema, type Client } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const db = admin.firestore();

// POST a new client
export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = ClientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }

    const clientId = uuidv4();
    const clientData: Omit<Client, 'id'> = {
      ...validation.data,
      createdAt: new Date().toISOString(),
    };

    await db.collection('clients').doc(clientId).set({ id: clientId, ...clientData });

    return NextResponse.json({ message: 'Client created successfully', id: clientId }, { status: 201 });

  } catch (error) {
    console.error('[CRM_CLIENTS_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}

// GET all clients
export async function GET(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const snapshot = await db.collection('clients').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }
    const data = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[CRM_CLIENTS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
