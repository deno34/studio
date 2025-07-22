
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin';
import * as z from 'zod';
import { CandidateStatus } from '@/lib/types';

// const db = admin.firestore();

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

    // Mock success
    return NextResponse.json({ message: 'Candidate status updated successfully (mocked)', id: candidateId, newStatus: status });

  } catch (error) {
    console.error(`[CANDIDATE_STATUS_UPDATE_ERROR]`, error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
