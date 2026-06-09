/**
 * Azure AI Foundry — Chat Completions + Named Agents
 *
 * Agents are called via the OpenAI Responses API using the agent's ID,
 * NOT via the threads/runs REST API (which has version compatibility issues).
 *
 * Pattern (same as Linkedout project):
 *   const client = new AzureOpenAI({ endpoint: projectEndpoint, apiKey, apiVersion })
 *   client.responses.create({ input: [...], extra_body: { agent_id } })
 */
import { AzureOpenAI } from "openai";

function getProjectEndpoint() {
  return process.env.AZURE_FOUNDRY_ENDPOINT!.replace(/\/$/, "");
}

function getInferenceEndpoint() {
  const base = process.env.AZURE_FOUNDRY_ENDPOINT!;
  const resource = base.split("/api/projects")[0];
  return `${resource}/models`;
}

function getServiceRoot() {
  return process.env.AZURE_FOUNDRY_ENDPOINT!
    .split("/api/projects")[0]
    .replace(/\/$/, "");
}

function getOpenAIClient() {
  // Use service root (not project endpoint) so SDK hits /openai/responses correctly
  return new AzureOpenAI({
    endpoint: getServiceRoot(),
    apiKey: process.env.AZURE_FOUNDRY_API_KEY!,
    apiVersion: "2025-04-01-preview",
  });
}

const MODEL = () => process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4.1-mini";
const KEY = () => process.env.AZURE_FOUNDRY_API_KEY!;

/**
 * Call an Azure AI Foundry Agent by ID via the Responses API.
 */
export async function callAgent(
  agentId: string,
  userMessage: string
): Promise<string> {
  const client = getOpenAIClient();

  try {
    const response = await (client.responses as any).create({
      model: agentId,
      input: [{ role: "user", content: userMessage }],
    });

    console.log("[callAgent] raw response keys:", Object.keys(response));

    const text: string =
      response.output_text ??
      response.output?.[0]?.content?.[0]?.text ??
      "";

    if (!text) throw new Error("Agent returned no text content");
    return text;
  } catch (err: any) {
    console.error("[callAgent] ERROR:", err?.status, err?.message, JSON.stringify(err?.error ?? err));
    throw err;
  }
}

// ─── Chat Completions (fallback for routes without an agent ID) ───────────────

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

// ─── JSON extraction helper ───────────────────────────────────────────────────

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
