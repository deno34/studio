
'use server';

/**
 * @fileOverview An AI flow for generating lead follow-up suggestions.
 * 
 * - generateFollowupSuggestions - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { LeadFollowupSuggestionInputSchema, LeadFollowupSuggestionInput, LeadFollowupSuggestionOutputSchema, LeadFollowupSuggestionOutput } from '@/lib/types';


export async function generateFollowupSuggestions(input: LeadFollowupSuggestionInput): Promise<LeadFollowupSuggestionOutput> {
  return leadFollowupFlow(input);
}

const followupPrompt = ai.definePrompt({
    name: 'leadFollowupPrompt',
    input: { schema: LeadFollowupSuggestionInputSchema },
    output: { schema: LeadFollowupSuggestionOutputSchema },
    prompt: `You are an expert Sales Development Representative (SDR) and sales manager.
Your task is to analyze a list of clients from a CRM and recommend which ones to follow up with today.

**Analysis Instructions:**
1.  **Prioritize Actionable Leads:** Focus on clients with statuses like 'Lead', 'Contacted', or 'Proposal'. Ignore 'Closed (Won)' or 'Closed (Lost)'.
2.  **Consider Timing:** Prioritize leads that haven't been engaged with recently. A lead from a week ago is more important than one from yesterday. Today's date is {{currentDate}}.
3.  **Provide Justification:** For each suggested follow-up, provide a brief, actionable reason. For example: "Initial lead, good time for a first touchpoint." or "Follow up on the proposal sent last week."
4.  **Limit Suggestions:** Provide a maximum of 3-5 of the highest priority follow-ups. Do not suggest following up with every single client.
5.  **Handle No Suggestions:** If no clients require a follow-up today, return an empty array for the 'suggestions' field.

**Data Provided:**
A list of clients with their name, status, and creation date.

**Here is the client data:**
{{#each clients}}
- Name: {{name}}, Status: {{status}}, Created At: {{createdAt}}
{{/each}}

Generate a list of follow-up suggestions in the specified JSON format.
`,
});

const leadFollowupFlow = ai.defineFlow(
  {
    name: 'leadFollowupFlow',
    inputSchema: LeadFollowupSuggestionInputSchema,
    outputSchema: LeadFollowupSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await followupPrompt({
        ...input,
        currentDate: new Date().toISOString().split('T')[0],
    });
    return output!;
  }
);
