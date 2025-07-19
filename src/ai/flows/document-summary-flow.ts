
'use server';

/**
 * @fileOverview An AI flow for summarizing documents.
 * 
 * - summarizeDocument - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { DocumentSummaryInput, DocumentSummaryInputSchema, DocumentSummaryOutput, DocumentSummaryOutputSchema } from '@/lib/types';


export async function summarizeDocument(input: DocumentSummaryInput): Promise<DocumentSummaryOutput> {
  return documentSummaryFlow(input);
}

const summaryPrompt = ai.definePrompt({
    name: 'documentSummaryPrompt',
    input: { schema: DocumentSummaryInputSchema },
    output: { schema: DocumentSummaryOutputSchema },
    prompt: `You are an expert document analyst.
Your task is to thoroughly analyze the provided document text and generate a concise summary.

**Document Text:**
---
{{documentText}}
---

**Analysis Instructions:**
1.  **Summary Points:** Create a bulleted list of the most important points and key takeaways from the document.
2.  **Sentiment Analysis:** Determine the overall sentiment of the document. Is it Positive, Negative, or Neutral?
3.  **Entity Extraction:** Identify and list any mentioned people, companies, or organizations.

Return the result in the specified JSON format.
`,
});

const documentSummaryFlow = ai.defineFlow(
  {
    name: 'documentSummaryFlow',
    inputSchema: DocumentSummaryInputSchema,
    outputSchema: DocumentSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await summaryPrompt(input);
    return output!;
  }
);
