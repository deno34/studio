
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { generateInvoicePdf } from '@/lib/pdf';
// import { uploadFile } from '@/lib/storage'; // Removed storage interaction
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name cannot be empty.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
});

const invoiceSchema = z.object({
  clientName: z.string().min(1, 'Client name is required.'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required.'),
  tax: z.coerce.number().min(0).optional().default(0),
  companyName: z.string().optional().default('Nerida AI Inc.'),
});


export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = invoiceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid invoice data.', details: validation.error.flatten() }, { status: 400 });
    }
    
    // For this simplified version, we just return a success message.
    // The PDF generation and upload are skipped.
    const mockUrl = `https://example.com/mock-invoice-${uuidv4()}.pdf`;

    return NextResponse.json({ message: 'Invoice created successfully (mocked)', url: mockUrl }, { status: 201 });

  } catch (error) {
    console.error('[ACCOUNTING_INVOICES_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
