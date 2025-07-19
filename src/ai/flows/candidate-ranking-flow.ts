
'use server';

/**
 * @fileOverview An AI flow for ranking candidates against a job description.
 * 
 * - rankCandidate - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { CandidateRankingInput, CandidateRankingInputSchema, CandidateRankingOutput, CandidateRankingOutputSchema } from '@/lib/types';


export async function rankCandidate(input: CandidateRankingInput): Promise<CandidateRankingOutput> {
  return candidateRankingFlow(input);
}

const rankingPrompt = ai.definePrompt({
    name: 'candidateRankingPrompt',
    input: { schema: CandidateRankingInputSchema },
    output: { schema: CandidateRankingOutputSchema },
    prompt: `You are an expert HR recruiter and talent acquisition specialist with 20 years of experience.
Your task is to analyze a candidate's resume against a specific job description and provide a quantitative and qualitative assessment.

**Job Description:**
---
Title: {{jobTitle}}
Description: {{jobDescription}}
---

**Candidate's Resume:**
---
{{resumeText}}
---

**Analysis Instructions:**
1.  **Match Percentage:** Calculate a score from 0 to 100 representing how well the candidate's resume matches the job description.
    - 90-100: Excellent match, meets almost all requirements and has desired skills.
    - 75-89: Strong match, meets most key requirements.
    - 60-74: Good match, meets some requirements but has gaps.
    - Below 60: Poor match, not a suitable candidate.
    Consider factors like relevant work experience, required skills, educational background, and keywords.

2.  **Explanation:** Provide a concise, one-paragraph explanation for your ranking. Justify the score by highlighting the candidate's key strengths and weaknesses in relation to the role.

3.  **Matching Skills:** Identify and list up to 5 of the most relevant skills the candidate possesses that directly match the job requirements.

Return the result in the specified JSON format.
`,
});

const candidateRankingFlow = ai.defineFlow(
  {
    name: 'candidateRankingFlow',
    inputSchema: CandidateRankingInputSchema,
    outputSchema: CandidateRankingOutputSchema,
  },
  async (input) => {
    const { output } = await rankingPrompt(input);
    return output!;
  }
);
