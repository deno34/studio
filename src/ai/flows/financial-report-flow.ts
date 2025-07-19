
'use server';

/**
 * @fileOverview An AI flow for generating financial reports.
 * 
 * - generateFinancialReport - An exported wrapper function to call the flow.
 * - FinancialReportInput - The input type for the flow.
 * - FinancialReportOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExpenseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string(),
  note: z.string(),
});

export const FinancialReportInputSchema = z.object({
  reportType: z.enum(['pnl', 'balance_sheet']).describe("The type of financial report to generate."),
  expenses: z.array(ExpenseSchema).describe("A list of all expenses for the period."),
});
export type FinancialReportInput = z.infer<typeof FinancialReportInputSchema>;

export const FinancialReportOutputSchema = z.object({
  reportMarkdown: z.string().describe('The full financial report formatted as a Markdown string.'),
});
export type FinancialReportOutput = z.infer<typeof FinancialReportOutputSchema>;

export async function generateFinancialReport(input: FinancialReportInput): Promise<FinancialReportOutput> {
  return generateFinancialReportFlow(input);
}

const reportPrompt = ai.definePrompt({
    name: 'financialReportPrompt',
    input: { schema: FinancialReportInputSchema },
    output: { schema: FinancialReportOutputSchema },
    prompt: `You are a senior financial analyst tasked with creating a Profit & Loss (P&L) report.
Based on the provided list of expenses, generate a clear and concise P&L report in Markdown format.

**Assumptions for this Report:**
- Revenue is currently zero as it is not provided.
- The report should cover the period of the provided expenses.

**Data Provided:**
- Expenses: A list of expense records with amount, category, and date.

**Report Structure:**
1.  **Title**: "Profit & Loss Statement"
2.  **Summary Section**: Provide a brief, one-paragraph natural language summary of the financial performance. Mention the total revenue (assumed to be 0), total expenses, and the resulting net loss.
3.  **Detailed Breakdown**:
    - **Revenue**: State "Total Revenue:** KES 0.00"
    - **Expenses**:
        - List each expense category and its total amount.
        - Calculate and display "Total Expenses".
    - **Net Profit/Loss**:
        - Calculate and display the final "Net Loss".

**Example Markdown Output:**

\`\`\`markdown
# Profit & Loss Statement

This report summarizes the company's financial performance based on the available data. With zero revenue and total expenses amounting to [Total Expenses Amount], the company has a net loss of [Net Loss Amount]. The majority of spending was in the [Highest Spending Category] category.

---

### Revenue
- **Total Revenue:** KES 0.00

### Expenses
- **Marketing:** KES [Amount]
- **Software:** KES [Amount]
- **Travel:** KES [Amount]
- **Total Expenses:** KES [Total Amount]

---

### Net Loss
**Total Net Loss:** **KES [Net Loss Amount]**
\`\`\`

**Here is the data:**

Expenses:
{{#each expenses}}
- {{note}} ({{category}}): KES {{amount}} on {{date}}
{{/each}}

Please generate the full report based on this data.
`,
});

const generateFinancialReportFlow = ai.defineFlow(
  {
    name: 'generateFinancialReportFlow',
    inputSchema: FinancialReportInputSchema,
    outputSchema: FinancialReportOutputSchema,
  },
  async (input) => {
    const { output } = await reportPrompt(input);
    return output!;
  }
);
