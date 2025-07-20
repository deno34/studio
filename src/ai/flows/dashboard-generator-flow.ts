
'use server';

/**
 * @fileOverview An AI flow for generating dashboard data from a dataset.
 * 
 * - generateDashboardData - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { DashboardGeneratorInput, DashboardGeneratorInputSchema, DashboardGeneratorOutput, DashboardGeneratorOutputSchema } from '@/lib/types';


export async function generateDashboardData(input: DashboardGeneratorInput): Promise<DashboardGeneratorOutput> {
  return dashboardGeneratorFlow(input);
}

const dashboardPrompt = ai.definePrompt({
    name: 'dashboardGeneratorPrompt',
    input: { schema: DashboardGeneratorInputSchema },
    output: { schema: DashboardGeneratorOutputSchema },
    prompt: `You are a senior data analyst and business intelligence expert.
Your task is to analyze the provided dataset and the user's request to create a set of relevant KPI dashboard cards.

**User's Goal/Prompt:**
---
"{{prompt}}"
---

**Dataset (JSON format):**
---
{{data}}
---

**Instructions:**
1.  **Analyze the Data and Prompt:** Understand the user's objective and analyze the provided data to identify the key metrics that can fulfill the request.
2.  **Generate KPI Cards:** Create a list of 2 to 4 distinct KPI cards. For each card:
    -   **title:** A short, descriptive title for the metric (e.g., "Total Revenue", "Average Order Value").
    -   **value:** The calculated value for the metric, formatted as a clear string (e.g., "$1,250,455.78", "4,231", "85.4%").
    -   **insight:** A brief, one-sentence insight or observation about the metric. This should be a human-readable comment on what the number means (e.g., "Revenue has increased significantly over the last period.", "User growth is slower than expected.").

Return the result as a JSON object containing a list of these KPI cards under the 'cards' key.
`,
});

const dashboardGeneratorFlow = ai.defineFlow(
  {
    name: 'dashboardGeneratorFlow',
    inputSchema: DashboardGeneratorInputSchema,
    outputSchema: DashboardGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await dashboardPrompt(input);
    return output!;
  }
);

