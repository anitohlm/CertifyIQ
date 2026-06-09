const getInferenceEndpoint = () => {
  const ep = process.env.AZURE_FOUNDRY_ENDPOINT!;
  return ep.replace(/\/api\/projects\/[^/]+$/, "") + "/models";
};

const MODEL = () => process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4.1-mini";
const KEY = () => process.env.AZURE_FOUNDRY_API_KEY!;

export async function callAI(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
  maxTokens = 2000
): Promise<string> {
  const url = `${getInferenceEndpoint()}/chat/completions`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "api-key": KEY(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL(),
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Foundry AI error:", res.status, err);
    throw new Error(`Foundry ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0].message.content;
}

export function extractJSON<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {}

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) {
    try {
      return JSON.parse(fence[1]) as T;
    } catch {}
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    let json = text.slice(start, end + 1);
    try {
      return JSON.parse(json) as T;
    } catch {
      json = json.replace(/,(\s*[}\]])/g, "$1");
      json = json.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
      try {
        return JSON.parse(json) as T;
      } catch {}
    }
  }

  throw new Error(`Could not extract JSON from response: ${text.slice(0, 300)}`);
}
