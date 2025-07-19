
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import * as z from 'zod';

const db = admin.firestore();

const ScheduleInterviewSchema = z.object({
  candidateId: z.string(),
  jobId: z.string(),
  interviewer: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  time: z.string(),
  location: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = ScheduleInterviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.flatten() }, { status: 400 });
    }

    const { candidateId, jobId, interviewer, date, time, location } = validation.data;

    // TODO: Integrate with a real Calendar API (e.g., Google Calendar)
    // 1. Check interviewer's availability using the Calendar API.
    // 2. Create a calendar event.
    // 3. Send invitations to the candidate and the interviewer.
    // 4. Handle potential errors from the API.

    // For now, we will just log the request and update the candidate's status in Firestore.
    console.log('Mocking calendar event creation:', validation.data);

    // Update candidate status to 'Interviewing'
    await db.collection('candidates').doc(candidateId).update({
      status: 'Interviewing',
    });
    
    // You could also store interview details in a separate 'interviews' collection
    await db.collection('interviews').add({
        ...validation.data,
        createdAt: new Date().toISOString(),
    });


    // Mocked successful response
    return NextResponse.json({ message: 'Interview scheduled successfully (mocked). Event has been logged.' }, { status: 200 });

  } catch (error: any) {
    console.error('[INTERVIEW_SCHEDULE_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred while scheduling the interview.', details: error.message }, { status: 500 });
  }
}
