
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';

// This is a mock API endpoint. In a real application, you would fetch
// this data from a database where you log analytics events.

const mockAnalyticsData = {
  summary: {
    totalViews: 1258,
    totalApplicants: 73,
    avgTimeToHire: 28,
    conversionRate: 5.8,
  },
  viewsPerDay: [
    { date: 'Oct 20', views: 150 },
    { date: 'Oct 21', views: 180 },
    { date: 'Oct 22', views: 210 },
    { date: 'Oct 23', views: 190 },
    { date: 'Oct 24', views: 250 },
    { date: 'Oct 25', views: 220 },
    { date: 'Oct 26', views: 280 },
  ],
  trafficSources: [
    { source: 'LinkedIn', value: 45 },
    { source: 'Company Site', value: 25 },
    { source: 'Indeed', value: 20 },
    { source: 'Other', value: 10 },
  ],
};


export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  // In a real app, you would use the jobId to query your analytics data.
  // For now, we'll return the same mock data regardless of the ID.
  console.log(`Fetching mock analytics for jobId: ${jobId}`);

  return NextResponse.json(mockAnalyticsData);
}
