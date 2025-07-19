
'use server';

/**
 * @fileOverview An AI flow for generating logistics plans.
 * 
 * - generateLogisticsPlan - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { LogisticsPlanInput, LogisticsPlanInputSchema, LogisticsPlanOutput, LogisticsPlanOutputSchema } from '@/lib/types';


export async function generateLogisticsPlan(input: LogisticsPlanInput): Promise<LogisticsPlanOutput> {
  return logisticsPlanFlow(input);
}

const logisticsPrompt = ai.definePrompt({
    name: 'logisticsPlanPrompt',
    input: { schema: LogisticsPlanInputSchema },
    output: { schema: LogisticsPlanOutputSchema },
    prompt: `You are an expert logistics coordinator with 25 years of experience in freight forwarding in East Africa.
Your task is to create a logistics plan based on the user's request. Provide a practical and cost-effective solution.

**Shipment Details:**
- **From:** {{origin}}
- **To:** {{destination}}
- **Mode of Transport:** {{transportMode}}
- **Goods:** {{goodsDescription}}
{{#if deliveryDeadline}}
- **Required Delivery Deadline:** {{deliveryDeadline}}
{{/if}}

**Your Task:**
1.  **Recommended Route:** Suggest the most logical and efficient route. Mention key cities or checkpoints if applicable.
2.  **Estimated Cost:** Provide a realistic cost estimate in KES (Kenyan Shillings). Be specific (e.g., "KES 80,000 - 95,000").
3.  **Estimated Time:** Give a clear delivery time estimate (e.g., "3-4 business days").
4.  **Suggested Vendor:** Recommend a reliable, well-known logistics provider for this route (e.g., "Bolloré Logistics", "DB Schenker", "Maersk", "A.P. Moller").
5.  **Summary:** Write a brief, one-paragraph summary of the plan, explaining your choices and any important considerations. If a deadline is provided, explicitly state whether the plan meets the deadline.

Return the result in the specified JSON format.
`,
});

const logisticsPlanFlow = ai.defineFlow(
  {
    name: 'logisticsPlanFlow',
    inputSchema: LogisticsPlanInputSchema,
    outputSchema: LogisticsPlanOutputSchema,
  },
  async (input) => {
    const { output } = await logisticsPrompt(input);
    return output!;
  }
);
