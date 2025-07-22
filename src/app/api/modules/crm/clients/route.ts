
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { ClientSchema, type Client } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// const db = admin.firestore();

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
    
    // Mock success without DB write
    return NextResponse.json({ message: 'Client created successfully (mocked)', id: clientId }, { status: 201 });

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
    // MOCK DATA
    const mockClients = [
        { id: 'client-1', name: 'Innovate Inc.', email: 'contact@innovate.com', company: 'Innovate Inc.', status: 'Proposal', createdAt: new Date().toISOString() },
        { id: 'client-2', name: 'Tech Solutions LLC', email: 'info@techsolutions.com', company: 'Tech Solutions LLC', status: 'Lead', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'client-3', name: 'Data Corp', email: 'sales@datacorp.com', company: 'Data Corp', status: 'Contacted', createdAt: new Date().toISOString() },
    ];
    return NextResponse.json(mockClients, { status: 200 });
  } catch (error) {
    console.error('[CRM_CLIENTS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
