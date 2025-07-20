
'use server';

/**
 * @fileOverview An AI flow for analyzing competitor websites.
 * 
 * - analyzeCompetitor - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import {
    CompetitorAnalysisInput,
    CompetitorAnalysisInputSchema,
    CompetitorAnalysisOutput,
    CompetitorAnalysisOutputSchema
} from '@/lib/types';


export async function analyzeCompetitor(input: CompetitorAnalysisInput): Promise<CompetitorAnalysisOutput> {
  return competitorAnalysisFlow(input);
}

const competitorAnalysisPrompt = ai.definePrompt({
    name: 'competitorAnalysisPrompt',
    input: { schema: CompetitorAnalysisInputSchema },
    output: { schema: CompetitorAnalysisOutputSchema },
    prompt: `You are a business intelligence analyst specializing in competitive analysis.
Your task is to analyze the provided HTML content from a competitor's website and extract specific information based on the user's request.

**Categories to Analyze:**
{{#each categories}}
- {{this}}
{{/each}}

**HTML Content:**
---
{{htmlContent}}
---

**Instructions:**

1.  **Parse the HTML:** Read through the HTML to understand the structure and content of the page.
2.  **Extract Information:** For each requested category, extract the relevant data points.
    -   **Headlines:** Identify the main headings (h1, h2) and marketing slogans.
    -   **Pricing:** Find any pricing information, including plans, prices, and features.
    -   **Key Features:** List the main product or service features mentioned.
    -   **Recent News:** Look for blog post titles, press releases, or announcements.
3.  **Generate a High-Level Summary:** Write a brief, one-paragraph summary of your overall findings. What is this company's main offering? What are they highlighting on this page?
4.  **Format Output:** Return the data in the specified JSON format. For each category, provide a list of findings. If no information is found for a category, return an empty array for its findings.

Return the final analysis in the specified JSON format.
`,
});

const competitorAnalysisFlow = ai.defineFlow(
  {
    name: 'competitorAnalysisFlow',
    inputSchema: CompetitorAnalysisInputSchema,
    outputSchema: CompetitorAnalysisOutputSchema,
  },
  async (input) => {
    // To handle large HTML content, we might truncate it if it exceeds the model's token limit.
    const maxChars = 30000; // A safe limit for many models
    if (input.htmlContent.length > maxChars) {
      input.htmlContent = input.htmlContent.substring(0, maxChars);
    }
    const { output } = await competitorAnalysisPrompt(input);
    return output!;
  }
);
