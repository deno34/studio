
'use server';

/**
 * @fileOverview An AI flow for summarizing interview transcripts.
 * 
 * - summarizeInterview - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { InterviewSummaryInputSchema, InterviewSummaryInput, InterviewSummaryOutputSchema, InterviewSummaryOutput } from '@/lib/types';


export async function summarizeInterview(input: InterviewSummaryInput): Promise<InterviewSummaryOutput> {
  return interviewSummaryFlow(input);
}

const summaryPrompt = ai.definePrompt({
    name: 'interviewSummaryPrompt',
    input: { schema: InterviewSummaryInputSchema },
    output: { schema: InterviewSummaryOutputSchema },
    prompt: `You are an expert HR manager and talent evaluator with exceptional analytical skills.
Your task is to analyze the provided interview transcript and generate a concise, insightful summary.

**Interview Transcript:**
---
{{transcript}}
---

**Analysis Instructions:**
1.  **Key Points:** Identify and list the 3-5 most important takeaways from the conversation. These could be about the candidate's experience, skills, motivation, or red flags.
2.  **Strengths:** Based on the transcript, list the candidate's top 3 strengths as they relate to a potential role.
3.  **Weaknesses:** List up to 3 potential weaknesses or areas for concern that emerged during the interview. Be objective and base your points strictly on the provided text.
4.  **Recommendation Score:** Provide a score from 1 to 10 indicating your overall recommendation for the candidate based on this interview. (1=Very Poor, 10=Exceptional).
5.  **Recommendation Justification:** Write a brief, one-sentence justification for your recommendation score.

Return the result in the specified JSON format.
`,
});

const interviewSummaryFlow = ai.defineFlow(
  {
    name: 'interviewSummaryFlow',
    inputSchema: InterviewSummaryInputSchema,
    outputSchema: InterviewSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await summaryPrompt(input);
    return output!;
  }
);
