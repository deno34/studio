
export async function callMistral(prompt: string): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not set in environment variables.");
  }

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-tiny", // Using a cost-effective model for starters
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Mistral API Error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Mistral API Error: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
