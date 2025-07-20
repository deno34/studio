
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
  yPosition -= 15;
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });


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
   page.drawLine({
    start: { x: width-280, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 0.5,
    color: rgb(0.75, 0.75, 0.75),
  });
  yPosition -= 20;


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


// A more generic PDF generator for reports from Markdown
export async function generateReportPdf(markdownContent: string): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const codeFont = await pdfDoc.embedFont(StandardFonts.Courier);

    let y = height - 50;

    // Very basic Markdown parser
    const lines = markdownContent.split('\n');
    for (const line of lines) {
        if (y < 40) {
            // Add a new page if content overflows
            const newPage = pdfDoc.addPage([595, 842]);
            page.setRotation(0); // Resetting to current page
            Object.assign(page, newPage);
            y = height - 50;
        }

        if (line.startsWith('# ')) {
            page.drawText(line.substring(2), { x: 50, y, font: boldFont, size: 24 });
            y -= 30;
        } else if (line.startsWith('### ')) {
            page.drawText(line.substring(4), { x: 50, y, font: boldFont, size: 14 });
            y -= 20;
        } else if (line.startsWith('- ')) {
            page.drawText(`• ${line.substring(2)}`, { x: 60, y, font, size: 11 });
            y -= 15;
        } else if (line.startsWith('---')) {
             page.drawLine({ start: { x: 50, y: y }, end: { x: width - 50, y: y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
             y -= 15;
        } else {
            page.drawText(line, { x: 50, y, font, size: 11 });
            y -= 15;
        }
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
