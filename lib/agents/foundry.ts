// ─── Base URLs ───────────────────────────────────────────────────────────────

/** Root of the Azure AI Foundry service, e.g. https://xxx.services.ai.azure.com */
const getServiceRoot = () =>
  process.env.AZURE_FOUNDRY_ENDPOINT!
    .replace(/\/api\/projects\/[^/]+\/?$/, "")
    .replace(/\/$/, "");

/** Base URL for the Agents REST API */
const agentsBase = () => `${getServiceRoot()}/agents/v1.0`;

/** Base URL for chat-completions (inference) */
const inferenceBase = () => `${getServiceRoot()}/models`;

const KEY = () => process.env.AZURE_FOUNDRY_API_KEY!;
const MODEL = () => process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4.1-mini";

// ─── Agents API (thread / run / poll) ────────────────────────────────────────

type RunStatus =
  | "queued"
  | "in_progress"
  | "requires_action"
  | "cancelling"
  | "cancelled"
  | "failed"
  | "completed"
  | "expired";

interface AgentRun {
  id: string;
  status: RunStatus;
  last_error?: { code: string; message: string };
}

interface ThreadMessage {
  role: "user" | "assistant";
  content: Array<{ type: string; text?: { value: string } }>;
}

async function agentFetch(path: string, options?: RequestInit) {
  const url = `${agentsBase()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "api-key": KEY(),
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Agents API ${res.status} at ${path}: ${text}`);
  }
  return res.json();
}

/**
 * Call an Azure AI Foundry Agent by ID.
 * Creates a thread, posts the user message, starts a run, polls until done,
 * and returns the assistant's reply as a string.
 */
export async function callAgent(
  agentId: string,
  userMessage: string,
  maxWaitMs = 60_000
): Promise<string> {
  // 1. Create thread
  const thread = await agentFetch("/threads", {
    method: "POST",
    body: JSON.stringify({}),
  });
  const threadId: string = thread.id;

  // 2. Post user message
  await agentFetch(`/threads/${threadId}/messages`, {
    method: "POST",
    body: JSON.stringify({ role: "user", content: userMessage }),
  });

  // 3. Start run
  const run: AgentRun = await agentFetch(`/threads/${threadId}/runs`, {
    method: "POST",
    body: JSON.stringify({ assistant_id: agentId }),
  });

  // 4. Poll until terminal state
  const terminalStates: RunStatus[] = ["completed", "failed", "cancelled", "expired"];
  const pollInterval = 1_500;
  const deadline = Date.now() + maxWaitMs;
  let currentRun = run;

  while (!terminalStates.includes(currentRun.status)) {
    if (Date.now() > deadline) throw new Error("Agent run timed out");
    await new Promise((r) => setTimeout(r, pollInterval));
    currentRun = await agentFetch(`/threads/${threadId}/runs/${run.id}`);
  }

  if (currentRun.status !== "completed") {
    throw new Error(
      `Agent run ${currentRun.status}: ${currentRun.last_error?.message ?? "unknown error"}`
    );
  }

  // 5. Fetch messages and return the latest assistant reply
  const msgs: { data: ThreadMessage[] } = await agentFetch(
    `/threads/${threadId}/messages`
  );

  const assistantMsg = msgs.data
    .filter((m) => m.role === "assistant")
    .flatMap((m) => m.content)
    .filter((c) => c.type === "text" && c.text?.value)
    .map((c) => c.text!.value)
    .join("\n");

  if (!assistantMsg) throw new Error("Agent returned no text content");
  return assistantMsg;
}

// ─── Chat Completions (fallback for agents without IDs yet) ──────────────────

export async function callAI(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
  maxTokens = 2000
): Promise<string> {
  const url = `${inferenceBase()}/chat/completions`;

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
