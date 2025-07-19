
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import * as z from 'zod';

const db = admin.firestore();

const NotesUpdateSchema = z.object({
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const { candidateId } = params;
  if (!candidateId) {
    return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validation = NotesUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.flatten() }, { status: 400 });
    }

    const { notes } = validation.data;

    const candidateRef = db.collection('candidates').doc(candidateId);
    const candidateDoc = await candidateRef.get();

    if (!candidateDoc.exists) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    
    await candidateRef.update({ notes: notes || "" });
    
    return NextResponse.json({ message: 'Candidate notes updated successfully', id: candidateId });

  } catch (error) {
    console.error(`[CANDIDATE_NOTES_UPDATE_ERROR]`, error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
