
'use server';

/**
 * @fileOverview An AI flow for generating document drafts.
 * 
 * - generateDocumentDraft - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { DocumentWriterInput, DocumentWriterInputSchema, DocumentWriterOutput, DocumentWriterOutputSchema } from '@/lib/types';


export async function generateDocumentDraft(input: DocumentWriterInput): Promise<DocumentWriterOutput> {
  return documentWriterFlow(input);
}

const writerPrompt = ai.definePrompt({
    name: 'documentWriterPrompt',
    input: { schema: DocumentWriterInputSchema },
    output: { schema: DocumentWriterOutputSchema },
    prompt: `You are an expert copywriter and professional business communicator.
Your task is to draft a professional document based on the user's specifications.

**Document Specifications:**
- **Type:** {{documentType}}
- **Purpose/Topic:** {{purpose}}
- **Target Audience:** {{audience}}
- **Desired Tone:** {{tone}}
- **Desired Length:** {{length}}
{{#if keywords}}
- **Keywords to include:** {{keywords}}
{{/if}}

**Instructions:**
- Write a clear, concise, and well-structured document that meets all the specifications provided above.
- Format the output as a clean Markdown string.
- If it's an email, include a subject line like: "**Subject:** Your Subject Here".
- Ensure the tone is appropriate for the specified audience.
- Adapt the length of the content based on the user's request (Short, Medium, or Long).

Generate the full document draft now.
`,
});

const documentWriterFlow = ai.defineFlow(
  {
    name: 'documentWriterFlow',
    inputSchema: DocumentWriterInputSchema,
    outputSchema: DocumentWriterOutputSchema,
  },
  async (input) => {
    const { output } = await writerPrompt(input);
    return output!;
  }
);
