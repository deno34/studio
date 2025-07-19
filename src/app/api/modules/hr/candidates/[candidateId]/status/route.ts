
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import * as z from 'zod';
import { CandidateStatus } from '@/lib/types';

const db = admin.firestore();

const StatusUpdateSchema = z.object({
  status: CandidateStatus,
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
    const validation = StatusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.flatten() }, { status: 400 });
    }

    const { status } = validation.data;

    const candidateRef = db.collection('candidates').doc(candidateId);
    const candidateDoc = await candidateRef.get();

    if (!candidateDoc.exists) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    
    // In a real application, you might add a history log of status changes here
    await candidateRef.update({ status });
    
    return NextResponse.json({ message: 'Candidate status updated successfully', id: candidateId, newStatus: status });

  } catch (error) {
    console.error(`[CANDIDATE_STATUS_UPDATE_ERROR]`, error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
