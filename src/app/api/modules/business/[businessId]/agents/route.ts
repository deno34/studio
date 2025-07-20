
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import * as z from 'zod';

const db = admin.firestore();

const AgentsUpdateSchema = z.object({
  agents: z.array(z.string()).min(1, 'At least one agent must be selected.'),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const { businessId } = params;
  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validation = AgentsUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.flatten() }, { status: 400 });
    }

    const { agents } = validation.data;

    const businessRef = db.collection('businesses').doc(businessId);
    const businessDoc = await businessRef.get();

    if (!businessDoc.exists) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    // In a real app, you might also validate that the user making the request owns this business.
    // For now, we trust the API key validation.
    
    await businessRef.update({ selectedAgents: agents });
    
    return NextResponse.json({ message: 'Agents selected successfully', id: businessId });

  } catch (error) {
    console.error(`[BUSINESS_AGENTS_UPDATE_ERROR]`, error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
