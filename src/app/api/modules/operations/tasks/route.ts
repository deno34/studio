
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin';
import { TaskSchema, type Task } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// const db = admin.firestore();

// POST a new task
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = TaskSchema.pick({title: true, type: true, dueDate: true}).safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }

    const taskId = uuidv4();
    // Mock success
    return NextResponse.json({ message: 'Task created successfully (mocked)', id: taskId }, { status: 201 });

  } catch (error) {
    console.error('[OPERATIONS_TASKS_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}

// GET all tasks
export async function GET(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    // MOCK DATA
     const mockTasks = [
        { id: '1', title: 'Finalize Q3 Report', type: 'Task', status: 'Completed', dueDate: new Date().toISOString(), userId: 'mock-user', createdAt: new Date().toISOString() },
        { id: '2', title: 'Team Sync', type: 'Meeting', status: 'Upcoming', dueDate: new Date().toISOString(), userId: 'mock-user', createdAt: new Date().toISOString() },
        { id: '3', title: 'Prepare client presentation', type: 'Task', status: 'Upcoming', dueDate: new Date().toISOString(), userId: 'mock-user', createdAt: new Date().toISOString() },
    ];
    return NextResponse.json(mockTasks, { status: 200 });
  } catch (error) {
    console.error('[OPERATIONS_TASKS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
