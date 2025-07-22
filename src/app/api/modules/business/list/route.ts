
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin'; // DB interaction removed

// const db = admin.firestore();

// GET all businesses for the authenticated user
export async function GET(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    // MOCK DATA
    const mockBusinesses = [
        {
            id: 'biz-1',
            userId: user.uid,
            name: 'Acme Innovations Inc.',
            description: 'A mock company for testing purposes.',
            industry: 'Technology / SaaS',
            logoUrl: 'https://placehold.co/100x100.png',
            createdAt: new Date().toISOString(),
            selectedAgents: ['accounting', 'hr', 'operations'],
        },
        {
            id: 'biz-2',
            userId: user.uid,
            name: 'Global Logistics',
            description: 'Another mock company.',
            industry: 'Logistics / Supply Chain',
            logoUrl: 'https://placehold.co/100x100.png',
            createdAt: new Date().toISOString(),
            selectedAgents: ['operations', 'document'],
        }
    ];
    
    return NextResponse.json(mockBusinesses, { status: 200 });

  } catch (error) {
    console.error('[BUSINESS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
