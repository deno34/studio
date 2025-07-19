
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { generateFollowupSuggestions } from '@/ai/flows/lead-followup-flow';
import { Client, LeadFollowupSuggestionInput } from '@/lib/types';

const db = admin.firestore();

export async function GET(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const clientsSnapshot = await db.collection('clients').get();
    const clients = clientsSnapshot.docs.map(doc => doc.data()) as Client[];

    if (clients.length === 0) {
        return NextResponse.json({ suggestions: [] });
    }

    const input: LeadFollowupSuggestionInput = {
        clients: clients.map(client => ({
            name: client.name,
            status: client.status,
            createdAt: client.createdAt,
        }))
    };
    
    const result = await generateFollowupSuggestions(input);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[LEAD_SUGGESTION_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during suggestion generation.', details: error.message }, { status: 500 });
  }
}
