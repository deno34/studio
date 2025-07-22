
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin';
import { JobPostingSchema, type JobPostingFormValues } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// const db = admin.firestore();

// GET all job postings
export async function GET(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    // MOCK DATA
    const mockJobs = [
        { id: 'job-1', title: 'Senior AI Engineer', location: 'Remote', status: 'Open', createdAt: new Date().toISOString(), userId: 'mock-user' },
        { id: 'job-2', title: 'Product Designer (UI/UX)', location: 'New York, NY', status: 'Open', createdAt: new Date().toISOString(), userId: 'mock-user' },
        { id: 'job-3', title: 'Growth Marketing Manager', location: 'Remote', status: 'Closed', createdAt: new Date().toISOString(), userId: 'mock-user' },
    ];
    return NextResponse.json(mockJobs, { status: 200 });
  } catch (error) {
    console.error('[HR_JOBS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}

// POST a new job posting
export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = JobPostingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }
    
    // MOCK SUCCESS
    const refId = uuidv4();
    return NextResponse.json({ message: 'Job post created successfully (mocked)', id: refId }, { status: 201 });

  } catch (error) {
    console.error('[HR_JOBS_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
