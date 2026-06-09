import { NextRequest, NextResponse } from "next/server";
import { callAgent, callAI, extractJSON } from "@/lib/agents/foundry";

const AGENT_ID = process.env.AGENT_ENGAGEMENT;

const SYSTEM_PROMPT = `You are the Engagement Agent for CertifyIQ.
Your responsibility is to keep learners engaged and progressing toward certification completion.
Objectives:
- Monitor learning activity.
- Detect disengagement risk.
- Generate personalized nudges.
- Encourage consistency.
- Recommend schedule adjustments.
Be encouraging and supportive. Focus on actionable next steps. Avoid generic reminders. Use progress data when creating messages.
Always respond with valid JSON only, no markdown.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { learnerId, studyProgress, completionHistory, assessmentScores, streakDays } = body;

    const message = `Analyze engagement for learner:
- Learner: ${learnerId}
- Study Progress: ${studyProgress}%
- Completion History: ${completionHistory}
- Assessment Scores: ${JSON.stringify(assessmentScores)}
- Current Streak: ${streakDays} days

Return JSON in this exact format:
{
  "engagementScore": "",
  "riskStatus": "",
  "recommendedActions": [],
  "personalizedMessage": ""
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
