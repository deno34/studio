
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';

const db = admin.firestore();

// GET all businesses for the authenticated user
export async function GET(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const snapshot = await db.collection('businesses')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get();
      
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }
    
    const data = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('[BUSINESS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
