/**
 * CertifyIQ Orchestrator API Route
 *
 * POST /api/orchestrator
 *
 * Coordinates existing specialized agents without generating content itself.
 * Steps:
 *   1. Detect workflow from user request + view
 *   2. Run each agent in the workflow sequence
 *   3. Pass prior agent outputs into subsequent agents (shared context)
 *   4. Synthesize a unified summary using callAI
 *   5. Return full OrchestratorOutput
 */

import { NextRequest, NextResponse } from "next/server";
import { callAgent, callAI } from "@/lib/agents/foundry";
import {
  detectWorkflow,
  buildAgentPayload,
  WORKFLOWS,
  type AgentName,
  type WorkflowType,
  type OrchestratorContext,
  type OrchestratorOutput,
  type OrchestratorSummary,
  type UserProfile,
  type TeamProfile,
} from "@/lib/agents/orchestrator";

// The optional Azure AI Foundry Orchestrator agent (for final synthesis)
const ORCHESTRATOR_AGENT_ID = process.env.AGENT_ORCHESTRATOR;

// ─── Internal agent callers ───────────────────────────────────────────────────

const AGENT_IDS: Partial<Record<AgentName, string | undefined>> = {
  "learning-path":    process.env.AGENT_LEARNING_PATH,
  "study-plan":       process.env.AGENT_STUDY_PLAN,
  "work-iq":          process.env.AGENT_WORK_IQ,
  "assessment":       process.env.AGENT_ASSESSMENT,
  "progress":         process.env.AGENT_PROGRESS,
  "engagement":       process.env.AGENT_ENGAGEMENT,
  "coach":            process.env.AGENT_COACH,
  "manager-insights": process.env.AGENT_MANAGER_INSIGHTS,
};

/**
 * Calls a single sub-agent by its name. Mirrors the logic in each individual
 * API route but runs inline so the orchestrator can pass shared context.
 */
async function invokeAgent(
  agent: AgentName,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const agentId = AGENT_IDS[agent];

  if (agentId) {
    // Use the Foundry agent directly
    const raw = await callAgent(agentId, JSON.stringify(payload));
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return { raw };
    }
  }

  // ── Fallback: call each agent's own Next.js API route so we reuse their
  //    system prompts and JSON extraction logic without duplicating them.
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3002";
  const routeMap: Record<AgentName, string> = {
    "learning-path":    "/api/learning-path",
    "study-plan":       "/api/study-plan",
    "work-iq":          "/api/work-iq",
    "assessment":       "/api/assessment",
    "progress":         "/api/progress",
    "engagement":       "/api/engagement",
    "coach":            "/api/coach",
    "manager-insights": "/api/manager-insights",
  };

  const res = await fetch(`${baseUrl}${routeMap[agent]}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${agent} agent returned ${res.status}: ${err}`);
  }

  return res.json() as Promise<Record<string, unknown>>;
}

// ─── Synthesis ────────────────────────────────────────────────────────────────

const SYNTHESIS_SYSTEM = `You are the CertifyIQ Orchestrator. You have collected outputs from multiple specialized AI agents.
Your task is to synthesize their findings into a unified summary.
Do not invent new information — only reference what the agents reported.
Always attribute findings to the agent that produced them.
Always respond with valid JSON only, no markdown.`;

async function synthesizeSummary(ctx: OrchestratorContext): Promise<OrchestratorSummary> {
  const agentSummaries = Object.entries(ctx.findings)
    .map(([agent, data]) => `${agent} Agent findings: ${JSON.stringify(data).slice(0, 400)}`)
    .join("\n");

  const prompt = `User objective: "${ctx.userRequest}"
Workflow: ${ctx.workflow}
View: ${ctx.view}

Agent outputs:
${agentSummaries}

Errors (if any):
${JSON.stringify(ctx.errors)}

Synthesize the above into this exact JSON format:
{
  "keyFindings": ["<finding attributed to specific agent>"],
  "recommendedActions": ["<specific actionable step>"],
  "risksOrBlockers": ["<risk or blocker>"],
  "nextBestStep": "<single most important next action>",
  "conflictNotes": "<if agents disagreed, explain resolution; otherwise omit or empty string>"
}`;

  let raw: string;
  if (ORCHESTRATOR_AGENT_ID) {
    raw = await callAgent(ORCHESTRATOR_AGENT_ID, prompt);
  } else {
    raw = await callAI(SYNTHESIS_SYSTEM, prompt, [], 800);
  }

  try {
    // Strip JSON fences if present
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    return JSON.parse(fenced ? fenced[1] : raw) as OrchestratorSummary;
  } catch {
    // Graceful degradation: extract key pieces manually
    return {
      keyFindings: ctx.agentsConsulted.map(a => `${a}: ${JSON.stringify(ctx.findings[a as keyof typeof ctx.findings]).slice(0, 100)}`),
      recommendedActions: ["Review the detailed agent findings above"],
      risksOrBlockers: Object.entries(ctx.errors).map(([a, e]) => `${a}: ${e}`),
      nextBestStep: "Review the full agent output details",
    };
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const startedAt = Date.now();

  try {
    const body = await req.json() as {
      userRequest: string;
      view: "employee" | "manager";
      user?: UserProfile;
      team?: TeamProfile;
      workflowOverride?: string;
    };

    const { userRequest, view, user, team } = body;

    if (!userRequest || !view) {
      return NextResponse.json({ error: "userRequest and view are required" }, { status: 400 });
    }

    const workflow: WorkflowType = (body.workflowOverride as WorkflowType | undefined) ?? detectWorkflow(userRequest, view);
    const workflowDef = WORKFLOWS[workflow];

    // Build shared context object
    const ctx: OrchestratorContext = {
      requestId: `orch-${Date.now()}`,
      userRequest,
      view,
      workflow,
      user,
      team,
      agentsConsulted: [],
      findings: {},
      errors: {},
      startedAt,
    };

    console.log(`[Orchestrator] workflow=${workflow} steps=${workflowDef.steps.join(" → ")}`);

    // ── Sequential agent execution with context passing ────────────────────
    for (const agentName of workflowDef.steps) {
      try {
        console.log(`[Orchestrator] → invoking ${agentName}`);
        const payload = buildAgentPayload(agentName, ctx);
        const result = await invokeAgent(agentName, payload);

        // Special case: coach returns { response: string }
        if (agentName === "coach") {
          ctx.findings.coach = result as { response: string };
        } else {
          (ctx.findings as Record<string, unknown>)[agentName.replace("-", "")] = result;
          // Also store under hyphenated key so buildAgentPayload can access it
          (ctx.findings as Record<string, unknown>)[agentName] = result;
        }

        ctx.agentsConsulted.push(agentName);
        console.log(`[Orchestrator] ✓ ${agentName} done`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[Orchestrator] ✗ ${agentName} failed: ${msg}`);
        (ctx.errors as Record<string, string>)[agentName] = msg;
        // Continue with remaining agents — partial results are valuable
      }
    }

    // ── Synthesize final summary ───────────────────────────────────────────
    const summary = await synthesizeSummary(ctx);

    const output: OrchestratorOutput = {
      requestId: ctx.requestId,
      workflow,
      workflowLabel: workflowDef.label,
      userObjective: userRequest,
      agentsConsulted: ctx.agentsConsulted,
      findings: ctx.findings,
      errors: ctx.errors,
      summary,
      durationMs: Date.now() - startedAt,
    };

    return NextResponse.json(output);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Orchestrator] Fatal:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
