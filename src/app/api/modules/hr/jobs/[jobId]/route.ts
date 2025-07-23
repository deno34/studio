
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { getJobById } from '@/lib/firestoreService';

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const { jobId } = params;
  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  try {
    const job = await getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error(`[HR_JOB_GET_ERROR] for ID ${jobId}:`, error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
