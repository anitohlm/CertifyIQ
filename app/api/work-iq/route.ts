import { NextRequest, NextResponse } from "next/server";
import { callAgent, callAI, extractJSON } from "@/lib/agents/foundry";

const AGENT_ID = process.env.AGENT_WORK_IQ;

const SYSTEM_PROMPT = `You are the Work IQ Agent for CertifyIQ.
Your responsibility is to analyze workplace activity signals and identify optimal learning opportunities while minimizing disruption to productivity.
Objectives:
- Analyze work patterns.
- Identify study windows.
- Detect workload conflicts.
- Improve learning plan success rates.
- Balance productivity and learning.
Prioritize employee wellbeing. Minimize scheduling conflicts. Recommend realistic study windows. Continuously adapt to changing work conditions.
Always respond with valid JSON only, no markdown.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studyPlan, calendarActivity, meetingLoad, focusTimeSlots } = body;

    const message = `Optimize study windows for:
- Study Plan: ${JSON.stringify(studyPlan)}
- Calendar Activity: ${calendarActivity}
- Meeting Load: ${meetingLoad}
- Available Focus Time Slots: ${JSON.stringify(focusTimeSlots)}

Return JSON in this exact format:
{
  "recommendedStudyWindows": [{"day": "", "time": "", "duration": "", "reason": ""}],
  "workloadRisk": "",
  "scheduleConflicts": [],
  "optimizationRecommendations": [],
  "predictedCompletionImpact": ""
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
