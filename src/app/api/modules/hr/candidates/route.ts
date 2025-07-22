
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
// import admin from '@/lib/firebaseAdmin';
// import { uploadFile } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import type { Candidate } from '@/lib/types';

// const db = admin.firestore();

// POST a new candidate from a resume upload
export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
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

    // Mock success without DB write or file upload
    const candidateId = uuidv4();
    const mockCandidate = {
      id: candidateId,
      resumeText: "This is mock resume text extracted from the PDF.",
      name: file.name || 'Unnamed Candidate',
    };
    
    return NextResponse.json({ 
        message: 'Candidate created successfully (mocked)', 
        candidate: mockCandidate
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
        // MOCK DATA
        const mockCandidates = [
            { id: 'cand-1', jobId, name: 'Elena Rodriguez', email: 'elena@example.com', resumeUrl: '#', resumeText: '', createdAt: new Date().toISOString(), status: 'Shortlisted', matchPercentage: 98, matchExplanation: 'Excellent fit.', matchingSkills: ['Python', 'PyTorch', 'System Design'] },
            { id: 'cand-2', jobId, name: 'Ben Carter', email: 'ben@example.com', resumeUrl: '#', resumeText: '', createdAt: new Date().toISOString(), status: 'New', matchPercentage: 95, matchExplanation: 'Strong candidate.', matchingSkills: ['Go', 'Kubernetes', 'APIs'] },
            { id: 'cand-3', jobId, name: 'Priya Sharma', email: 'priya@example.com', resumeUrl: '#', resumeText: '', createdAt: new Date().toISOString(), status: 'Interviewing', matchPercentage: 92, matchExplanation: 'Good experience.', matchingSkills: ['React', 'UX/UI', 'Figma'] },
        ];
        
        return NextResponse.json(mockCandidates, { status: 200 });

    } catch (error) {
        console.error('[HR_CANDIDATES_GET_ERROR]', error);
        return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
    }
}
