import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';

const db = admin.firestore();

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { amount, category, date, note } = await req.json();
    if (typeof amount !== 'number' || !category || !date) {
        return NextResponse.json({ error: 'Missing required fields: amount, category, and date are required.' }, { status: 400 });
    }

    const expenseData = { 
        amount, 
        category, 
        date, 
        note: note || '', 
        createdAt: new Date().toISOString(),
        userId: user.uid,
    };
    
    const ref = await db.collection('expenses').add(expenseData);
    
    return NextResponse.json({ message: 'Expense logged successfully', id: ref.id }, { status: 201 });

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
        const snapshot = await db.collection('expenses')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        if (snapshot.empty) {
            return NextResponse.json([], { status: 200 });
        }
            
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('[ACCOUNTING_EXPENSES_GET_ERROR]', error);
        return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
    }
}
