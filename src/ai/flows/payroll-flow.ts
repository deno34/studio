
'use server';

/**
 * @fileOverview An AI flow for summarizing payroll documents.
 * 
 * - summarizePayroll - An exported wrapper function to call the flow.
 * - PayrollSummaryInput - The input type for the flow.
 * - PayrollSummaryOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PayrollSummaryInputSchema = z.object({
  payslipDataUri: z.string().describe("The content of the payslip. This can be a data URI for an image (e.g., 'data:image/png;base64,...') or the extracted text content from a PDF."),
  mimeType: z.string().describe("The MIME type of the uploaded document (e.g., 'application/pdf', 'image/png')."),
});
export type PayrollSummaryInput = z.infer<typeof PayrollSummaryInputSchema>;

const PayrollSummaryOutputSchema = z.object({
  employeeName: z.string().optional().describe('The full name of the employee.'),
  payPeriod: z.string().optional().describe('The pay period (e.g., "October 2023" or "2023-10-01 to 2023-10-31").'),
  grossPay: z.number().optional().describe('The total gross salary before deductions.'),
  netPay: z.number().optional().describe('The final take-home pay after all deductions.'),
  deductions: z.array(z.object({
    name: z.string().describe('The name of the deduction (e.g., "Income Tax", "Pension Contribution").'),
    amount: z.number().describe('The amount of the deduction.'),
  })).optional().describe('A list of all deductions from the gross pay.'),
  isPayslip: z.boolean().describe('Whether the document appears to be a valid payslip or payroll document.'),
});
export type PayrollSummaryOutput = z.infer<typeof PayrollSummaryOutputSchema>;

export async function summarizePayroll(input: PayrollSummaryInput): Promise<PayrollSummaryOutput> {
  return payrollSummaryFlow(input);
}

const payrollPrompt = ai.definePrompt({
    name: 'payrollSummaryPrompt',
    input: { schema: PayrollSummaryInputSchema },
    output: { schema: PayrollSummaryOutputSchema },
    prompt: `You are an expert financial analyst specializing in parsing payroll documents.
Analyze the following document, which could be an image or text from a PDF.
Your task is to extract key payroll information with high accuracy.

If the document does not appear to be a payslip, set the 'isPayslip' flag to false and return empty values for the other fields.

Document Content:
{{#if (eq mimeType "application/pdf")}}
Text from PDF: {{{payslipDataUri}}}
{{else}}
Image of Payslip: {{media url=payslipDataUri}}
{{/if}}

Extract the employee's full name, the pay period, gross pay, net pay, and a list of all deductions with their amounts.
Return the data in the specified JSON format.
`,
});

const payrollSummaryFlow = ai.defineFlow(
  {
    name: 'payrollSummaryFlow',
    inputSchema: PayrollSummaryInputSchema,
    outputSchema: PayrollSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await payrollPrompt(input);
    return output!;
  }
);
