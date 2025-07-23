
'use server';

import { NextRequest, NextResponse } from 'next/server';

// This route is being bypassed. The business creation logic has been moved
// to the client-side component in `src/app/dashboard/add-business/page.tsx`
// to use the Realtime Database directly, avoiding server-side initialization issues.
// This file is kept to prevent 404 errors but does not perform any actions.

export async function POST(req: NextRequest) {
    console.warn("[API /api/modules/business] This route is deprecated and should not be called. Logic moved to client-side.");
    return NextResponse.json(
        { error: 'This endpoint is deprecated. Business creation is handled client-side.' },
        { status: 410 } // 410 Gone
    );
}
