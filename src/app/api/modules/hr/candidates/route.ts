
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import admin from '@/lib/firebaseAdmin';
import { uploadFile } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import type { Candidate } from '@/lib/types';

const db = admin.firestore();

// POST a new candidate from a resume upload
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const jobId = formData.get('jobId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    if (!jobId) {
      return NextResponse.json({ error: 'No jobId provided.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let resumeText = '';

    // Extract text from PDF
    if (file.type === 'application/pdf') {
        const pdf = (await import('pdf-parse')).default;
        const data = await pdf(fileBuffer);
        resumeText = data.text;
    } else {
         return NextResponse.json({ error: 'Unsupported file type. Only PDF is currently supported.' }, { status: 400 });
    }

    if (!resumeText) {
        return NextResponse.json({ error: 'Could not extract text from the resume.' }, { status: 400 });
    }

    // Upload original resume to Firebase Storage
    const fileName = `resumes/${jobId}/${uuidv4()}-${file.name}`;
    const downloadUrl = await uploadFile(fileBuffer, fileName, file.type || 'application/pdf');

    // Create candidate record in Firestore
    const candidateId = uuidv4();
    const candidateData: Candidate = {
        id: candidateId,
        jobId: jobId,
        // The AI will extract the name later, for now we use the file name
        name: file.name || 'Unnamed Candidate',
        email: '', // AI will extract this
        resumeUrl: downloadUrl,
        resumeText: resumeText,
        createdAt: new Date().toISOString(),
        status: 'New',
    };

    await db.collection('candidates').doc(candidateId).set(candidateData);

    return NextResponse.json({ 
        message: 'Candidate created successfully', 
        candidate: {
            id: candidateId,
            resumeText: resumeText,
            name: file.name || 'Unnamed Candidate',
        }
    }, { status: 201 });

  } catch (error) {
    console.error('[HR_CANDIDATES_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred while processing the resume.' }, { status: 500 });
  }
}

// GET all candidates for a specific job
export async function GET(req: NextRequest) {
    try {
        await validateApiKey(req);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
        return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    try {
        const snapshot = await db.collection('candidates')
            .where('jobId', '==', jobId)
            .orderBy('createdAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            return NextResponse.json([], { status: 200 });
        }
        
        const data = snapshot.docs.map(doc => doc.data());
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('[HR_CANDIDATES_GET_ERROR]', error);
        return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
    }
}
