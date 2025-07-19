
'use server';

/**
 * @fileOverview An AI flow for summarizing payroll documents.
 * 
 * - summarizePayroll - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { PayrollSummaryInput, PayrollSummaryInputSchema, PayrollSummaryOutput, PayrollSummaryOutputSchema } from '@/lib/types';


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
