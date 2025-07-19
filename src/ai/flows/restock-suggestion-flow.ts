
'use server';

/**
 * @fileOverview An AI flow for generating inventory restock suggestions.
 * 
 * - generateRestockSuggestions - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { RestockSuggestionInput, RestockSuggestionInputSchema, RestockSuggestionOutput, RestockSuggestionOutputSchema } from '@/lib/types';


export async function generateRestockSuggestions(input: RestockSuggestionInput): Promise<RestockSuggestionOutput> {
  return restockSuggestionFlow(input);
}

const restockPrompt = ai.definePrompt({
    name: 'restockSuggestionPrompt',
    input: { schema: RestockSuggestionInputSchema },
    output: { schema: RestockSuggestionOutputSchema },
    prompt: `You are an expert inventory and supply chain manager.
Your task is to analyze the provided list of inventory items and generate actionable restock suggestions.

**Analysis Instructions:**
1.  **Identify Low Stock:** An item needs restocking if its 'stockLevel' is less than or equal to its 'reorderLevel'.
2.  **Calculate Reorder Quantity:** For each item that needs restocking, suggest a reorder quantity. A good rule of thumb is to suggest reordering enough to bring the stock level to double the reorder level. For example, if stock is 15 and reorder level is 20, the deficit is 5. To reach double the reorder level (40), you need to order 25 units.
3.  **Provide Justification:** Briefly explain why the item needs to be restocked (e.g., "Stock level is below reorder point.").
4.  **Handle No Suggestions:** If no items require restocking, return an empty array for the 'suggestions' field.

**Data Provided:**
A list of inventory items with their name, SKU, stockLevel, and reorderLevel.

**Here is the inventory data:**
{{#each inventoryItems}}
- Name: {{name}}, SKU: {{sku}}, Stock: {{stockLevel}}, Reorder at: {{reorderLevel}}
{{/each}}

Generate a list of restock suggestions in the specified JSON format.
`,
});

const restockSuggestionFlow = ai.defineFlow(
  {
    name: 'restockSuggestionFlow',
    inputSchema: RestockSuggestionInputSchema,
    outputSchema: RestockSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await restockPrompt(input);
    return output!;
  }
);
