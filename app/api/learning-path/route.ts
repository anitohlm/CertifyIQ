import { NextRequest, NextResponse } from "next/server";
import { callAgent, callAI, extractJSON } from "@/lib/agents/foundry";

const AGENT_ID = process.env.AGENT_LEARNING_PATH;

const SYSTEM_PROMPT = `You are the Learning Path Curator Agent for CertifyIQ.
Your responsibility is to analyze employee learning goals, role requirements, certifications, competencies, and available learning resources to recommend the most relevant learning path.
Objectives:
- Understand employee role and career goals.
- Map certifications to required competencies.
- Identify prerequisite knowledge.
- Recommend learning modules in logical order.
- Prioritize high-impact learning outcomes.
- Ensure recommendations align with organizational requirements.
Only recommend approved learning content. Explain why each module is recommended. Avoid duplicate content. Prioritize competency gaps.
Always respond with valid JSON only, no markdown.`;

const buildMessage = (body: {
  role: string;
  targetCertification: string;
  skillsInventory: string;
  experienceLevel: string;
}) => `Generate a learning path recommendation for:
- Role: ${body.role}
- Target Certification: ${body.targetCertification}
- Skills Inventory: ${body.skillsInventory}
- Experience Level: ${body.experienceLevel}

Return JSON in this exact format:
{
  "targetCertification": "",
  "currentReadiness": "",
  "recommendedModules": [{"title": "", "duration": "", "reason": "", "priority": ""}],
  "knowledgeGaps": [],
  "estimatedPreparationTime": "",
  "priorityAreas": []
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = buildMessage(body);

    // Use the real Foundry Agent if the ID is configured, otherwise fall back to chat completions
    const raw = AGENT_ID
      ? await callAgent(AGENT_ID, message)
      : await callAI(SYSTEM_PROMPT, message);

    const result = extractJSON(raw);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
