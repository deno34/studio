
'use server';

/**
 * @fileOverview An AI flow for parsing contract documents.
 * 
 * - parseContract - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { ContractParserInput, ContractParserInputSchema, ContractParserOutput, ContractParserOutputSchema } from '@/lib/types';


export async function parseContract(input: ContractParserInput): Promise<ContractParserOutput> {
  return contractParserFlow(input);
}

const contractParserPrompt = ai.definePrompt({
    name: 'contractParserPrompt',
    input: { schema: ContractParserInputSchema },
    output: { schema: ContractParserOutputSchema },
    prompt: `You are an expert legal assistant specializing in contract analysis.
Your task is to analyze the provided contract text and extract key information in a structured format.

**Contract Text:**
---
{{contractText}}
---

**Analysis Instructions:**
1.  **Identify Parties:** Extract the names of all parties involved in the agreement.
2.  **Determine Key Dates:** Find the 'Effective Date' and the 'Termination Date' of the contract.
3.  **Identify Jurisdiction:** Determine the governing law or jurisdiction mentioned in the contract.
4.  **Extract Key Obligations:** For each party, summarize their most important obligations and responsibilities under the contract. List at least one key obligation per party if possible.
5.  **Validate Document:** Determine if the document appears to be a legally binding contract. If it's something else (e.g., an invoice, a letter), set the 'isContract' flag to false.

Return the result in the specified JSON format. If a piece of information cannot be found, omit the field or return an empty array.
`,
});

const contractParserFlow = ai.defineFlow(
  {
    name: 'contractParserFlow',
    inputSchema: ContractParserInputSchema,
    outputSchema: ContractParserOutputSchema,
  },
  async (input) => {
    const { output } = await contractParserPrompt(input);
    return output!;
  }
);
