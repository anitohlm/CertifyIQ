"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Award,
  BarChart3,
  BellRing,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  GraduationCap,
  Home as HomeIcon,
  Layers3,
  LineChart,
  Network,
  PlayCircle,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  Workflow,
  Settings,
  Bell,
  Moon,
  Bookmark,
  Star,
  ArrowUpRight,
  Target,
  Timer,
  Gauge,
  Send,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type AgentId =
  | "Learning Path Curator"
  | "Study Plan Generator"
  | "Work IQ Agent"
  | "Engagement Agent"
  | "Assessment Agent"
  | "Progress Intelligence"
  | "Manager Insights";

type AgentStatus = "idle" | "processing" | "done" | "error";

interface ChatMsg {
  role: "user" | "assistant" | "note";
  content: string;
}

interface AssessmentQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  citation: string;
}

interface AssessmentResult {
  readinessScore: string;
  questions: AssessmentQuestion[];
  knowledgeGaps: string[];
  recommendations: string[];
}

interface LearningPathResult {
  targetCertification: string;
  currentReadiness: string;
  recommendedModules: Array<{ title: string; duration: string; reason: string; priority: string }>;
  knowledgeGaps: string[];
  estimatedPreparationTime: string;
  priorityAreas: string[];
}

interface StudyPlanResult {
  studyPlan: Array<{ week: string; activities: string[]; hours: string; focus: string }>;
  totalDuration: string;
  riskLevel: string;
  recommendedAdjustments: string[];
}

interface WorkIQResult {
  recommendedStudyWindows: Array<{ day: string; time: string; duration: string; reason: string }>;
  workloadRisk: string;
  scheduleConflicts: string[];
  optimizationRecommendations: string[];
  predictedCompletionImpact: string;
}

interface ManagerInsightsResult {
  teamReadinessScore: string;
  certificationCoverage: string;
  highRiskEmployees: string[];
  skillGapSummary: Array<{ skill: string; affectedCount: number; urgency: string }>;
  forecastedCompletion: string;
  managerRecommendations: Array<{ action: string; priority: string; impact: string }>;
}

// ─── Static data ─────────────────────────────────────────────────────────────

const navItems = [
  { icon: HomeIcon, label: "Dashboard", active: true },
  { icon: UsersRound, label: "Learners" },
  { icon: BriefcaseBusiness, label: "Managers" },
  { icon: GraduationCap, label: "Certifications" },
  { icon: PlayCircle, label: "Live Sessions" },
  { icon: ClipboardCheck, label: "Assessments" },
  { icon: BarChart3, label: "Analytics" },
  { icon: BookOpen, label: "Knowledge Base" },
  { icon: Settings, label: "Settings" },
];

const agentDefinitions: Array<{ name: AgentId; icon: typeof Layers3; color: string; bg: string }> = [
  { name: "Learning Path Curator", icon: Layers3, color: "text-indigo-600", bg: "bg-indigo-50" },
  { name: "Study Plan Generator", icon: CalendarClock, color: "text-sky-600", bg: "bg-sky-50" },
  { name: "Work IQ Agent", icon: Network, color: "text-violet-600", bg: "bg-violet-50" },
  { name: "Engagement Agent", icon: BellRing, color: "text-amber-600", bg: "bg-amber-50" },
  { name: "Assessment Agent", icon: ClipboardCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  { name: "Progress Intelligence", icon: TrendingUp, color: "text-cyan-600", bg: "bg-cyan-50" },
  { name: "Manager Insights", icon: Radar, color: "text-rose-600", bg: "bg-rose-50" },
];

const popularCerts = [
  { title: "Azure Administrator", subtitle: "AZ-104 · Microsoft", level: "Intermediate", enrolled: 142, rating: 4.8, gradient: "from-violet-400 to-indigo-500", icon: "☁️" },
  { title: "Security Compliance", subtitle: "SC-900 · Enterprise", level: "Beginner", enrolled: 98, rating: 4.6, gradient: "from-rose-400 to-pink-500", icon: "🛡️" },
  { title: "Data Analytics", subtitle: "DP-300 · Azure", level: "Advanced", enrolled: 76, rating: 4.9, gradient: "from-amber-400 to-orange-500", icon: "📊" },
  { title: "DevOps Engineer", subtitle: "AZ-400 · DevOps", level: "Advanced", enrolled: 63, rating: 4.7, gradient: "from-teal-400 to-emerald-500", icon: "⚙️" },
];

const ongoingPaths = [
  { title: "Identity & Governance", subtitle: "AZ-104 Module 3", progress: 72, daysLeft: 5, gradient: "from-blue-400 to-indigo-400", icon: "🔐" },
  { title: "Network Security", subtitle: "SC-200 · Section 2", progress: 45, daysLeft: 12, gradient: "from-purple-400 to-violet-500", icon: "🌐" },
  { title: "Cloud Architecture", subtitle: "AZ-305 · Foundation", progress: 88, daysLeft: 2, gradient: "from-sky-400 to-cyan-400", icon: "🏗️" },
  { title: "Compliance Ops", subtitle: "Regulatory · Module 1", progress: 31, daysLeft: 18, gradient: "from-emerald-400 to-green-400", icon: "📋" },
];

const topLearners = [
  { name: "AZ-104 Track", count: "142 learners", rating: 4.8, color: "bg-indigo-500" },
  { name: "SC-900 Track", count: "98 learners", rating: 4.6, color: "bg-rose-500" },
  { name: "DP-300 Track", count: "76 learners", rating: 4.9, color: "bg-amber-500" },
  { name: "AZ-400 Track", count: "63 learners", rating: 4.7, color: "bg-emerald-500" },
  { name: "AZ-305 Track", count: "58 learners", rating: 4.5, color: "bg-cyan-500" },
];

const teamAchievements = [
  { name: "Sarah Chen", role: "Cloud Ops", pct: 89, daysLeft: 7, avatar: "SC" },
  { name: "Marcos Lima", role: "Field Eng", pct: 32, daysLeft: 12, avatar: "ML" },
];

const employeeMetrics = [
  { label: "Readiness", value: "82%", icon: Gauge, tone: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Plan adherence", value: "91%", icon: Target, tone: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Learning streak", value: "14d", icon: Award, tone: "text-amber-600", bg: "bg-amber-50" },
  { label: "Weekly load", value: "3.5h", icon: Timer, tone: "text-sky-600", bg: "bg-sky-50" },
];

const managerMetrics = [
  { label: "Team readiness", value: "76%", icon: UsersRound, tone: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Compliance", value: "94%", icon: ShieldCheck, tone: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Risk cohort", value: "12", icon: AlertTriangle, tone: "text-amber-600", bg: "bg-amber-50" },
  { label: "Forecast", value: "18d", icon: LineChart, tone: "text-sky-600", bg: "bg-sky-50" },
];

const teams = [
  { name: "Cloud Operations", coverage: 88, risk: "Low", gap: "Cost governance" },
  { name: "Customer Success", coverage: 71, risk: "Medium", gap: "Regulatory workflow" },
  { name: "Security Analysts", coverage: 93, risk: "Low", gap: "Incident reporting" },
  { name: "Field Engineering", coverage: 58, risk: "High", gap: "Azure networking" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Sidebar({ view, onView }: { view: "employee" | "manager"; onView: (v: "employee" | "manager") => void }) {
  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
          <BrainCircuit className="h-4 w-4" aria-hidden />
        </div>
        <span className="text-base font-bold text-slate-900">CertifyIQ</span>
      </div>

      <div className="mx-4 mb-4 flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
        <button
          onClick={() => onView("employee")}
          className={cn("flex-1 rounded-md py-1.5 transition-colors", view === "employee" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          Learner
        </button>
        <button
          onClick={() => onView("manager")}
          className={cn("flex-1 rounded-md py-1.5 transition-colors", view === "manager" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          Manager
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button key={label} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")}>
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </button>
        ))}
      </nav>

      <div className="m-4 rounded-xl bg-indigo-700 p-4 text-white">
        <Sparkles className="h-5 w-5 text-indigo-200" aria-hidden />
        <p className="mt-2 text-xs font-semibold leading-5 text-indigo-100">Upgrade to Pro for AI coaching, full analytics, and team insights.</p>
        <button className="mt-3 w-full rounded-lg bg-white py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-50">Upgrade →</button>
      </div>
    </aside>
  );
}

function TopHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span>Search courses, learners, certifications…</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Live
        </span>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100" aria-label="Toggle dark mode">
          <Moon className="h-4 w-4" aria-hidden />
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100" aria-label="Notifications">
          <Bell className="h-4 w-4" aria-hidden />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700 text-xs font-bold text-white">AJ</div>
      </div>
    </header>
  );
}

function AgentStatusBadge({ status }: { status: AgentStatus }) {
  if (status === "processing") return <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" aria-hidden />;
  if (status === "done") return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" aria-hidden />;
  if (status === "error") return <AlertCircle className="h-3.5 w-3.5 text-rose-500" aria-hidden />;
  return <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />;
}

function AgentRail({ statuses }: { statuses: Record<string, AgentStatus> }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Multi-Agent</p>
          <h2 className="text-sm font-bold text-slate-900">Live orchestration</h2>
        </div>
        <Workflow className="h-4 w-4 text-indigo-600" aria-hidden />
      </div>
      <div className="mt-3 space-y-2">
        {agentDefinitions.map((agent) => {
          const status = statuses[agent.name] ?? "idle";
          return (
            <div key={agent.name} className={cn("flex gap-2.5 rounded-lg border p-2.5 transition-colors", status === "processing" ? "border-indigo-200 bg-indigo-50/50" : status === "done" ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100")}>
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", agent.bg)}>
                <agent.icon className={cn("h-3.5 w-3.5", agent.color)} aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-slate-900">{agent.name}</div>
                  <div className="mt-0.5 truncate text-xs text-slate-400">
                    {status === "processing" ? "Processing…" : status === "done" ? "Complete" : status === "error" ? "Error" : "Standby"}
                  </div>
                </div>
                <AgentStatusBadge status={status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourseCard({ title, subtitle, level, enrolled, rating, gradient, icon }: typeof popularCerts[0]) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("flex h-28 items-center justify-center bg-gradient-to-br text-5xl", gradient)}>
        <span role="img">{icon}</span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold leading-snug text-slate-900">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          </div>
          <button className="shrink-0 text-slate-300 hover:text-indigo-500" aria-label="Bookmark">
            <Bookmark className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">{level}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
            <span className="font-semibold text-slate-700">{rating}</span>
            <span>· {enrolled} enrolled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OngoingCard({ title, subtitle, progress, daysLeft, gradient, icon }: typeof ongoingPaths[0]) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("flex h-20 items-center justify-center bg-gradient-to-br text-4xl", gradient)}>
        <span role="img">{icon}</span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold leading-snug text-slate-900">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">{progress}% complete</span>
            <span className={cn("text-xs font-semibold", daysLeft <= 5 ? "text-rose-600" : "text-slate-400")}>{daysLeft}d left</span>
          </div>
          <Progress value={progress} className="mt-1.5 h-1.5" indicatorClassName={progress >= 80 ? "bg-emerald-500" : progress >= 50 ? "bg-indigo-500" : "bg-amber-500"} />
        </div>
      </div>
    </div>
  );
}

// ─── AI result panels ─────────────────────────────────────────────────────────

function LearningPathPanel({ result, studyPlan, workIQ }: { result: LearningPathResult; studyPlan: StudyPlanResult | null; workIQ: WorkIQResult | null }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 shadow-sm">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500" aria-hidden />
          <span className="text-sm font-bold text-slate-900">AI-Generated Learning Path — {result.targetCertification}</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{result.estimatedPreparationTime}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden /> : <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />}
      </button>
      {open && (
        <div className="space-y-4 px-4 pb-4">
          {/* Modules */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended Modules</p>
            <div className="space-y-2">
              {result.recommendedModules?.slice(0, 4).map((m, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-white p-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{m.title}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{m.duration}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", m.priority === "High" ? "bg-rose-100 text-rose-700" : m.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>{m.priority}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{m.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge gaps */}
          {result.knowledgeGaps?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Knowledge Gaps</p>
              <div className="flex flex-wrap gap-1.5">
                {result.knowledgeGaps.map((g, i) => (
                  <span key={i} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{g}</span>
                ))}
              </div>
            </div>
          )}

          {/* Study plan */}
          {studyPlan && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Weekly Study Plan · <span className={cn("font-bold", studyPlan.riskLevel === "High" ? "text-rose-600" : studyPlan.riskLevel === "Medium" ? "text-amber-600" : "text-emerald-600")}>{studyPlan.riskLevel} Risk</span></p>
              <div className="grid gap-2 sm:grid-cols-2">
                {studyPlan.studyPlan?.slice(0, 4).map((w, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700">{w.week}</span>
                      <span className="text-xs font-semibold text-slate-500">{w.hours}h</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-700">{w.focus}</p>
                    <ul className="mt-1 space-y-0.5">
                      {w.activities?.slice(0, 2).map((a, j) => (
                        <li key={j} className="text-xs text-slate-500">· {a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work IQ windows */}
          {workIQ && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Optimal Study Windows (Work IQ)</p>
              <div className="flex flex-wrap gap-2">
                {workIQ.recommendedStudyWindows?.slice(0, 4).map((w, i) => (
                  <div key={i} className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs">
                    <span className="font-bold text-violet-700">{w.day} {w.time}</span>
                    <span className="ml-1.5 text-violet-500">· {w.duration}</span>
                    <p className="mt-0.5 text-violet-600">{w.reason}</p>
                  </div>
                ))}
              </div>
              {workIQ.predictedCompletionImpact && (
                <p className="mt-2 text-xs font-medium text-violet-700">📈 {workIQ.predictedCompletionImpact}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AssessmentPanel({
  result,
  onRefresh,
  loading,
}: {
  result: AssessmentResult | null;
  onRefresh: () => void;
  loading: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const q = result?.questions?.[0];

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSearch className="h-4 w-4 text-sky-600" aria-hidden />
          <h2 className="text-sm font-bold text-slate-900">AI Assessment</h2>
          {result?.readinessScore && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">Readiness: {result.readinessScore}</span>
          )}
        </div>
        <button
          onClick={() => { setSelected(null); onRefresh(); }}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden />}
          New question
        </button>
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" aria-hidden />
          Generating assessment from approved sources…
        </div>
      )}

      {!loading && q && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-sm font-semibold leading-6 text-slate-900">{q.question}</p>
          <div className="mt-3 space-y-2">
            {q.options?.map((opt, i) => {
              const isCorrect = opt === q.correctAnswer;
              const isSelected = opt === selected;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(opt)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                    !selected && "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50",
                    selected && isCorrect && "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold",
                    selected && isSelected && !isCorrect && "border-rose-300 bg-rose-50 text-rose-800",
                    selected && !isSelected && !isCorrect && "border-slate-100 bg-white opacity-60"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selected && (
            <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-slate-700">
              <span className="font-semibold text-sky-700">Explanation: </span>{q.explanation}
              {q.citation && <div className="mt-1 flex items-center gap-1 text-slate-500"><FileSearch className="h-3 w-3" aria-hidden />Source: {q.citation}</div>}
            </div>
          )}
        </div>
      )}

      {!loading && !q && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white/75 p-4 text-sm text-slate-500">
          Click "New question" to generate an AI-grounded practice question.
        </div>
      )}

      {result?.recommendations && result.recommendations.length > 0 && !loading && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {result.recommendations.slice(0, 3).map((r, i) => (
            <span key={i} className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700">{r}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function ManagerInsightsPanel({ result, loading, onRefresh }: { result: ManagerInsightsResult | null; loading: boolean; onRefresh: () => void }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-5 text-sm text-slate-500 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" aria-hidden />
        Manager Insights Agent is analyzing team data…
      </div>
    );
  }
  if (!result) return null;
  return (
    <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-rose-600" aria-hidden />
          <h2 className="text-sm font-bold text-slate-900">AI Manager Insights</h2>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">Forecasted: {result.forecastedCompletion}</span>
        </div>
        <button onClick={onRefresh} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Refresh</button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Skill gaps */}
        {result.skillGapSummary?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Skill Gaps</p>
            <div className="space-y-1.5">
              {result.skillGapSummary.map((g, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                  <span className="font-medium text-slate-700">{g.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{g.affectedCount} affected</span>
                    <span className={cn("rounded-full px-2 py-0.5 font-semibold", g.urgency === "High" ? "bg-rose-100 text-rose-700" : g.urgency === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>{g.urgency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Recommendations */}
        {result.managerRecommendations?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Recommendations</p>
            <div className="space-y-1.5">
              {result.managerRecommendations.map((r, i) => (
                <div key={i} className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("rounded-full px-1.5 py-0.5 text-xs font-bold", r.priority === "High" ? "bg-rose-100 text-rose-700" : r.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>{r.priority}</span>
                    <span className="font-semibold text-slate-800">{r.action}</span>
                  </div>
                  <p className="mt-0.5 text-slate-500">{r.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {result.highRiskEmployees?.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" aria-hidden />
          <span className="text-xs font-medium text-slate-600">High risk: {result.highRiskEmployees.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

function CoachingExchange({ view }: { view: "employee" | "manager" }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "user", content: "I have only three hours this week. What should I study first?" },
    { role: "assistant", content: "Focus on identity governance and access policy scenarios. Your assessment history shows the fastest readiness gain there, and Thursday has a 70-minute learning window." },
    { role: "note", content: "Manager note: learner remains on track for the June 28 certification target with medium schedule risk." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const history = messages
        .filter((m) => m.role !== "note")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, view }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.response ?? data.error ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Unable to reach AI coach right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
        <Sparkles className="h-4 w-4 text-indigo-600" aria-hidden />
        <h2 className="text-sm font-bold text-slate-900">AI coaching exchange</h2>
        <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
      <div className="max-h-52 space-y-2.5 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg px-4 py-3 text-sm leading-6",
              m.role === "user" && "bg-slate-100 text-slate-700",
              m.role === "assistant" && "bg-indigo-700 text-white",
              m.role === "note" && "border border-emerald-200 bg-emerald-50 text-slate-700"
            )}
          >
            {m.role === "note" && (
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Manager note
              </div>
            )}
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm text-white">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask CertifyIQ anything…"
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white transition-colors hover:bg-indigo-600 disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

// ─── Main layout ─────────────────────────────────────────────────────────────

export default function Home() {
  const [view, setView] = useState<"employee" | "manager">("employee");
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [chainRunning, setChainRunning] = useState(false);

  // Employee AI state
  const [learningPath, setLearningPath] = useState<LearningPathResult | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlanResult | null>(null);
  const [workIQ, setWorkIQ] = useState<WorkIQResult | null>(null);

  // Assessment state
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  // Manager state
  const [managerInsights, setManagerInsights] = useState<ManagerInsightsResult | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const setAgent = (name: string, status: AgentStatus) =>
    setAgentStatuses((s) => ({ ...s, [name]: status }));

  const runEmployeeChain = useCallback(async () => {
    if (chainRunning) return;
    setChainRunning(true);
    setLearningPath(null);
    setStudyPlan(null);
    setWorkIQ(null);
    setAgentStatuses({});

    try {
      // 1. Learning Path Curator
      setAgent("Learning Path Curator", "processing");
      const lpRes = await fetch("/api/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "Cloud Operations Engineer", targetCertification: "AZ-104 Azure Administrator", skillsInventory: "Azure basics, networking, storage, some identity management", experienceLevel: "Intermediate (3 years)" }),
      });
      const lp: LearningPathResult = await lpRes.json();
      setLearningPath(lp);
      setAgent("Learning Path Curator", "done");

      // 2. Study Plan Generator
      setAgent("Study Plan Generator", "processing");
      const spRes = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learningPath: lp, targetExamDate: "2025-07-28", weeklyAvailableHours: 3.5, workloadLevel: "Medium" }),
      });
      const sp: StudyPlanResult = await spRes.json();
      setStudyPlan(sp);
      setAgent("Study Plan Generator", "done");

      // 3. Work IQ Agent
      setAgent("Work IQ Agent", "processing");
      const wiqRes = await fetch("/api/work-iq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyPlan: sp, calendarActivity: "High meeting load Mon-Wed, lighter Thu-Fri", meetingLoad: "14 meetings/week", focusTimeSlots: ["Thursday 9-11am", "Friday 2-4pm", "Tuesday 7-8pm"] }),
      });
      const wiq: WorkIQResult = await wiqRes.json();
      setWorkIQ(wiq);
      setAgent("Work IQ Agent", "done");

      // 4. Engagement Agent
      setAgent("Engagement Agent", "processing");
      await fetch("/api/engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerId: "Alex Johnson", studyProgress: 72, completionHistory: "Consistent for 14 days", assessmentScores: [78, 82, 85], streakDays: 14 }),
      });
      setAgent("Engagement Agent", "done");

      // 5. Progress Intelligence
      setAgent("Progress Intelligence", "processing");
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerId: "Alex Johnson", completionPercentage: 72, assessmentHistory: [78, 82, 85], engagementMetrics: { streak: 14, weeklyHours: 3.5 }, targetDate: "2025-07-28" }),
      });
      setAgent("Progress Intelligence", "done");
    } catch {
      setAgentStatuses((s) => {
        const next = { ...s };
        for (const k of Object.keys(next)) if (next[k] === "processing") next[k] = "error";
        return next;
      });
    } finally {
      setChainRunning(false);
    }
  }, [chainRunning]);

  const runManagerInsights = useCallback(async () => {
    if (insightsLoading) return;
    setInsightsLoading(true);
    setManagerInsights(null);
    setAgent("Manager Insights", "processing");
    try {
      const res = await fetch("/api/manager-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: "All Teams", teamSize: 24, readinessScore: 76, certificationCoverage: 94, teams }),
      });
      const data: ManagerInsightsResult = await res.json();
      setManagerInsights(data);
      setAgent("Manager Insights", "done");
    } catch {
      setAgent("Manager Insights", "error");
    } finally {
      setInsightsLoading(false);
    }
  }, [insightsLoading]);

  const generateAssessment = useCallback(async () => {
    if (assessmentLoading) return;
    setAssessmentLoading(true);
    setAgent("Assessment Agent", "processing");
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certification: "AZ-104 Azure Administrator", domain: "Identity and Access Management", difficulty: "Intermediate", previousResults: [{ score: 78, topic: "Storage" }, { score: 82, topic: "Networking" }] }),
      });
      const data: AssessmentResult = await res.json();
      setAssessment(data);
      setAgent("Assessment Agent", "done");
    } catch {
      setAgent("Assessment Agent", "error");
    } finally {
      setAssessmentLoading(false);
    }
  }, [assessmentLoading]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar view={view} onView={setView} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader />
        <main className="flex flex-1 gap-5 overflow-y-auto p-5">
          {/* Main content */}
          <div className="flex-1 space-y-5 min-w-0">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-6 right-24 h-24 w-24 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute right-10 top-8 text-6xl opacity-70 select-none" aria-hidden>📚</div>
              <div className="pointer-events-none absolute bottom-4 right-40 text-4xl opacity-50 select-none" aria-hidden>🎓</div>
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
                  {view === "employee" ? "Personalized Readiness · Azure AI Foundry" : "Team Oversight · Azure AI Foundry"}
                </p>
                <h1 className="mt-2 text-2xl font-bold leading-snug">
                  {view === "employee" ? "Hi, Alex 👋  Your next milestone is 18 days away." : "Hi, Manager 👋  Team readiness at 76% — 12 at risk."}
                </h1>
                <p className="mt-1.5 max-w-lg text-sm leading-6 text-indigo-100">
                  {view === "employee" ? "CertifyIQ AI identified 3 high-quality study windows this week and adjusted your path around delivery milestones." : "CertifyIQ AI surfaces certification risk, coverage gaps, and completion forecasts across all your teams."}
                </p>
                <button
                  onClick={view === "employee" ? runEmployeeChain : runManagerInsights}
                  disabled={chainRunning || insightsLoading}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 disabled:opacity-70"
                >
                  {(chainRunning || insightsLoading) ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
                  {view === "employee" ? (chainRunning ? "Running agents…" : "Generate my learning path") : (insightsLoading ? "Analyzing…" : "Generate team insights")}
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3">
              {(view === "employee" ? employeeMetrics : managerMetrics).map(({ label, value, icon: Icon, tone, bg }) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className={cn("inline-flex rounded-lg p-2", bg)}>
                    <Icon className={cn("h-4 w-4", tone)} aria-hidden />
                  </div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
                </div>
              ))}
            </div>

            {/* AI results */}
            {view === "employee" && learningPath && (
              <LearningPathPanel result={learningPath} studyPlan={studyPlan} workIQ={workIQ} />
            )}
            {view === "manager" && (managerInsights || insightsLoading) && (
              <ManagerInsightsPanel result={managerInsights} loading={insightsLoading} onRefresh={runManagerInsights} />
            )}

            {/* Manager team table */}
            {view === "manager" && (
              <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Team Readiness</p>
                    <h2 className="text-base font-bold text-slate-900">Certification coverage and risk</h2>
                  </div>
                  <Button variant="secondary" className="h-8 text-xs">
                    <BarChart3 className="h-3.5 w-3.5" aria-hidden /> Export
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[560px]">
                    <div className="grid grid-cols-[1.4fr_1fr_0.7fr_1fr] bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                      <span>Team</span><span>Coverage</span><span>Risk</span><span>Skill gap</span>
                    </div>
                    {teams.map((team) => (
                      <div key={team.name} className="grid grid-cols-[1.4fr_1fr_0.7fr_1fr] items-center border-t border-slate-100 px-5 py-3 text-sm">
                        <span className="font-semibold text-slate-900">{team.name}</span>
                        <div className="pr-4">
                          <span className="text-xs font-semibold text-slate-600">{team.coverage}%</span>
                          <Progress value={team.coverage} className="mt-1 h-1.5" indicatorClassName={team.coverage < 65 ? "bg-rose-500" : team.coverage < 80 ? "bg-amber-500" : "bg-emerald-500"} />
                        </div>
                        <span className={cn("w-fit rounded-full px-2 py-0.5 text-xs font-bold", team.risk === "High" && "bg-rose-100 text-rose-700", team.risk === "Medium" && "bg-amber-100 text-amber-700", team.risk === "Low" && "bg-emerald-100 text-emerald-700")}>{team.risk}</span>
                        <span className="text-xs text-slate-500">{team.gap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Popular certifications */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Popular certifications</h2>
                <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">VIEW ALL <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /></button>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {popularCerts.map((cert) => <CourseCard key={cert.title} {...cert} />)}
              </div>
            </div>

            {/* Ongoing paths */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">{view === "employee" ? "Your active paths" : "Team active paths"}</h2>
                <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">VIEW ALL <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /></button>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {ongoingPaths.map((path) => <OngoingCard key={path.title} {...path} />)}
              </div>
            </div>

            {/* Assessment */}
            <AssessmentPanel result={assessment} onRefresh={generateAssessment} loading={assessmentLoading} />

            {/* Coaching */}
            <CoachingExchange view={view} />
          </div>

          {/* Right panel */}
          <aside className="flex w-64 shrink-0 flex-col gap-4">
            {/* Team Achievement */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Team achievement</h2>
                <button className="relative h-8 w-14 rounded-full bg-indigo-600" aria-label="Toggle">
                  <span className="absolute right-1 top-1 h-6 w-6 rounded-full bg-white shadow" />
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">Goal achieved success unlocked.</p>
              <div className="mt-4 space-y-3">
                {teamAchievements.map((a) => (
                  <div key={a.name} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{a.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="truncate text-slate-900">{a.name}</span>
                        <span className="shrink-0 text-slate-400">{a.daysLeft}d left</span>
                      </div>
                      <Progress value={a.pct} className="mt-1.5 h-1.5" indicatorClassName={a.pct >= 70 ? "bg-indigo-500" : "bg-amber-500"} />
                      <div className="mt-0.5 text-xs text-slate-400">{a.pct}% achieved</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top tracks */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Top tracks</h2>
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">VIEW ALL</button>
              </div>
              <div className="mt-3 space-y-2.5">
                {topLearners.map((t) => (
                  <div key={t.name} className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 shrink-0 rounded-lg", t.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs font-bold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.count}</div>
                    </div>
                    <button className="shrink-0 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Rail */}
            <AgentRail statuses={agentStatuses} />
          </aside>
        </main>
      </div>
    </div>
  );
}
