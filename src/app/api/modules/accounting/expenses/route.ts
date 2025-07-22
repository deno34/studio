
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin';

// const db = admin.firestore();

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { amount, category, date, note } = await req.json();
    if (typeof amount !== 'number' || !category || !date || !note) {
        return NextResponse.json({ error: 'Missing required fields: amount, category, date, and note are required.' }, { status: 400 });
    }

    // Mock success without writing to DB
    return NextResponse.json({ message: 'Expense logged successfully (mocked)', id: `mock-${Date.now()}` }, { status: 201 });

  } catch (error) {
    console.error('[ACCOUNTING_EXPENSES_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
    let user;
    try {
      user = await validateApiKey(req);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    try {
        // MOCK DATA: Return a mock list of expenses
        const mockExpenses = [
            { id: '1', note: 'Client Dinner at The Carnivore', amount: 7500, category: 'Food & Entertainment', date: '2023-10-25', createdAt: new Date().toISOString() },
            { id: '2', note: 'Monthly Software Subscription', amount: 1200, category: 'Software', date: '2023-10-28', createdAt: new Date().toISOString() },
            { id: '3', note: 'Uber to meeting', amount: 550, category: 'Transport', date: '2023-10-29', createdAt: new Date().toISOString() },
        ];
        
        return NextResponse.json(mockExpenses, { status: 200 });

    } catch (error) {
        console.error('[ACCOUNTING_EXPENSES_GET_ERROR]', error);
        return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
    }
}
