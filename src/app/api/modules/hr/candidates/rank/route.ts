
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { rankCandidate } from '@/ai/flows/candidate-ranking-flow';
import admin from '@/lib/firebaseAdmin';
import * as z from 'zod';

const db = admin.firestore();

const RankRequestSchema = z.object({
  jobId: z.string(),
  resumeText: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = RankRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const { jobId, resumeText } = validation.data;

    // Fetch job details from Firestore
    const jobDoc = await db.collection('jobPostings').doc(jobId).get();
    if (!jobDoc.exists) {
      return NextResponse.json({ error: 'Job posting not found.' }, { status: 404 });
    }
    const jobData = jobDoc.data();
    if (!jobData) {
        return NextResponse.json({ error: 'Job data is invalid.' }, { status: 500 });
    }


    // Call the AI ranking flow
    const rankingResult = await rankCandidate({
      jobTitle: jobData.title,
      jobDescription: jobData.description,
      resumeText: resumeText,
    });

    return NextResponse.json(rankingResult);

  } catch (error: any) {
    console.error('[CANDIDATE_RANK_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during candidate ranking.', details: error.message }, { status: 500 });
  }
}
