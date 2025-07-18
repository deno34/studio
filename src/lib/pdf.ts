
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// This is a simplified example. You can make this much more sophisticated.
interface InvoiceData {
    invoiceNumber: string;
    clientName: string;
    items: { name: string; amount: number }[];
    tax: number;
    companyName?: string;
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header
  page.drawText(data.companyName || 'Nerida AI Inc.', { x: 50, y: height - 50, font: boldFont, size: 20 });
  page.drawText('Invoice', { x: width - 100, y: height - 50, font: boldFont, size: 20 });

  // Client Info
  page.drawText(`Bill to: ${data.clientName}`, { x: 50, y: height - 100, font: boldFont, size: 12 });
  page.drawText(`Invoice #: ${data.invoiceNumber}`, { x: 50, y: height - 120, font, size: 12 });

  // Table Header
  let yPosition = height - 180;
  page.drawText('Description', { x: 50, y: yPosition, font: boldFont, size: 12 });
  page.drawText('Amount', { x: width - 150, y: yPosition, font: boldFont, size: 12 });

  // Items
  let subtotal = 0;
  data.items.forEach(item => {
    yPosition -= 20;
    page.drawText(item.name, { x: 50, y: yPosition, font, size: 12 });
    page.drawText(`$${item.amount.toFixed(2)}`, { x: width - 150, y: yPosition, font, size: 12 });
    subtotal += item.amount;
  });
  
  // Totals
  yPosition -= 30;
  const taxAmount = subtotal * (data.tax / 100);
  const total = subtotal + taxAmount;

  page.drawText(`Subtotal:`, { x: width - 250, y: yPosition, font, size: 12 });
  page.drawText(`$${subtotal.toFixed(2)}`, { x: width - 150, y: yPosition, font, size: 12 });
  yPosition -= 20;
  page.drawText(`Tax (${data.tax}%):`, { x: width - 250, y: yPosition, font, size: 12 });
  page.drawText(`$${taxAmount.toFixed(2)}`, { x: width - 150, y: yPosition, font, size: 12 });
  yPosition -= 20;
  page.drawText(`Total:`, { x: width - 250, y: yPosition, font: boldFont, size: 14 });
  page.drawText(`$${total.toFixed(2)}`, { x: width - 150, y: yPosition, font: boldFont, size: 14 });


  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
