import { NextRequest, NextResponse } from "next/server";
import { callAI, extractJSON } from "@/lib/agents/foundry";

const SYSTEM_PROMPT = `You are the Study Plan Generator Agent for CertifyIQ.
Your responsibility is to transform learning recommendations into realistic study schedules that balance learning objectives with employee workload and availability.
Objectives:
- Create practical study plans.
- Respect employee workload constraints.
- Estimate study effort accurately.
- Adapt schedules when conditions change.
- Optimize for completion likelihood.
Prevent burnout. Avoid scheduling during busy work periods. Maintain consistent study cadence. Prioritize critical topics.
Always respond with valid JSON only, no markdown.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { learningPath, targetExamDate, weeklyAvailableHours, workloadLevel } = body;

    const userMessage = `Create a study plan for:
- Learning Path Modules: ${JSON.stringify(learningPath?.recommendedModules ?? learningPath)}
- Target Exam Date: ${targetExamDate}
- Weekly Available Hours: ${weeklyAvailableHours}
- Workload Level: ${workloadLevel}

Return JSON in this exact format:
{
  "studyPlan": [{"week": "", "activities": [], "hours": "", "focus": ""}],
  "totalDuration": "",
  "riskLevel": "",
  "recommendedAdjustments": []
}`;

    const raw = await callAI(SYSTEM_PROMPT, userMessage);
    const result = extractJSON(raw);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
