import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { generateInvoicePdf } from '@/lib/pdf';
import { uploadFile } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await validateApiKey(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientName, items, tax = 0, companyName = "Nerida AI Inc." } = body;

    if (!clientName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: clientName and at least one item are required.' }, { status: 400 });
    }
    
    const invoiceNumber = uuidv4().substring(0, 8).toUpperCase();
    
    const pdfBuffer = await generateInvoicePdf({
      invoiceNumber,
      clientName,
      items,
      tax,
      companyName,
    });

    const fileName = `invoices/${user.uid}/${invoiceNumber}.pdf`;
    const downloadUrl = await uploadFile(pdfBuffer, fileName, 'application/pdf');

    return NextResponse.json({ message: 'Invoice created successfully', url: downloadUrl }, { status: 201 });

  } catch (error) {
    console.error('[ACCOUNTING_INVOICES_ERROR]', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
