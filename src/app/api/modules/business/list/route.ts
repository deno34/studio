
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { getBusinessesForUser } from '@/lib/databaseService'; // SWITCHED TO databaseService

// GET all businesses for the authenticated user
export async function GET(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const businesses = await getBusinessesForUser(user.uid);
    return NextResponse.json(businesses, { status: 200 });
  } catch (error) {
    console.error('[BUSINESS_GET_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
