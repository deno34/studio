
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { generateDailyPlan } from '@/ai/flows/daily-planner-flow';
import { DailyPlannerInput, Task } from '@/lib/types';
import { format } from 'date-fns';

// const db = admin.firestore();

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    // Get today's date in 'YYYY-MM-DD' format
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // MOCK DATA: Replace Firestore call with mock data
    const tasks: Task[] = [
        { id: '1', title: 'Finalize Q3 Report', type: 'Task', status: 'Upcoming', dueDate: `${today}T10:00:00.000Z`, userId: 'mock-user', createdAt: new Date().toISOString() },
        { id: '2', title: 'Team Sync', type: 'Meeting', status: 'Upcoming', dueDate: `${today}T11:00:00.000Z`, userId: 'mock-user', createdAt: new Date().toISOString() },
        { id: '3', title: 'Prepare slides for client presentation', type: 'Task', status: 'Upcoming', dueDate: `${today}T14:00:00.000Z`, userId: 'mock-user', createdAt: new Date().toISOString() },
    ];

    const input: DailyPlannerInput = {
        tasks,
    };
    
    const result = await generateDailyPlan(input);
    
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('[PLANNER_GENERATION_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred during plan generation.', details: error.message }, { status: 500 });
  }
}
