'use server';

/**
 * @fileOverview An AI flow for generating follow-up emails to candidates.
 * 
 * - generateFollowUpEmail - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const FollowUpEmailInputSchema = z.object({
  candidateName: z.string().describe("The candidate's full name."),
  jobTitle: z.string().describe("The title of the job the candidate applied for."),
  tone: z.enum(['Positive', 'Negative', 'Hold']).describe("The desired tone for the email, which dictates the next steps."),
  companyName: z.string().describe("The name of the company."),
});
export type FollowUpEmailInput = z.infer<typeof FollowUpEmailInputSchema>;

export const FollowUpEmailOutputSchema = z.object({
  subject: z.string().describe("The generated subject line for the email."),
  body: z.string().describe("The generated body of the email in Markdown format."),
});
export type FollowUpEmailOutput = z.infer<typeof FollowUpEmailOutputSchema>;


export async function generateFollowUpEmail(input: FollowUpEmailInput): Promise<FollowUpEmailOutput> {
  return followUpEmailFlow(input);
}

const emailPrompt = ai.definePrompt({
    name: 'followUpEmailPrompt',
    input: { schema: FollowUpEmailInputSchema },
    output: { schema: FollowUpEmailOutputSchema },
    prompt: `You are an expert HR professional writing a follow-up email to a job candidate after their interview.
The email should be professional, courteous, and clear.

**Candidate Name:** {{candidateName}}
**Job Title:** {{jobTitle}}
**Company Name:** {{companyName}}
**Desired Tone / Next Step:** {{tone}}

**Instructions:**
- Write a subject line and a body for the email.
- The body should be in Markdown format.
- Tailor the content based on the specified tone:
  - **Positive:** Inform the candidate that you are moving forward with them to the next steps. Express enthusiasm.
  - **Negative:** Inform the candidate that you have decided not to move forward with their application at this time. Be gracious and encouraging for future opportunities.
  - **Hold:** Inform the candidate that the decision process is still ongoing and you will provide an update soon. Thank them for their patience.

- Do not include placeholders like "[Your Name]". Sign off simply as "The {{companyName}} Team".

Return the result in the specified JSON format.
`,
});

const followUpEmailFlow = ai.defineFlow(
  {
    name: 'followUpEmailFlow',
    inputSchema: FollowUpEmailInputSchema,
    outputSchema: FollowUpEmailOutputSchema,
  },
  async (input) => {
    const { output } = await emailPrompt(input);
    return output!;
  }
);
