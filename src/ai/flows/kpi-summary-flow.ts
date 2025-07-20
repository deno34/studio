
'use server';

/**
 * @fileOverview An AI flow for generating KPI summaries and recommendations.
 * 
 * - generateKpiSummary - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { KpiSummaryInput, KpiSummaryInputSchema, KpiSummaryOutput, KpiSummaryOutputSchema } from '@/lib/types';


export async function generateKpiSummary(input: KpiSummaryInput): Promise<KpiSummaryOutput> {
  return kpiSummaryFlow(input);
}

const summaryPrompt = ai.definePrompt({
    name: 'kpiSummaryPrompt',
    input: { schema: KpiSummaryInputSchema },
    output: { schema: KpiSummaryOutputSchema },
    prompt: `You are a senior business analyst and strategist.
Your task is to analyze a Key Performance Indicator (KPI) and provide a concise, actionable summary.

**KPI to Analyze:**
---
Name: {{kpiName}}
Data (last 6 periods): {{kpiData}}
---

**Instructions:**
1.  **Analyze the Trend:** Look at the data provided. Is the overall trend positive (improving), negative (declining), or stable?
2.  **Provide a Summary:** Write a one-sentence summary explaining the trend. For example: "Monthly Recurring Revenue shows strong consistent growth over the last six months."
3.  **Suggest a Cause:** Based on the trend, suggest a likely cause. For example: "This is likely due to the new marketing campaign launched in Q2."
4.  **Recommend an Action:** Provide one clear, actionable recommendation. For example: "Recommendation: Double down on the current marketing strategy and expand to new channels."
5.  **Set Status:** Based on your analysis, set the 'status' to one of the following: "Improving" (for positive trends), "Warning" (for negative trends), or "Stable" (for flat trends).

Return the result in the specified JSON format.
`,
});

const kpiSummaryFlow = ai.defineFlow(
  {
    name: 'kpiSummaryFlow',
    inputSchema: KpiSummaryInputSchema,
    outputSchema: KpiSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await summaryPrompt(input);
    return output!;
  }
);
