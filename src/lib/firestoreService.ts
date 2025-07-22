
'use server';

import { type Business, type JobPosting } from './types';

// MOCKED FUNCTIONS - NO DATABASE INTERACTION

export async function saveBusiness(businessData: Omit<Business, 'createdAt'>): Promise<string> {
  console.log('[FirestoreService Mock] Pretending to save business:', businessData.name);
  return Promise.resolve(businessData.id);
}

export async function getBusinessesForUser(userId: string): Promise<Business[]> {
  console.log(`[FirestoreService Mock] Pretending to fetch businesses for user: ${userId}`);
  const mockBusinesses: Business[] = [
    {
      id: 'mock-biz-1',
      userId: userId,
      name: 'Mock Innovations',
      description: 'A mock business for testing purposes.',
      industry: 'tech',
      logoUrl: 'https://placehold.co/100x100.png',
      selectedAgents: ['accounting', 'hr'],
      createdAt: new Date().toISOString(),
    }
  ];
  return Promise.resolve(mockBusinesses);
}

export async function saveJob(jobData: Omit<JobPosting, 'createdAt'>): Promise<string> {
    console.log(`[FirestoreService Mock] Pretending to save job: ${jobData.title}`);
    return Promise.resolve(jobData.id);
}

export async function getJobs(userId: string): Promise<JobPosting[]> {
    console.log(`[FirestoreService Mock] Pretending to fetch jobs for user ${userId}`);
    const mockJobs: JobPosting[] = [
        {
            id: 'mock-job-1',
            userId: userId,
            title: 'Mock Senior AI Engineer',
            location: 'Remote',
            description: 'This is a mocked job description.',
            status: 'Open',
            createdAt: new Date().toISOString(),
        }
    ];
    return Promise.resolve(mockJobs);
}
