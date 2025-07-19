
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';

const db = admin.firestore();

export async function POST(req: NextRequest) {
  let user;
  try {
    // For this demo, we're not tying expenses to a specific logged-in user via token,
    // but validating that the request comes from a trusted source via API key.
    // The 'user' object here is a mock user from validateApiKey.
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { amount, category, date, note } = await req.json();
    if (typeof amount !== 'number' || !category || !date || !note) {
        return NextResponse.json({ error: 'Missing required fields: amount, category, date, and note are required.' }, { status: 400 });
    }

    const expenseData = { 
        amount, 
        category, 
        date, 
        note: note || '', 
        createdAt: new Date().toISOString(),
        // In a multi-user system, you'd use a real user ID here.
        // For now, we'll use a generic ID or the one from the mock user.
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
            // In a real multi-tenant app, you'd filter by the actual user's ID
            // .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .limit(20) // Let's limit the results for performance
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

    