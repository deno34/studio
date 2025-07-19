
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { generateDailyPlan } from '@/ai/flows/daily-planner-flow';
import { DailyPlannerInput, Task } from '@/lib/types';
import { format } from 'date-fns';

const db = admin.firestore();

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    // Get today's date in 'YYYY-MM-DD' format
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Fetch all tasks where the dueDate is today.
    // NOTE: This requires a composite index in Firestore on (dueDate, createdAt).
    // The emulator will suggest creating this if it doesn't exist.
    const tasksSnapshot = await db.collection('tasks')
        .where('dueDate', '>=', `${today}T00:00:00.000Z`)
        .where('dueDate', '<=', `${today}T23:59:59.999Z`)
        .orderBy('dueDate')
        .get();

    const tasks = tasksSnapshot.docs.map(doc => doc.data()) as Task[];

    const input: DailyPlannerInput = {
        tasks,
    };
    
    const result = await generateDailyPlan(input);
    
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('[PLANNER_GENERATION_ERROR]', error);
    // Check for Firestore index error
    if (error.message && error.message.includes('requires an index')) {
         return NextResponse.json({ error: 'Firestore index required. Please check the backend logs for the creation link.', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An internal error occurred during plan generation.', details: error.message }, { status: 500 });
  }
}
