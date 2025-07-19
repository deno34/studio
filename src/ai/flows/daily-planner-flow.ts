
'use server';

/**
 * @fileOverview An AI flow for generating a daily plan.
 * 
 * - generateDailyPlan - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { DailyPlannerInput, DailyPlannerInputSchema, DailyPlannerOutput, DailyPlannerOutputSchema } from '@/lib/types';


export async function generateDailyPlan(input: DailyPlannerInput): Promise<DailyPlannerOutput> {
  return dailyPlannerFlow(input);
}

const plannerPrompt = ai.definePrompt({
    name: 'dailyPlannerPrompt',
    input: { schema: DailyPlannerInputSchema },
    output: { schema: DailyPlannerOutputSchema },
    prompt: `You are an expert executive assistant tasked with creating a productive and balanced daily schedule.
Analyze the provided list of tasks and meetings for the day and generate a clear, prioritized plan in Markdown format.

**Your Task:**
1.  **Prioritize:** Determine the most important tasks and meetings.
2.  **Time Blocking:** Create a suggested time-blocked schedule from 9 AM to 5 PM.
3.  **Include Breaks:** Intelligently schedule a lunch break and at least two short 15-minute breaks.
4.  **Summarize:** Start with a brief, encouraging summary of the day's focus.
5.  **Handle Empty States:** If no tasks are provided, generate a motivational message about planning a productive day.

**Data Provided:**
- A list of tasks and meetings with their titles and types.

**Example Markdown Output:**

\`\`\`markdown
# Your Daily Plan for Success

Today's focus is on finalizing the quarterly reports and preparing for the client presentation. It's a busy day, but by staying focused, you'll make great progress. Let's get started!

---

### Morning (9:00 AM - 12:00 PM)
- **9:00 AM - 9:45 AM:** **(High Priority)** Finalize Q3 Report
- **9:45 AM - 10:00 AM:** Quick Break - Stretch & grab coffee
- **10:00 AM - 11:00 AM:** **(Meeting)** Team Sync
- **11:00 AM - 12:00 PM:** Prepare slides for client presentation

### Lunch (12:00 PM - 1:00 PM)
- Step away from your desk and recharge.

### Afternoon (1:00 PM - 5:00 PM)
- **1:00 PM - 2:30 PM:** Continue work on client presentation
- **2:30 PM - 2:45 PM:** Short Break
- **2:45 PM - 4:00 PM:** Review and respond to important emails
- **4:00 PM - 5:00 PM:** Plan for tomorrow
---
\`\`\`

**Here is the list of tasks and meetings for today:**

{{#if tasks}}
  {{#each tasks}}
  - **{{title}}** (Type: {{type}})
  {{/each}}
{{else}}
  No scheduled tasks or meetings.
{{/if}}

Please generate the full daily plan in Markdown.
`,
});

const dailyPlannerFlow = ai.defineFlow(
  {
    name: 'dailyPlannerFlow',
    inputSchema: DailyPlannerInputSchema,
    outputSchema: DailyPlannerOutputSchema,
  },
  async (input) => {
    const { output } = await plannerPrompt(input);
    return output!;
  }
);
