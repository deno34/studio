
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { generateReportPdf } from '@/lib/pdf';
import * as z from 'zod';

const exportSchema = z.object({
  markdownContent: z.string().min(1, 'Markdown content cannot be empty.'),
});

export async function POST(req: NextRequest) {
  try {
    await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = exportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.', details: validation.error.flatten() }, { status: 400 });
    }

    const { markdownContent } = validation.data;
    const pdfBuffer = await generateReportPdf(markdownContent);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="report.pdf"',
      },
    });

  } catch (error) {
    console.error('[ACCOUNTING_REPORTS_EXPORT_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
