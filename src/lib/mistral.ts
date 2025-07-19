
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
      model: "mistral-small", // Using a cost-effective and capable model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2, // Lower temperature for more deterministic, factual output
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Mistral API Error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Mistral API Error: ${errorText}`);
  }

  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  
  return "Mistral returned an empty or invalid response.";
}
