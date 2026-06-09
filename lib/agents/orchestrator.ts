/**
 * CertifyIQ Orchestrator
 *
 * Coordinates existing specialized agents. Does NOT generate content itself —
 * it routes, sequences, passes context, and aggregates.
 *
 * Workflows:
 *   certification-planning  → learning-path → study-plan → work-iq → coach
 *   readiness-evaluation    → assessment → progress → coach
 *   struggling-learner      → progress → engagement → coach
 *   manager-request         → manager-insights
 *   engagement-check        → engagement → coach
 *   general-coaching        → coach
 */

// ─── Shared Context Object ────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  targetCertification: string;
  skillsInventory: string;
  experienceLevel: string;
  completionPercentage: number;
  streakDays: number;
  assessmentScores: number[];
  targetDate: string;
}

export interface TeamProfile {
  teamName: string;
  teamSize: number;
  readinessScore: number;
  certificationCoverage: number;
  teams: { name: string; readiness: number }[];
}

export interface OrchestratorContext {
  requestId: string;
  userRequest: string;
  view: "employee" | "manager";
  workflow: WorkflowType;
  user?: UserProfile;
  team?: TeamProfile;
  agentsConsulted: AgentName[];
  findings: AgentFindings;
  errors: Partial<Record<AgentName, string>>;
  startedAt: number;
}

export interface AgentFindings {
  learningPath?: Record<string, unknown>;
  studyPlan?: Record<string, unknown>;
  workIQ?: Record<string, unknown>;
  assessment?: Record<string, unknown>;
  progress?: Record<string, unknown>;
  engagement?: Record<string, unknown>;
  coach?: { response: string };
  managerInsights?: Record<string, unknown>;
}

export type AgentName =
  | "learning-path"
  | "study-plan"
  | "work-iq"
  | "assessment"
  | "progress"
  | "engagement"
  | "coach"
  | "manager-insights";

export type WorkflowType =
  | "certification-planning"
  | "readiness-evaluation"
  | "struggling-learner"
  | "manager-request"
  | "engagement-check"
  | "general-coaching"
  | "unknown";

// ─── Intent Routing ───────────────────────────────────────────────────────────

interface RoutingRule {
  keywords: string[];
  workflow: WorkflowType;
  priority: number;
}

const ROUTING_RULES: RoutingRule[] = [
  {
    keywords: ["team", "manager", "workforce", "employees", "staff", "org", "department", "headcount", "report"],
    workflow: "manager-request",
    priority: 10,
  },
  {
    keywords: ["struggling", "behind", "stuck", "unmotivated", "disengaged", "falling behind", "not progressing", "dropped"],
    workflow: "struggling-learner",
    priority: 9,
  },
  {
    keywords: ["certificate", "certification", "learning path", "prepare", "start studying", "begin", "plan my", "recommend cert", "which cert"],
    workflow: "certification-planning",
    priority: 8,
  },
  {
    keywords: ["readiness", "ready", "assessment", "evaluate", "quiz", "practice", "how ready", "am i ready", "test me"],
    workflow: "readiness-evaluation",
    priority: 7,
  },
  {
    keywords: ["engagement", "motivation", "reminder", "streak", "nudge", "habit", "consistency"],
    workflow: "engagement-check",
    priority: 6,
  },
  {
    keywords: ["coach", "help", "guide", "explain", "tips", "advice", "strategy", "how to study", "what should i"],
    workflow: "general-coaching",
    priority: 5,
  },
];

export function detectWorkflow(userRequest: string, view: "employee" | "manager"): WorkflowType {
  if (view === "manager") return "manager-request";

  const lower = userRequest.toLowerCase();
  let best: { workflow: WorkflowType; priority: number } | null = null;

  for (const rule of ROUTING_RULES) {
    const matched = rule.keywords.some(k => lower.includes(k));
    if (matched && (!best || rule.priority > best.priority)) {
      best = { workflow: rule.workflow, priority: rule.priority };
    }
  }

  return best?.workflow ?? "general-coaching";
}

// ─── Workflow Definitions ─────────────────────────────────────────────────────

export interface WorkflowDefinition {
  type: WorkflowType;
  label: string;
  description: string;
  steps: AgentName[];
}

export const WORKFLOWS: Record<WorkflowType, WorkflowDefinition> = {
  "certification-planning": {
    type: "certification-planning",
    label: "Certification Planning",
    description: "Full certification preparation: path → schedule → workload → coaching",
    steps: ["learning-path", "study-plan", "work-iq", "coach"],
  },
  "readiness-evaluation": {
    type: "readiness-evaluation",
    label: "Readiness Evaluation",
    description: "Evaluate where you stand: assessment → progress tracking → coaching",
    steps: ["assessment", "progress", "coach"],
  },
  "struggling-learner": {
    type: "struggling-learner",
    label: "Learner Recovery Plan",
    description: "Get back on track: progress analysis → engagement boost → coaching",
    steps: ["progress", "engagement", "coach"],
  },
  "manager-request": {
    type: "manager-request",
    label: "Team Readiness Report",
    description: "Team-wide workforce readiness and skill gap analysis",
    steps: ["manager-insights"],
  },
  "engagement-check": {
    type: "engagement-check",
    label: "Engagement Check",
    description: "Review your momentum and get personalized motivation",
    steps: ["engagement", "coach"],
  },
  "general-coaching": {
    type: "general-coaching",
    label: "AI Coaching",
    description: "Direct coaching and study guidance",
    steps: ["coach"],
  },
  "unknown": {
    type: "unknown",
    label: "General Request",
    description: "Handled by coaching agent",
    steps: ["coach"],
  },
};

// ─── Agent Invocation Helpers ─────────────────────────────────────────────────

/**
 * Build the request body for each agent, enriched with context from
 * previously-run agents in the same workflow.
 */
export function buildAgentPayload(
  agent: AgentName,
  ctx: OrchestratorContext
): Record<string, unknown> {
  const u = ctx.user;
  const f = ctx.findings;

  switch (agent) {
    case "learning-path":
      return {
        role: u?.role ?? "Employee",
        targetCertification: u?.targetCertification ?? "AZ-104",
        skillsInventory: u?.skillsInventory ?? "general cloud knowledge",
        experienceLevel: u?.experienceLevel ?? "intermediate",
      };

    case "study-plan": {
      const lpModules = (f.learningPath?.recommendedModules as { title: string }[] | undefined)
        ?.map(m => m.title).join(", ") ?? "core modules";
      const lpTime = (f.learningPath?.estimatedPreparationTime as string | undefined) ?? "8 weeks";
      return {
        learnerId: u?.id ?? "learner-1",
        targetCertification: u?.targetCertification ?? "AZ-104",
        studyHoursPerWeek: 10,
        targetDate: u?.targetDate ?? "2025-09-01",
        knowledgeGaps: f.learningPath?.knowledgeGaps ?? [],
        recommendedModules: lpModules,
        estimatedPreparationTime: lpTime,
      };
    }

    case "work-iq": {
      const studyHours = (f.studyPlan as { weeklySchedule?: { hoursPerDay?: number }[] } | undefined)
        ?.weeklySchedule?.[0]?.hoursPerDay ?? 2;
      return {
        learnerId: u?.id ?? "learner-1",
        averageDailyWorkHours: 8,
        meetingsPerWeek: 12,
        focusBlocksAvailable: 3,
        proposedStudyHours: studyHours,
        targetDate: u?.targetDate ?? "2025-09-01",
      };
    }

    case "assessment":
      return {
        learnerId: u?.id ?? "learner-1",
        targetCertification: u?.targetCertification ?? "AZ-104",
        knowledgeAreas: f.learningPath?.priorityAreas ?? ["Azure fundamentals", "Networking", "Storage"],
        difficulty: "intermediate",
      };

    case "progress":
      return {
        learnerId: u?.id ?? "learner-1",
        completionPercentage: u?.completionPercentage ?? 60,
        assessmentHistory: u?.assessmentScores?.map((score, i) => ({ week: i + 1, score })) ?? [],
        engagementMetrics: {
          streakDays: u?.streakDays ?? 0,
          engagementScore: f.engagement?.engagementScore ?? "unknown",
        },
        targetDate: u?.targetDate ?? "2025-09-01",
      };

    case "engagement":
      return {
        learnerId: u?.id ?? "learner-1",
        studyProgress: u?.completionPercentage ?? 60,
        completionHistory: "Weekly modules completed",
        assessmentScores: u?.assessmentScores ?? [],
        streakDays: u?.streakDays ?? 0,
      };

    case "coach": {
      // Synthesize findings from all prior agents into a coaching context message
      const parts: string[] = [`User request: ${ctx.userRequest}`];
      if (f.learningPath) parts.push(`Learning path: targeting ${(f.learningPath.targetCertification as string) ?? "unknown"}, readiness ${(f.learningPath.currentReadiness as string) ?? "unknown"}`);
      if (f.studyPlan) parts.push(`Study plan: ${JSON.stringify(f.studyPlan).slice(0, 300)}`);
      if (f.workIQ) parts.push(`Work IQ: ${JSON.stringify(f.workIQ).slice(0, 200)}`);
      if (f.assessment) parts.push(`Assessment readiness: ${(f.assessment.readinessScore as string) ?? "unknown"}`);
      if (f.progress) parts.push(`Progress score: ${(f.progress.progressScore as string) ?? "unknown"}, predicted ready: ${(f.progress.predictedReadinessDate as string) ?? "unknown"}`);
      if (f.engagement) parts.push(`Engagement: ${(f.engagement.engagementScore as string) ?? "unknown"}, risk: ${(f.engagement.riskStatus as string) ?? "unknown"}`);
      return {
        message: parts.join(". ") + ". Based on all the above, give me specific actionable coaching advice.",
        history: [],
        view: ctx.view,
      };
    }

    case "manager-insights": {
      const t = ctx.team;
      return {
        teamName: t?.teamName ?? "Engineering",
        teamSize: t?.teamSize ?? 24,
        readinessScore: t?.readinessScore ?? 76,
        certificationCoverage: t?.certificationCoverage ?? 94,
        teams: t?.teams ?? [
          { name: "Cloud Ops", readiness: 88 },
          { name: "Customer Success", readiness: 71 },
          { name: "Security Analysts", readiness: 93 },
          { name: "Field Engineering", readiness: 58 },
        ],
      };
    }

    default:
      return {};
  }
}

// ─── Output Types ─────────────────────────────────────────────────────────────

export interface OrchestratorOutput {
  requestId: string;
  workflow: WorkflowType;
  workflowLabel: string;
  userObjective: string;
  agentsConsulted: AgentName[];
  findings: AgentFindings;
  errors: Partial<Record<AgentName, string>>;
  summary: OrchestratorSummary;
  durationMs: number;
}

export interface OrchestratorSummary {
  keyFindings: string[];
  recommendedActions: string[];
  risksOrBlockers: string[];
  nextBestStep: string;
  conflictNotes?: string;
}
