
'use server';

/**
 * @fileOverview An AI flow for generating chart data and configuration from a dataset.
 * 
 * - generateChartData - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import {
    ChartGeneratorInput,
    ChartGeneratorInputSchema,
    ChartGeneratorOutput,
    ChartGeneratorOutputSchema
} from '@/lib/types';


export async function generateChartData(input: ChartGeneratorInput): Promise<ChartGeneratorOutput> {
  return chartGeneratorFlow(input);
}

const chartGeneratorPrompt = ai.definePrompt({
    name: 'chartGeneratorPrompt',
    input: { schema: ChartGeneratorInputSchema },
    output: { schema: ChartGeneratorOutputSchema },
    prompt: `You are a data visualization expert. Your task is to analyze a dataset and a user's prompt to generate a valid JSON structure for creating a chart.

**User's Request:**
"{{prompt}}"

**Desired Chart Type:** {{chartType}}

**Dataset (JSON format):**
---
{{data}}
---

**Instructions:**

1.  **Analyze the Data and Prompt:** Understand the user's goal. Identify the best columns from the dataset to use for the chart's axes and data series based on the prompt.

2.  **Generate Chart Data (`chartData`):**
    - Transform the raw data into a JSON array of objects suitable for a charting library like Recharts.
    - Each object in the array should represent a point or a bar on the chart.
    - Example for a bar chart of sales by month: \`[{"month": "Jan", "sales": 100}, {"month": "Feb", "sales": 150}]\`.

3.  **Generate Chart Configuration (`chartConfig`):**
    - Create a JSON object that specifies which keys from your generated \`chartData\` should be used for which chart property.
    - **x_axis_key**: The key to use for the x-axis (e.g., "month").
    - **y_axis_keys**: An array of keys to use for the y-axis values (e.g., ["sales"]). For pie charts, this would be the value key.
    - **label_key**: For pie charts, the key to use for the labels (e.g., "month").

4.  **Generate Analysis (`analysis`):**
    - Write a brief, one-paragraph summary explaining what the chart shows and pointing out any interesting insights or trends.

Return the final result in the specified JSON format. Ensure all generated JSON strings (\`chartData\` and \`chartConfig\`) are valid.
`,
});

const chartGeneratorFlow = ai.defineFlow(
  {
    name: 'chartGeneratorFlow',
    inputSchema: ChartGeneratorInputSchema,
    outputSchema: ChartGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await chartGeneratorPrompt(input);
    return output!;
  }
);
