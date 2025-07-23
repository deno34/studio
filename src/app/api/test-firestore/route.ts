
import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  console.log('[API TEST] Received request to test Firestore connection.');
  
  try {
    const db = admin.firestore();
    console.log('[API TEST] Firestore instance obtained successfully.');

    const testDocRef = db.collection('internal_tests').doc('firestore_connection');
    
    await testDocRef.set({
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'Server-side Firestore connection is working correctly.',
    });
    
    console.log('[API TEST] Successfully wrote to Firestore test document.');

    return NextResponse.json({ 
        success: true, 
        message: 'Firestore connection test successful. Check terminal logs for details.' 
    });

  } catch (error: any) {
    console.error('[API TEST] FIRESTORE CONNECTION FAILED:', error);
    return NextResponse.json(
        { 
            success: false, 
            message: 'Firestore connection test failed. Check server terminal for detailed error logs.',
            error: error.message 
        }, 
        { status: 500 }
    );
  }
}
