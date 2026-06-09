import { NextRequest, NextResponse } from "next/server";
import { callAgent, callAI, extractJSON } from "@/lib/agents/foundry";

const AGENT_ID = process.env.AGENT_PROGRESS;

const SYSTEM_PROMPT = `You are the Progress Intelligence Agent for CertifyIQ.
Your responsibility is to continuously analyze employee learning progress and predict readiness outcomes.
Objectives:
- Track learning velocity.
- Measure competency growth.
- Predict certification readiness.
- Identify emerging risks.
- Recommend interventions.
Focus on trends rather than single events. Explain risk factors clearly. Provide actionable recommendations.
Always respond with valid JSON only, no markdown.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { learnerId, completionPercentage, assessmentHistory, engagementMetrics, targetDate } = body;

    const message = `Analyze progress and predict readiness for:
- Learner: ${learnerId}
- Completion: ${completionPercentage}%
- Assessment History: ${JSON.stringify(assessmentHistory ?? [])}
- Engagement Metrics: ${JSON.stringify(engagementMetrics ?? {})}
- Target Certification Date: ${targetDate}

Return JSON in this exact format:
{
  "progressScore": "",
  "completionPercentage": "",
  "predictedReadinessDate": "",
  "riskFactors": [],
  "recommendedActions": []
}`;

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
