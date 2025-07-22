
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin';
import { generateFollowupSuggestions } from '@/ai/flows/lead-followup-flow';
import { Client, LeadFollowupSuggestionInput } from '@/lib/types';

// const db = admin.firestore();

export async function GET(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    // MOCK DATA
    const clients: Client[] = [
        { id: 'client-1', name: 'Innovate Inc.', email: 'contact@innovate.com', company: 'Innovate Inc.', status: 'Proposal', createdAt: new Date().toISOString() },
        { id: 'client-2', name: 'Tech Solutions LLC', email: 'info@techsolutions.com', company: 'Tech Solutions LLC', status: 'Lead', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'client-3', name: 'Data Corp', email: 'sales@datacorp.com', company: 'Data Corp', status: 'Contacted', createdAt: new Date().toISOString() },
    ];

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
