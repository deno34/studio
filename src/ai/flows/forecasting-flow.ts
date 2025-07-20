
'use server';

/**
 * @fileOverview An AI flow for generating time-series forecasts.
 * 
 * - generateForecast - An exported wrapper function to call the flow.
 */

import { ai } from '@/ai/genkit';
import { ForecastingInput, ForecastingInputSchema, ForecastingOutput, ForecastingOutputSchema } from '@/lib/types';


export async function generateForecast(input: ForecastingInput): Promise<ForecastingOutput> {
  return forecastingFlow(input);
}

const forecastingPrompt = ai.definePrompt({
    name: 'forecastingPrompt',
    input: { schema: ForecastingInputSchema },
    output: { schema: ForecastingOutputSchema },
    prompt: `You are an expert time-series analyst and data scientist.
Your task is to analyze the provided historical data and generate a forecast for a specific metric.

**Dataset (JSON format):**
---
{{jsonData}}
---

**Forecasting Instructions:**
1.  **Metric to Forecast:** \`{{metric}}\`
2.  **Forecast Period:** Generate predictions for the next \`{{period}}\` time periods (e.g., if the data is monthly, forecast the next {{period}} months).
3.  **Analyze Trends:**
    - Identify the overall trend (e.g., upward, downward, stable).
    - Note any seasonality or cyclical patterns you observe.
    - Point out any significant anomalies or outliers in the historical data.
4.  **Generate Forecast Data:**
    - Return a JSON array that includes all the original historical data points.
    - For future dates, add the forecasted values under a 'forecast' key.
    - Ensure the dates for the forecast continue the sequence from the historical data (e.g., if the last historical date is '2023-12', the first forecast date should be '2024-01').
5.  **Provide a Narrative Analysis:** Write a concise, one-paragraph summary of your findings. Explain the reasoning behind your forecast, mentioning the trends and patterns you identified.

Return the result in the specified JSON format, with the full historical and forecasted data in the 'forecast' array and your text summary in the 'analysis' field.
`,
});

const forecastingFlow = ai.defineFlow(
  {
    name: 'forecastingFlow',
    inputSchema: ForecastingInputSchema,
    outputSchema: ForecastingOutputSchema,
  },
  async (input) => {
    const { output } = await forecastingPrompt(input);
    return output!;
  }
);
