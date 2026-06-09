import { NextRequest, NextResponse } from "next/server";
import { callAgent, callAI } from "@/lib/agents/foundry";

const AGENT_ID = process.env.AGENT_COACH;

const EMPLOYEE_SYSTEM = `You are CertifyIQ's AI coaching assistant for individual learners.
You help employees plan their certification journey, answer study questions, and stay motivated.
You have access to the learner's profile: Alex Johnson, Cloud Operations Engineer, targeting AZ-104 Azure Administrator certification, currently at 82% readiness, 14-day study streak, 91% plan adherence.
Be concise, specific, and encouraging. Reference their actual progress data when relevant.
Keep responses under 3 sentences. Do not use bullet points or headers — respond conversationally.`;

const MANAGER_SYSTEM = `You are CertifyIQ's AI workforce intelligence assistant for managers and leaders.
You help managers understand team readiness, certification risks, and skill gaps.
You have access to: team readiness 76%, compliance coverage 94%, 12 employees at risk, 4 teams (Cloud Ops 88%, Customer Success 71%, Security Analysts 93%, Field Engineering 58%).
Be concise and data-driven. Reference team metrics when relevant.
Keep responses under 3 sentences. Do not use bullet points or headers — respond conversationally.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, view } = await req.json();

    let response: string;
    if (AGENT_ID) {
      // Build a context-rich message for the agent that includes conversation history
      const historyContext =
        history && history.length > 0
          ? `\n\nConversation so far:\n${history.map((h: { role: string; content: string }) => `${h.role}: ${h.content}`).join("\n")}\n\nUser's latest message:`
          : "";
      const viewContext =
        view === "manager"
          ? "You are assisting a manager. " + MANAGER_SYSTEM
          : "You are assisting an individual learner. " + EMPLOYEE_SYSTEM;
      const fullMessage = `${viewContext}${historyContext} ${message}`;
      response = await callAgent(AGENT_ID, fullMessage);
    } else {
      const systemPrompt = view === "manager" ? MANAGER_SYSTEM : EMPLOYEE_SYSTEM;
      response = await callAI(systemPrompt, message, history ?? [], 400);
    }

    return NextResponse.json({ response });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
