
'use server';

/**
 * @fileOverview An AI flow for categorizing uploaded documents.
 * 
 * - categorizeDocument - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const DocumentCategorizerInputSchema = z.object({
  fileName: z.string().describe("The original name of the file."),
  fileContent: z.string().describe("The extracted text content from the file."),
});
export type DocumentCategorizerInput = z.infer<typeof DocumentCategorizerInputSchema>;

export const DocumentCategorizerOutputSchema = z.object({
  category: z.string().describe("The single most likely category for the document."),
});
export type DocumentCategorizerOutput = z.infer<typeof DocumentCategorizerOutputSchema>;


export async function categorizeDocument(input: DocumentCategorizerInput): Promise<DocumentCategorizerOutput> {
  return documentCategorizerFlow(input);
}

const categorizerPrompt = ai.definePrompt({
    name: 'documentCategorizerPrompt',
    input: { schema: DocumentCategorizerInputSchema },
    output: { schema: DocumentCategorizerOutputSchema },
    prompt: `You are an expert document classifier for a business operating system.
Your task is to analyze the file content and name to determine the most appropriate category for the document.

**Available Categories:**
- Invoice
- Receipt
- Contract
- Resume
- Financial Report
- Marketing Material
- Legal Document
- General Document

Analyze the content below and choose the single best category from the list above.

**File Name:** {{fileName}}

---

**File Content:**
{{fileContent}}

---

Return only the determined category in the specified JSON format.
`,
});

const documentCategorizerFlow = ai.defineFlow(
  {
    name: 'documentCategorizerFlow',
    inputSchema: DocumentCategorizerInputSchema,
    outputSchema: DocumentCategorizerOutputSchema,
  },
  async (input) => {
    // Truncate content to avoid exceeding token limits
    const maxChars = 20000;
    if (input.fileContent.length > maxChars) {
      input.fileContent = input.fileContent.substring(0, maxChars);
    }
    
    const { output } = await categorizerPrompt(input);
    return output!;
  }
);
