
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import type { Candidate } from '@/lib/types';

// This endpoint is no longer for uploading, but for creating a candidate record
// after the file has been uploaded client-side.

// POST a new candidate from a resume upload
export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const { jobId, fileName, resumeUrl, resumeText } = await req.json();

    if (!jobId || !fileName || !resumeUrl || resumeText === undefined) {
      return NextResponse.json({ error: 'Missing required fields: jobId, fileName, resumeUrl, resumeText' }, { status: 400 });
    }

    const candidateId = uuidv4();
    const newCandidate: Partial<Candidate> = {
      id: candidateId,
      jobId,
      name: fileName.replace(/\.[^/.]+$/, ""), // Use filename as initial name
      email: '', // To be extracted by AI later
      resumeUrl,
      resumeText,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    
    // In a real app, this would be saved to Firestore.
    // For this mock, we just return it.
    
    return NextResponse.json({ 
        message: 'Candidate created successfully (mocked)', 
        candidate: newCandidate
    }, { status: 201 });

  } catch (error) {
    console.error('[HR_CANDIDATES_POST_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred while creating the candidate record.' }, { status: 500 });
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
