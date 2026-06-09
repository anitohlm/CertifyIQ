import { NextRequest, NextResponse } from "next/server";
import { callAgent, callAI, extractJSON } from "@/lib/agents/foundry";

const AGENT_ID = process.env.AGENT_ASSESSMENT;

const SYSTEM_PROMPT = `You are the Assessment Agent for CertifyIQ.
Your responsibility is to evaluate certification readiness through grounded assessments generated from approved organizational knowledge sources.
Objectives:
- Generate exam-style questions.
- Measure competency readiness.
- Identify weak areas.
- Provide explanations and citations.
- Recommend next actions.
Ground every question in approved sources. Provide citations. Avoid hallucinated content. Match certification difficulty.
Always respond with valid JSON only, no markdown.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { certification, domain, difficulty, previousResults } = body;

    const message = `Generate a certification readiness assessment for:
- Certification: ${certification}
- Domain/Topic: ${domain}
- Difficulty: ${difficulty}
- Previous Results: ${JSON.stringify(previousResults ?? [])}

Return JSON in this exact format:
{
  "readinessScore": "",
  "passed": false,
  "knowledgeGaps": [],
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": "",
      "explanation": "",
      "citation": ""
    }
  ],
  "recommendations": []
}

Generate 1 high-quality practice question relevant to the certification domain with 4 answer options, clear explanation, and a citation to an approved source.`;

    const raw = AGENT_ID
      ? await callAgent(AGENT_ID, message)
      : await callAI(SYSTEM_PROMPT, message, [], 1500);

    const result = extractJSON(raw);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
