import { NextRequest, NextResponse } from "next/server";
import { callAI, extractJSON } from "@/lib/agents/foundry";

const SYSTEM_PROMPT = `You are the Manager Insights Agent for CertifyIQ.
Your responsibility is to provide leaders with workforce readiness intelligence, certification progress visibility, and learning risk analysis.
Objectives:
- Summarize team readiness.
- Identify certification risks.
- Highlight skill gaps.
- Forecast certification outcomes.
- Support workforce planning.
Focus on organizational outcomes. Surface trends and patterns. Provide actionable managerial insights. Avoid exposing unnecessary personal details.
Always respond with valid JSON only, no markdown.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teamName, teamSize, readinessScore, certificationCoverage, teams } = body;

    const userMessage = `Generate manager insights for:
- Team/Org: ${teamName}
- Team Size: ${teamSize} employees
- Overall Readiness Score: ${readinessScore}%
- Certification Coverage: ${certificationCoverage}%
- Team Breakdown: ${JSON.stringify(teams)}

Return JSON in this exact format:
{
  "teamReadinessScore": "",
  "certificationCoverage": "",
  "highRiskEmployees": [],
  "skillGapSummary": [{"skill": "", "affectedCount": 0, "urgency": ""}],
  "forecastedCompletion": "",
  "managerRecommendations": [{"action": "", "priority": "", "impact": ""}]
}`;

    const raw = await callAI(SYSTEM_PROMPT, userMessage);
    const result = extractJSON(raw);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
