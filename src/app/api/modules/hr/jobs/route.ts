
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { JobPostingSchema, type JobPostingFormValues } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { saveJob, getJobs } from '@/lib/firestoreService';

// GET all job postings
export async function GET(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const jobs = await getJobs(user.uid);
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('[HR_JOBS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}

// POST a new job posting
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = JobPostingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    const jobData = {
      ...validation.data,
      id: uuidv4(),
      userId: user.uid,
      status: 'Open' as const,
    };

    await saveJob(jobData);
    
    return NextResponse.json({ message: 'Job post created successfully', id: jobData.id }, { status: 201 });

  } catch (error) {
    console.error('[HR_JOBS_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
