"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  AlertTriangle, Award, BarChart3, BellRing, BookOpen, BrainCircuit,
  BriefcaseBusiness, CalendarClock, CheckCircle2, ChevronRight,
  ClipboardCheck, FileSearch, GraduationCap, Home as HomeIcon,
  Layers3, LineChart, Network, PlayCircle, Radar, Search, ShieldCheck,
  Sparkles, TrendingUp, UsersRound, Workflow, Settings, Bell, Moon,
  Bookmark, Star, ArrowUpRight, Target, Timer, Gauge, Send, RefreshCw,
  Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  Video, Clock, Filter, Download, ExternalLink, FileText, Link2,
  Mail, Slack, Globe, ToggleLeft, User, Lock, PieChart, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "dashboard" | "learners" | "managers" | "certifications" | "live-sessions" | "assessments" | "analytics" | "knowledge-base" | "settings" | "ai-studio";
type AgentId = "Learning Path Curator" | "Study Plan Generator" | "Work IQ Agent" | "Engagement Agent" | "Assessment Agent" | "Progress Intelligence" | "Manager Insights";
type AgentStatus = "idle" | "processing" | "done" | "error";

interface ChatMsg { role: "user" | "assistant" | "note"; content: string; }
interface AssessmentQuestion { question: string; options: string[]; correctAnswer: string; explanation: string; citation: string; }
interface AssessmentResult { readinessScore: string; questions: AssessmentQuestion[]; knowledgeGaps: string[]; recommendations: string[]; }
interface LearningPathResult { targetCertification: string; currentReadiness: string; recommendedModules: Array<{ title: string; duration: string; reason: string; priority: string }>; knowledgeGaps: string[]; estimatedPreparationTime: string; priorityAreas: string[]; }
interface StudyPlanResult { studyPlan: Array<{ week: string; activities: string[]; hours: string; focus: string }>; totalDuration: string; riskLevel: string; recommendedAdjustments: string[]; }
interface WorkIQResult { recommendedStudyWindows: Array<{ day: string; time: string; duration: string; reason: string }>; workloadRisk: string; scheduleConflicts: string[]; optimizationRecommendations: string[]; predictedCompletionImpact: string; }
interface ManagerInsightsResult { teamReadinessScore: string; certificationCoverage: string; highRiskEmployees: string[]; skillGapSummary: Array<{ skill: string; affectedCount: number; urgency: string }>; forecastedCompletion: string; managerRecommendations: Array<{ action: string; priority: string; impact: string }>; }

// ─── Static data ─────────────────────────────────────────────────────────────

const learnerNav: Array<{ icon: typeof HomeIcon; label: string; page: Page }> = [
  { icon: HomeIcon,       label: "Dashboard",     page: "dashboard" },
  { icon: Sparkles,       label: "AI Studio",     page: "ai-studio" },
  { icon: GraduationCap,  label: "Certifications",page: "certifications" },
  { icon: PlayCircle,     label: "Live Sessions", page: "live-sessions" },
  { icon: ClipboardCheck, label: "Assessments",   page: "assessments" },
  { icon: BookOpen,       label: "Knowledge Base",page: "knowledge-base" },
  { icon: Settings,       label: "Settings",      page: "settings" },
];

const managerNav: Array<{ icon: typeof HomeIcon; label: string; page: Page }> = [
  { icon: HomeIcon,          label: "Dashboard",  page: "dashboard" },
  { icon: Sparkles,          label: "AI Studio",  page: "ai-studio" },
  { icon: UsersRound,        label: "Learners",   page: "learners" },
  { icon: BriefcaseBusiness, label: "Managers",   page: "managers" },
  { icon: BarChart3,         label: "Analytics",  page: "analytics" },
  { icon: BookOpen,          label: "Knowledge Base", page: "knowledge-base" },
  { icon: Settings,          label: "Settings",   page: "settings" },
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

const learnersData = [
  { name: "Alex Johnson", avatar: "AJ", role: "Cloud Operations Eng.", cert: "AZ-104", readiness: 82, status: "On Track", streak: 14, color: "bg-indigo-500" },
  { name: "Sarah Chen", avatar: "SC", role: "Cloud Operations Eng.", cert: "AZ-104", readiness: 89, status: "On Track", streak: 22, color: "bg-violet-500" },
  { name: "Marcos Lima", avatar: "ML", role: "Field Engineer", cert: "AZ-400", readiness: 32, status: "At Risk", streak: 2, color: "bg-rose-500" },
  { name: "Jordan Park", avatar: "JP", role: "Security Analyst", cert: "SC-900", readiness: 67, status: "Medium", streak: 8, color: "bg-amber-500" },
  { name: "Sam Rivera", avatar: "SR", role: "Customer Success", cert: "DP-300", readiness: 45, status: "At Risk", streak: 0, color: "bg-orange-500" },
  { name: "Taylor Kim", avatar: "TK", role: "Security Analyst", cert: "SC-200", readiness: 93, status: "Completed", streak: 30, color: "bg-emerald-500" },
  { name: "Morgan Chen", avatar: "MC", role: "DevOps Engineer", cert: "AZ-400", readiness: 71, status: "On Track", streak: 11, color: "bg-sky-500" },
  { name: "Casey Lee", avatar: "CL", role: "Cloud Architect", cert: "AZ-305", readiness: 58, status: "Medium", streak: 5, color: "bg-cyan-500" },
];

const managersData = [
  { name: "Robin Torres", avatar: "RT", team: "Cloud Operations", size: 6, readiness: 88, risk: "Low", color: "bg-indigo-500" },
  { name: "Dana Smith", avatar: "DS", team: "Customer Success", size: 5, readiness: 71, risk: "Medium", color: "bg-amber-500" },
  { name: "Jordan Lee", avatar: "JL", team: "Security Analysts", size: 4, readiness: 93, risk: "Low", color: "bg-emerald-500" },
  { name: "Quinn Patel", avatar: "QP", team: "Field Engineering", size: 9, readiness: 58, risk: "High", color: "bg-rose-500" },
];

const allCerts = [
  { title: "Azure Administrator", code: "AZ-104", category: "Azure", level: "Intermediate", enrolled: 142, duration: "40h", gradient: "from-violet-400 to-indigo-500", icon: "☁️", status: "In Progress" },
  { title: "Security Compliance", code: "SC-900", category: "Security", level: "Beginner", enrolled: 98, duration: "20h", gradient: "from-rose-400 to-pink-500", icon: "🛡️", status: "Available" },
  { title: "Data Analytics", code: "DP-300", category: "Data", level: "Advanced", enrolled: 76, duration: "50h", gradient: "from-amber-400 to-orange-500", icon: "📊", status: "Available" },
  { title: "DevOps Engineer", code: "AZ-400", category: "DevOps", level: "Advanced", enrolled: 63, duration: "60h", gradient: "from-teal-400 to-emerald-500", icon: "⚙️", status: "Available" },
  { title: "Azure Solutions Architect", code: "AZ-305", category: "Azure", level: "Expert", enrolled: 58, duration: "55h", gradient: "from-sky-400 to-blue-500", icon: "🏗️", status: "Available" },
  { title: "Security Operations", code: "SC-200", category: "Security", level: "Intermediate", enrolled: 44, duration: "45h", gradient: "from-red-400 to-rose-500", icon: "🔒", status: "Completed" },
  { title: "Power Platform", code: "PL-900", category: "Azure", level: "Beginner", enrolled: 38, duration: "15h", gradient: "from-purple-400 to-fuchsia-500", icon: "⚡", status: "Available" },
  { title: "AI Fundamentals", code: "AI-900", category: "Data", level: "Beginner", enrolled: 91, duration: "18h", gradient: "from-cyan-400 to-teal-500", icon: "🤖", status: "Available" },
];

const liveSessions = [
  { title: "AZ-104 Study Group", instructor: "Alex Thompson", date: "Today", time: "3:00 PM", duration: "90 min", enrolled: 24, max: 30, type: "Study Group", status: "Starting soon", gradient: "from-indigo-500 to-violet-600" },
  { title: "SC-900 Exam Prep", instructor: "Maria Gonzalez", date: "Wed, Jun 11", time: "2:00 PM", duration: "60 min", enrolled: 18, max: 25, type: "Exam Prep", status: "Open", gradient: "from-rose-500 to-pink-600" },
  { title: "Azure Networking Deep Dive", instructor: "James Park", date: "Thu, Jun 12", time: "4:00 PM", duration: "120 min", enrolled: 12, max: 20, type: "Workshop", status: "Open", gradient: "from-sky-500 to-cyan-600" },
  { title: "AZ-400 DevOps Bootcamp", instructor: "Sarah Chen", date: "Fri, Jun 13", time: "10:00 AM", duration: "180 min", enrolled: 9, max: 15, type: "Bootcamp", status: "Open", gradient: "from-emerald-500 to-teal-600" },
  { title: "Compliance & Governance Q&A", instructor: "Lisa Wang", date: "Mon, Jun 16", time: "1:00 PM", duration: "45 min", enrolled: 31, max: 50, type: "Q&A", status: "Open", gradient: "from-amber-500 to-orange-600" },
  { title: "AI-900 Foundations", instructor: "Chris Lee", date: "Tue, Jun 17", time: "11:00 AM", duration: "60 min", enrolled: 44, max: 50, type: "Foundations", status: "Almost full", gradient: "from-cyan-500 to-blue-600" },
];

const assessmentHistory = [
  { cert: "AZ-104", topic: "Identity & Access", score: 85, date: "Jun 7, 2025", status: "Passed", questions: 12 },
  { cert: "AZ-104", topic: "Storage Management", score: 78, date: "Jun 5, 2025", status: "Passed", questions: 10 },
  { cert: "AZ-104", topic: "Networking", score: 62, date: "Jun 2, 2025", status: "Review", questions: 15 },
  { cert: "SC-900", topic: "Security Concepts", score: 91, date: "May 30, 2025", status: "Passed", questions: 8 },
  { cert: "AZ-104", topic: "VM Management", score: 55, date: "May 27, 2025", status: "Failed", questions: 12 },
];

const analyticsTeams = [
  { name: "Cloud Ops", readiness: 88, target: 90, color: "bg-indigo-500" },
  { name: "Security", readiness: 93, target: 90, color: "bg-emerald-500" },
  { name: "Customer Success", readiness: 71, target: 85, color: "bg-amber-500" },
  { name: "Field Engineering", readiness: 58, target: 80, color: "bg-rose-500" },
];

const monthlyProgress = [
  { month: "Jan", value: 54 }, { month: "Feb", value: 59 }, { month: "Mar", value: 63 },
  { month: "Apr", value: 68 }, { month: "May", value: 72 }, { month: "Jun", value: 76 },
];

const knowledgeResources = [
  { title: "AZ-104 Study Guide", type: "PDF", category: "Azure", size: "4.2 MB", updated: "Jun 1, 2025", icon: "📄" },
  { title: "Identity Management Best Practices", type: "Article", category: "Security", size: "12 min read", updated: "May 28, 2025", icon: "📝" },
  { title: "Azure Networking Fundamentals", type: "Video", category: "Azure", size: "48 min", updated: "May 20, 2025", icon: "🎥" },
  { title: "SC-900 Official Microsoft Learn Path", type: "Course", category: "Security", size: "20 hours", updated: "May 15, 2025", icon: "🎓" },
  { title: "Compliance Framework Overview", type: "PDF", category: "Compliance", size: "2.1 MB", updated: "May 10, 2025", icon: "📄" },
  { title: "DevOps CI/CD Pipeline Reference", type: "Article", category: "DevOps", size: "8 min read", updated: "May 5, 2025", icon: "📝" },
  { title: "DP-300 Practice Labs", type: "Lab", category: "Data", size: "6 labs", updated: "Apr 28, 2025", icon: "🧪" },
  { title: "Azure Cost Management Guide", type: "PDF", category: "Azure", size: "3.7 MB", updated: "Apr 20, 2025", icon: "📄" },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "On Track": "bg-emerald-100 text-emerald-700",
    "Completed": "bg-indigo-100 text-indigo-700",
    "At Risk": "bg-rose-100 text-rose-700",
    "Medium": "bg-amber-100 text-amber-700",
    "Passed": "bg-emerald-100 text-emerald-700",
    "Failed": "bg-rose-100 text-rose-700",
    "Review": "bg-amber-100 text-amber-700",
    "Low": "bg-emerald-100 text-emerald-700",
    "High": "bg-rose-100 text-rose-700",
    "In Progress": "bg-sky-100 text-sky-700",
    "Available": "bg-slate-100 text-slate-600",
    "Open": "bg-emerald-100 text-emerald-700",
    "Almost full": "bg-amber-100 text-amber-700",
    "Starting soon": "bg-rose-100 text-rose-700",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", map[status] ?? "bg-slate-100 text-slate-600")}>
      {status}
    </span>
  );
}

// ─── Page components ──────────────────────────────────────────────────────────

function LearnersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [profile, setProfile] = useState<typeof learnersData[0] | null>(null);
  const [toast, setToast] = useState("");
  const filters = ["All", "On Track", "At Risk", "Medium", "Completed"];
  const filtered = learnersData.filter(l =>
    (filter === "All" || l.status === filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.role.toLowerCase().includes(search.toLowerCase()))
  );
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in slide-in-from-bottom-4">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {toast}
        </div>
      )}

      <PageHeader title="Learners" subtitle="Track certification progress across your workforce." action={
        <button onClick={() => showToast("Invite link copied to clipboard!")} className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors cursor-pointer">
          <UsersRound className="h-4 w-4" /> Invite learner
        </button>
      } />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total learners", value: "24", icon: UsersRound, bg: "bg-indigo-50", tone: "text-indigo-600" },
          { label: "On track", value: "14", icon: CheckCircle, bg: "bg-emerald-50", tone: "text-emerald-600" },
          { label: "At risk", value: "4", icon: AlertTriangle, bg: "bg-rose-50", tone: "text-rose-600" },
          { label: "Avg. readiness", value: "71%", icon: TrendingUp, bg: "bg-sky-50", tone: "text-sky-600" },
        ].map(({ label, value, icon: Icon, bg, tone }) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className={cn("inline-flex rounded-lg p-2", bg)}><Icon className={cn("h-4 w-4", tone)} /></div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search learners…" className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
          </div>
          <div className="flex gap-1">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer", filter === f ? "bg-indigo-700 text-white" : "text-slate-500 hover:bg-slate-100")}>{f}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_0.8fr_auto] bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-400">
          <span>Learner</span><span>Certification</span><span>Readiness</span><span>Progress</span><span>Streak</span><span />
        </div>
        {filtered.map(l => (
          <div key={l.name}>
            <div className={cn("grid grid-cols-[2fr_1.5fr_1fr_1.2fr_0.8fr_auto] items-center border-t border-slate-100 px-5 py-3.5 transition-colors", profile?.name === l.name ? "bg-indigo-50/60" : "hover:bg-slate-50/60")}>
              <div className="flex items-center gap-3">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white", l.color)}>{l.avatar}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{l.name}</div>
                  <div className="text-xs text-slate-500">{l.role}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-700">{l.cert}</div>
              <StatusBadge status={l.status} />
              <div className="pr-4">
                <div className="text-xs font-semibold text-slate-600">{l.readiness}%</div>
                <Progress value={l.readiness} className="mt-1 h-1.5" indicatorClassName={l.readiness >= 80 ? "bg-emerald-500" : l.readiness >= 60 ? "bg-amber-500" : "bg-rose-500"} />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                <Award className="h-3.5 w-3.5 text-amber-500" />{l.streak}d
              </div>
              <button onClick={() => setProfile(p => p?.name === l.name ? null : l)} className={cn("rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer", profile?.name === l.name ? "border-indigo-300 bg-indigo-100 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                {profile?.name === l.name ? "Close" : "View"}
              </button>
            </div>
            {/* Inline learner profile */}
            {profile?.name === l.name && (
              <div className="border-t border-indigo-100 bg-indigo-50/40 px-5 py-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Certification Progress</p>
                  <div className="text-sm font-semibold text-slate-900">{l.cert}</div>
                  <Progress value={l.readiness} className="mt-2 h-2" indicatorClassName={l.readiness >= 80 ? "bg-emerald-500" : l.readiness >= 60 ? "bg-amber-500" : "bg-rose-500"} />
                  <div className="mt-1 flex justify-between text-xs text-slate-500"><span>{l.readiness}% ready</span><StatusBadge status={l.status} /></div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Activity</p>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-amber-500" />{l.streak}-day study streak</div>
                    <div className="flex items-center gap-2"><Target className="h-3.5 w-3.5 text-indigo-500" />Plan adherence: 88%</div>
                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-sky-500" />Last active: Today</div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Quick Actions</p>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => showToast(`Nudge sent to ${l.name}`)} className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 text-left cursor-pointer">Send study nudge</button>
                    <button onClick={() => showToast(`Path reassigned for ${l.name}`)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 text-left cursor-pointer">Reassign path</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagersPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const teamMembers: Record<string, { name: string; cert: string; readiness: number }[]> = {
    "Robin Torres": [{ name: "Alex Johnson", cert: "AZ-104", readiness: 82 }, { name: "Sarah Chen", cert: "AZ-104", readiness: 89 }, { name: "Morgan Chen", cert: "AZ-400", readiness: 71 }],
    "Dana Smith":   [{ name: "Casey Lee", cert: "AZ-305", readiness: 58 }, { name: "Sam Rivera", cert: "DP-300", readiness: 45 }],
    "Jordan Lee":   [{ name: "Taylor Kim", cert: "SC-200", readiness: 93 }, { name: "Jordan Park", cert: "SC-900", readiness: 67 }],
    "Quinn Patel":  [{ name: "Marcos Lima", cert: "AZ-400", readiness: 32 }],
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {toast}
        </div>
      )}
      <PageHeader title="Managers" subtitle="Team leads and their workforce readiness overview." action={
        <button onClick={() => showToast("Manager invite sent!")} className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors cursor-pointer">
          <BriefcaseBusiness className="h-4 w-4" /> Add manager
        </button>
      } />

      <div className="grid grid-cols-2 gap-4">
        {managersData.map(m => (
          <div key={m.name} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white", m.color)}>{m.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.team} · {m.size} direct reports</div>
                  </div>
                </div>
                <StatusBadge status={m.risk} />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Team readiness</span><span>{m.readiness}%</span>
                </div>
                <Progress value={m.readiness} className="h-2" indicatorClassName={m.readiness >= 85 ? "bg-emerald-500" : m.readiness >= 70 ? "bg-amber-500" : "bg-rose-500"} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "On track", value: m.readiness >= 80 ? Math.floor(m.size * 0.7) : Math.floor(m.size * 0.4) },
                  { label: "At risk", value: m.risk === "High" ? Math.floor(m.size * 0.4) : 1 },
                  { label: "Completed", value: m.risk === "Low" ? 2 : 0 },
                ].map(s => (
                  <div key={s.label} className="rounded-lg bg-slate-50 py-2">
                    <div className="text-lg font-bold text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setExpanded(prev => { const n = new Set(prev); n.has(m.name) ? n.delete(m.name) : n.add(m.name); return n; })}
                className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                {expanded.has(m.name) ? <><ChevronUp className="h-3.5 w-3.5" /> Hide team</> : <><ChevronDown className="h-3.5 w-3.5" /> View team details</>}
              </button>
            </div>
            {expanded.has(m.name) && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Team members</p>
                <div className="space-y-2">
                  {(teamMembers[m.name] ?? []).map(member => (
                    <div key={member.name} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.cert}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-bold", member.readiness >= 80 ? "text-emerald-600" : member.readiness >= 60 ? "text-amber-600" : "text-rose-600")}>{member.readiness}%</span>
                        <button onClick={() => showToast(`Nudge sent to ${member.name}`)} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 cursor-pointer">Nudge</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsPage() {
  const [filter, setFilter] = useState("All");
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set(["AZ-104"]));
  const [toast, setToast] = useState("");
  const categories = ["All", "Azure", "Security", "Data", "DevOps"];
  const filtered = allCerts.filter(c => filter === "All" || c.category === filter);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleEnroll = (code: string, title: string) => {
    if (enrolled.has(code)) return;
    setEnrolled(prev => new Set([...prev, code]));
    showToast(`Enrolled in ${title}! Check your active paths.`);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {toast}
        </div>
      )}
      <PageHeader title="Certifications" subtitle="Browse and enroll in certification programs." action={
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {categories.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer", filter === f ? "bg-indigo-700 text-white" : "text-slate-500 hover:text-slate-700")}>
              {f}
            </button>
          ))}
        </div>
      } />
      <div className="grid grid-cols-4 gap-4">
        {filtered.map(cert => {
          const isEnrolled = enrolled.has(cert.code);
          const isCompleted = cert.status === "Completed";
          return (
            <div key={cert.code} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className={cn("flex h-28 items-center justify-center bg-gradient-to-br text-5xl", cert.gradient)}>
                <span>{cert.icon}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{cert.title}</div>
                    <div className="text-xs text-slate-500">{cert.code}</div>
                  </div>
                  <StatusBadge status={isCompleted ? "Completed" : isEnrolled ? "In Progress" : "Available"} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">{cert.level}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cert.duration}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <UsersRound className="h-3 w-3" />{cert.enrolled + (isEnrolled && cert.status !== "In Progress" ? 1 : 0)} enrolled
                </div>
                <button
                  onClick={() => !isCompleted && handleEnroll(cert.code, cert.title)}
                  className={cn("mt-3 w-full rounded-lg py-2 text-xs font-semibold transition-colors cursor-pointer",
                    isCompleted ? "bg-slate-100 text-slate-500 cursor-default" :
                    isEnrolled ? "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100" :
                    "bg-indigo-700 text-white hover:bg-indigo-600"
                  )}
                >
                  {isCompleted ? "✓ Completed" : isEnrolled ? "Continue →" : "Enroll"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveSessionsPage() {
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const toggleRegister = (title: string) => {
    setRegistered(prev => {
      const n = new Set(prev);
      if (n.has(title)) { n.delete(title); showToast(`Unregistered from ${title}`); }
      else { n.add(title); showToast(`Registered for ${title}! Added to your calendar.`); }
      return n;
    });
  };

  const handleJoin = () => {
    setJoining(true);
    showToast("Connecting to session… Opening in new tab.");
    setTimeout(() => setJoining(false), 2500);
  };

  const handleSchedule = () => showToast("Session creation form coming soon!");

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {toast}
        </div>
      )}
      <PageHeader title="Live Sessions" subtitle="Join scheduled study groups, workshops, and exam prep sessions." action={
        <button onClick={handleSchedule} className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors cursor-pointer">
          <Video className="h-4 w-4" /> Schedule session
        </button>
      } />

      {/* Today's highlight */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> STARTING SOON
            </span>
            <h2 className="mt-2 text-xl font-bold">AZ-104 Study Group</h2>
            <p className="mt-1 text-sm text-indigo-100">Led by Alex Thompson · Today at 3:00 PM · 90 min</p>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-indigo-100">
              <UsersRound className="h-4 w-4" /> 24 / 30 enrolled
            </div>
          </div>
          <button onClick={handleJoin} disabled={joining} className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 disabled:opacity-70 transition-colors cursor-pointer">
            {joining ? <><Loader2 className="h-4 w-4 animate-spin" /> Connecting…</> : "Join now →"}
          </button>
        </div>
      </div>

      {/* Session list */}
      <div className="space-y-3">
        {liveSessions.slice(1).map(s => {
          const isRegistered = registered.has(s.title);
          return (
            <div key={s.title} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl", s.gradient)}>
                🎯
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{s.title}</span>
                  <StatusBadge status={s.status} />
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{s.type}</span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{s.instructor}</span>
                  <span className="flex items-center gap-1"><CalendarClock className="h-3 w-3" />{s.date} · {s.time}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration}</span>
                  <span className="flex items-center gap-1"><UsersRound className="h-3 w-3" />{s.enrolled + (isRegistered ? 1 : 0)}/{s.max}</span>
                </div>
              </div>
              <button
                onClick={() => toggleRegister(s.title)}
                className={cn("shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
                  isRegistered
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                )}
              >
                {isRegistered ? <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Registered</span> : "Register"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssessmentsPage({
  assessment, assessmentLoading, onGenerate, agentStatuses
}: {
  assessment: AssessmentResult | null;
  assessmentLoading: boolean;
  onGenerate: () => void;
  agentStatuses: Record<string, AgentStatus>;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => { setSelected(null); }, [assessment]);

  const q = assessment?.questions?.[0];

  return (
    <div className="space-y-5">
      <PageHeader title="Assessments" subtitle="Practice questions grounded in approved certification sources." />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Assessments taken", value: "23", icon: ClipboardCheck, bg: "bg-indigo-50", tone: "text-indigo-600" },
          { label: "Avg. score", value: "74%", icon: Target, bg: "bg-emerald-50", tone: "text-emerald-600" },
          { label: "Topics reviewed", value: "8", icon: BookOpen, bg: "bg-sky-50", tone: "text-sky-600" },
          { label: "AI readiness", value: "82%", icon: Gauge, bg: "bg-amber-50", tone: "text-amber-600" },
        ].map(({ label, value, icon: Icon, bg, tone }) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className={cn("inline-flex rounded-lg p-2", bg)}><Icon className={cn("h-4 w-4", tone)} /></div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* AI Assessment panel */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", agentStatuses["Assessment Agent"] === "processing" ? "bg-emerald-100" : "bg-emerald-50")}>
              <ClipboardCheck className={cn("h-4 w-4", agentStatuses["Assessment Agent"] === "processing" ? "text-emerald-600" : "text-emerald-500")} />
            </div>
            <h2 className="text-sm font-bold text-slate-900">AI-Grounded Practice Question</h2>
            {agentStatuses["Assessment Agent"] === "processing" && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <Loader2 className="h-3 w-3 animate-spin" /> Generating…
              </span>
            )}
            {assessment?.readinessScore && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">Readiness: {assessment.readinessScore}</span>
            )}
          </div>
          <button onClick={() => { setSelected(null); onGenerate(); }} disabled={assessmentLoading}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-700 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 disabled:opacity-50">
            {assessmentLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Generate question
          </button>
        </div>

        {q && !assessmentLoading && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold leading-6 text-slate-900">{q.question}</p>
            <div className="mt-3 space-y-2">
              {q.options?.map((opt, i) => {
                const isCorrect = opt === q.correctAnswer;
                const isSelected = opt === selected;
                return (
                  <button key={i} onClick={() => setSelected(opt)} className={cn(
                    "w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                    !selected && "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50",
                    selected && isCorrect && "border-emerald-300 bg-emerald-50 font-semibold text-emerald-800",
                    selected && isSelected && !isCorrect && "border-rose-300 bg-rose-50 text-rose-800",
                    selected && !isSelected && !isCorrect && "border-slate-100 bg-white opacity-60"
                  )}>{opt}</button>
                );
              })}
            </div>
            {selected && (
              <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-slate-700">
                <span className="font-semibold text-sky-700">Explanation: </span>{q.explanation}
                {q.citation && <div className="mt-1 flex items-center gap-1 text-slate-500"><FileSearch className="h-3 w-3" />Source: {q.citation}</div>}
              </div>
            )}
          </div>
        )}

        {!q && !assessmentLoading && (
          <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
            Click "Generate question" to get an AI-grounded practice question from approved sources.
          </div>
        )}
      </div>

      {/* History */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">Assessment history</h2>
        </div>
        <div className="grid grid-cols-[1fr_1.5fr_0.8fr_1fr_0.8fr_auto] bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-400">
          <span>Cert</span><span>Topic</span><span>Score</span><span>Date</span><span>Status</span><span />
        </div>
        {assessmentHistory.map((a, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.5fr_0.8fr_1fr_0.8fr_auto] items-center border-t border-slate-100 px-5 py-3 text-sm">
            <span className="font-semibold text-slate-900">{a.cert}</span>
            <span className="text-slate-600">{a.topic}</span>
            <span className={cn("font-bold", a.score >= 80 ? "text-emerald-600" : a.score >= 65 ? "text-amber-600" : "text-rose-600")}>{a.score}%</span>
            <span className="text-xs text-slate-500">{a.date}</span>
            <StatusBadge status={a.status} />
            <button onClick={() => { setSelected(null); onGenerate(); }} disabled={assessmentLoading} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40 cursor-pointer">
              {assessmentLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Retry"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 2500); }, 1800);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Analytics" subtitle="Organisation-wide readiness trends and certification intelligence." action={
        <button onClick={handleExport} disabled={exporting} className={cn("flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer",
          exported ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
          exporting ? "border-slate-200 bg-slate-50 text-slate-400" :
          "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        )}>
          {exporting ? <><Loader2 className="h-4 w-4 animate-spin" /> Exporting…</> : exported ? <><CheckCircle className="h-4 w-4" /> Exported!</> : <><Download className="h-4 w-4" /> Export report</>}
        </button>
      } />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Org readiness", value: "76%", change: "+4%", icon: TrendingUp, bg: "bg-indigo-50", tone: "text-indigo-600" },
          { label: "Certs completed", value: "38", change: "+6", icon: Award, bg: "bg-emerald-50", tone: "text-emerald-600" },
          { label: "Active learners", value: "21", change: "+2", icon: Activity, bg: "bg-sky-50", tone: "text-sky-600" },
          { label: "Compliance cover.", value: "94%", change: "+1%", icon: ShieldCheck, bg: "bg-amber-50", tone: "text-amber-600" },
        ].map(({ label, value, change, icon: Icon, bg, tone }) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={cn("inline-flex rounded-lg p-2", bg)}><Icon className={cn("h-4 w-4", tone)} /></div>
              <span className="text-xs font-semibold text-emerald-600">{change} this month</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Monthly trend */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Readiness trend (6 months)</h2>
          <div className="mt-4 flex items-end gap-3 h-32">
            {monthlyProgress.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-indigo-700">{m.value}%</span>
                <div className="w-full rounded-t-md bg-indigo-500 transition-all" style={{ height: `${(m.value / 100) * 100}%` }} />
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team breakdown */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Team readiness vs target</h2>
          <div className="mt-4 space-y-4">
            {analyticsTeams.map(t => (
              <div key={t.name}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700">{t.name}</span>
                  <span className={cn(t.readiness >= t.target ? "text-emerald-600" : "text-rose-600")}>{t.readiness}% / {t.target}% target</span>
                </div>
                <div className="relative h-2 rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full transition-all", t.color)} style={{ width: `${t.readiness}%` }} />
                  <div className="absolute top-0 h-full border-r-2 border-dashed border-slate-400" style={{ left: `${t.target}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cert distribution */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Certification distribution</h2>
          <div className="mt-4 space-y-3">
            {allCerts.slice(0, 5).map(c => (
              <div key={c.code} className="flex items-center gap-3">
                <span className="w-16 text-xs font-bold text-slate-700 shrink-0">{c.code}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(c.enrolled / 142) * 100}%` }} />
                </div>
                <span className="w-10 text-right text-xs text-slate-500">{c.enrolled}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk heatmap */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Risk heatmap</h2>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {Array.from({ length: 24 }).map((_, i) => {
              const c = i % 7 === 0 ? "bg-rose-400" : i % 5 === 0 ? "bg-amber-400" : i % 3 === 0 ? "bg-sky-400" : "bg-emerald-400";
              return <div key={i} className={cn("h-9 rounded-lg shadow-sm", c)} title={`Cell ${i + 1}`} />;
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500">
            {[["bg-emerald-400","On track"],["bg-sky-400","Moderate"],["bg-amber-400","At risk"],["bg-rose-400","Critical"]].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1"><span className={cn("h-2.5 w-2.5 rounded-sm", c)} />{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [opening, setOpening] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const categories = ["All", "Azure", "Security", "Data", "DevOps", "Compliance"];
  const filtered = knowledgeResources.filter(r =>
    (filter === "All" || r.category === filter) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );
  const typeIcon: Record<string, string> = { PDF: "📄", Article: "📝", Video: "🎥", Course: "🎓", Lab: "🧪" };
  const handleOpen = (title: string, type: string) => {
    setOpening(title);
    setTimeout(() => {
      setOpening(null);
      setToast(`Opening ${type}: ${title.slice(0, 40)}…`);
      setTimeout(() => setToast(""), 3000);
    }, 800);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {toast}
        </div>
      )}
      <PageHeader title="Knowledge Base" subtitle="Approved learning resources, guides, and reference material." />

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-400 shadow-sm">
          <Search className="h-4 w-4 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources…" className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
        </div>
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {categories.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer", filter === f ? "bg-indigo-700 text-white" : "text-slate-500 hover:text-slate-700")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map(r => (
          <div key={r.title} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl border border-slate-100">
              {typeIcon[r.type] ?? "📄"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{r.title}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">{r.type}</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-600">{r.category}</span>
                <span>{r.size}</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">Updated {r.updated}</div>
            </div>
            <button
              onClick={() => handleOpen(r.title, r.type)}
              disabled={opening === r.title}
              className="shrink-0 flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {opening === r.title ? <Loader2 className="h-3 w-3 animate-spin" /> : <ExternalLink className="h-3 w-3" />}
              {opening === r.title ? "Opening…" : "Open"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [pwToast, setPwToast] = useState("");
  const [notifs, setNotifs] = useState({ studyReminders: true, assessmentResults: true, managerInsights: false, liveSessions: true, milestones: true });
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set(["Microsoft 365", "Microsoft Teams", "Azure AI Foundry"]));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const showPwToast = (msg: string) => { setPwToast(msg); setTimeout(() => setPwToast(""), 3000); };

  const notifItems = [
    { key: "studyReminders" as const, label: "Study reminders", desc: "Daily nudges from the Engagement Agent" },
    { key: "assessmentResults" as const, label: "Assessment results", desc: "When AI grades your practice session" },
    { key: "managerInsights" as const, label: "Manager insights", desc: "Weekly readiness digest for your team" },
    { key: "liveSessions" as const, label: "Live session alerts", desc: "30 min before a session starts" },
    { key: "milestones" as const, label: "Milestone celebrations", desc: "When you complete a learning module" },
  ];

  const integrationList = [
    { label: "Microsoft 365", desc: "Calendar and Work IQ signals", icon: Globe },
    { label: "Microsoft Teams", desc: "Session notifications and nudges", icon: Slack },
    { label: "Azure AI Foundry", desc: "7-agent orchestration backend", icon: BrainCircuit },
    { label: "SharePoint", desc: "Knowledge base sync", icon: Link2 },
  ];

  return (
    <div className="space-y-5">
      {pwToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> {pwToast}
        </div>
      )}
      <PageHeader title="Settings" subtitle="Manage your profile, notifications, and integrations." />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        {/* Profile */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Profile</h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-700 text-xl font-bold text-white">AJ</div>
              <div>
                <div className="font-semibold text-slate-900">Alex Johnson</div>
                <div className="text-sm text-slate-500">Cloud Operations Engineer</div>
                <button onClick={() => showPwToast("Photo upload coming soon!")} className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">Change photo</button>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[{ label: "Full name", value: "Alex Johnson" }, { label: "Email", value: "alex.johnson@company.com" }, { label: "Role", value: "Cloud Operations Engineer" }, { label: "Department", value: "Cloud Operations" }].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-slate-500">{f.label}</label>
                  <input defaultValue={f.value} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200" />
                </div>
              ))}
              <button onClick={save} className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors cursor-pointer">
                {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : "Save changes"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Security</h2>
            <div className="mt-4 space-y-3">
              <button onClick={() => showPwToast("Password reset email sent!")} className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-slate-400" />Change password</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button onClick={() => showPwToast("Two-factor authentication is already enabled.")} className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-slate-400" />Two-factor authentication</span>
                <span className="text-xs font-semibold text-emerald-600">Enabled</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Notifications */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
            <div className="mt-4 space-y-3">
              {notifItems.map(n => (
                <div key={n.key} className="flex items-center justify-between py-1">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{n.label}</div>
                    <div className="text-xs text-slate-500">{n.desc}</div>
                  </div>
                  <button
                    onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                    className={cn("relative h-6 w-11 rounded-full transition-colors cursor-pointer", notifs[n.key] ? "bg-indigo-600" : "bg-slate-200")}
                    aria-label={`Toggle ${n.label}`}
                    role="switch"
                    aria-checked={notifs[n.key]}
                  >
                    <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", notifs[n.key] ? "translate-x-5" : "translate-x-0.5")} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Integrations</h2>
            <div className="mt-4 space-y-3">
              {integrationList.map(intg => {
                const isConnected = connectedIntegrations.has(intg.label);
                return (
                  <div key={intg.label} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                        <intg.icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{intg.label}</div>
                        <div className="text-xs text-slate-500">{intg.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setConnectedIntegrations(prev => { const n = new Set(prev); isConnected ? n.delete(intg.label) : n.add(intg.label); return n; });
                        showPwToast(isConnected ? `Disconnected ${intg.label}` : `Connected to ${intg.label}!`);
                      }}
                      className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                        isConnected ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                      )}
                    >
                      {isConnected ? "✓ Connected" : "Connect"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Upgrade modal ────────────────────────────────────────────────────────────

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-7 py-8 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">CertifyIQ Pro</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold">Unlock AI-powered coaching</h2>
          <p className="mt-2 text-sm leading-6 text-indigo-100">Get unlimited AI agents, full analytics, live session priority, and team-wide readiness forecasting.</p>
        </div>
        <div className="p-6">
          <div className="space-y-3 mb-6">
            {[
              "Unlimited AI coaching sessions",
              "Full Analytics + export reports",
              "Live session priority registration",
              "Team readiness forecasting & risk alerts",
              "Custom certification paths",
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm text-slate-700">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                {f}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 mb-4">
            <div>
              <div className="text-sm font-bold text-slate-900">Pro plan</div>
              <div className="text-xs text-slate-500">Billed annually</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-slate-900">$19<span className="text-sm font-normal">/mo</span></div>
              <div className="text-xs text-slate-400 line-through">$29/mo</div>
            </div>
          </div>
          <button className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
            Start 14-day free trial
          </button>
          <button onClick={onClose} className="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-600">Maybe later</button>
        </div>
      </div>
    </div>
  );
}

// ─── Persistent components ────────────────────────────────────────────────────

function AgentStatusDot({ status }: { status: AgentStatus }) {
  if (status === "processing") return <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />;
  if (status === "done") return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
  if (status === "error") return <AlertCircle className="h-3.5 w-3.5 text-rose-500" />;
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
        <Workflow className="h-4 w-4 text-indigo-600" />
      </div>
      <div className="mt-3 space-y-2">
        {agentDefinitions.map(agent => {
          const status = statuses[agent.name] ?? "idle";
          return (
            <div key={agent.name} className={cn("flex gap-2.5 rounded-lg border p-2.5 transition-colors",
              status === "processing" ? "border-indigo-200 bg-indigo-50/50" :
              status === "done" ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100"
            )}>
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", agent.bg)}>
                <agent.icon className={cn("h-3.5 w-3.5", agent.color)} />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-slate-900">{agent.name}</div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {status === "processing" ? "Processing…" : status === "done" ? "Complete" : status === "error" ? "Error" : "Standby"}
                  </div>
                </div>
                <AgentStatusDot status={status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RightPanel({ statuses, view, onNavigate }: { statuses: Record<string, AgentStatus>; view: "employee" | "manager"; onNavigate: (p: Page) => void }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4">
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Team achievement</h2>
          <button className="relative h-8 w-14 rounded-full bg-indigo-600" aria-label="Toggle">
            <span className="absolute right-1 top-1 h-6 w-6 rounded-full bg-white shadow" />
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">Goal achieved success unlocked.</p>
        <div className="mt-4 space-y-3">
          {teamAchievements.map(a => (
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

      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Top tracks</h2>
          <button onClick={() => onNavigate("certifications")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">VIEW ALL</button>
        </div>
        <div className="mt-3 space-y-2.5">
          {topLearners.map(t => (
            <div key={t.name} className="flex items-center gap-3">
              <div className={cn("h-8 w-8 shrink-0 rounded-lg", t.color)} />
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-bold text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-500">{t.count}</div>
              </div>
              <button onClick={() => onNavigate("certifications")} className="shrink-0 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">View</button>
            </div>
          ))}
        </div>
      </div>

      <AgentRail statuses={statuses} />
    </aside>
  );
}

// ─── Dashboard components ─────────────────────────────────────────────────────

function LearningPathPanel({ result, studyPlan, workIQ }: { result: LearningPathResult; studyPlan: StudyPlanResult | null; workIQ: WorkIQResult | null }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 shadow-sm">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-bold text-slate-900">AI-Generated Path — {result.targetCertification}</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{result.estimatedPreparationTime}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && (
        <div className="space-y-4 px-4 pb-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {result.recommendedModules?.slice(0, 4).map((m, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-white p-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-900">{m.title}</span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{m.duration}</span>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-xs font-semibold", m.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}>{m.priority}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{m.reason}</p>
                </div>
              </div>
            ))}
          </div>
          {result.knowledgeGaps?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.knowledgeGaps.map((g, i) => (
                <span key={i} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{g}</span>
              ))}
            </div>
          )}
          {studyPlan && (
            <div className="grid gap-2 sm:grid-cols-2">
              {studyPlan.studyPlan?.slice(0, 4).map((w, i) => (
                <div key={i} className="rounded-lg border border-slate-100 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700">{w.week}</span>
                    <span className="text-xs font-semibold text-slate-500">{w.hours}h</span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-slate-700">{w.focus}</p>
                </div>
              ))}
            </div>
          )}
          {workIQ && workIQ.recommendedStudyWindows?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {workIQ.recommendedStudyWindows.slice(0, 3).map((w, i) => (
                <div key={i} className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs">
                  <span className="font-bold text-violet-700">{w.day} {w.time}</span>
                  <span className="ml-1.5 text-violet-500">· {w.duration}</span>
                </div>
              ))}
            </div>
          )}
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

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const history = messages.filter(m => m.role !== "note").map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      const res = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history, view }) });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.response ?? data.error ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Unable to reach AI coach right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
        <Sparkles className="h-4 w-4 text-indigo-600" />
        <h2 className="text-sm font-bold text-slate-900">AI coaching exchange</h2>
        <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live
        </span>
      </div>
      <div className="max-h-52 space-y-2.5 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("rounded-lg px-4 py-3 text-sm leading-6",
            m.role === "user" && "bg-slate-100 text-slate-700",
            m.role === "assistant" && "bg-indigo-700 text-white",
            m.role === "note" && "border border-emerald-200 bg-emerald-50 text-slate-700"
          )}>
            {m.role === "note" && <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Manager note</div>}
            {m.content}
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm text-white"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</div>}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask CertifyIQ anything…" className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200" />
        <button onClick={send} disabled={loading || !input.trim()} className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white hover:bg-indigo-600 disabled:opacity-40" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function DashboardPage({ view, onNavigate }: { view: "employee" | "manager"; onNavigate: (p: Page) => void }) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [exportingTeam, setExportingTeam] = useState(false);
  const [exportedTeam, setExportedTeam] = useState(false);
  const toggleBookmark = (title: string) => setBookmarked(prev => { const n = new Set(prev); n.has(title) ? n.delete(title) : n.add(title); return n; });
  const handleTeamExport = () => { setExportingTeam(true); setTimeout(() => { setExportingTeam(false); setExportedTeam(true); setTimeout(() => setExportedTeam(false), 2500); }, 1800); };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-6 right-24 h-24 w-24 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-10 top-8 text-6xl opacity-70 select-none">📚</div>
        <div className="pointer-events-none absolute bottom-4 right-40 text-4xl opacity-50 select-none">🎓</div>
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
            {view === "employee" ? "Personalized Readiness · Azure AI Foundry" : "Team Oversight · Azure AI Foundry"}
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-snug">
            {view === "employee" ? "Hi, Alex 👋  Your next milestone is 18 days away." : "Hi, Manager 👋  Team readiness at 76% — 12 at risk."}
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-6 text-indigo-100">
            {view === "employee" ? "CertifyIQ AI identified 3 high-quality study windows this week." : "CertifyIQ AI surfaces certification risk, coverage gaps, and completion forecasts."}
          </p>
          <button onClick={() => onNavigate("ai-studio")}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            {view === "employee" ? "Open AI Studio" : "Open AI Studio"}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {(view === "employee" ? employeeMetrics : managerMetrics).map(({ label, value, icon: Icon, tone, bg }) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className={cn("inline-flex rounded-lg p-2", bg)}><Icon className={cn("h-4 w-4", tone)} /></div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
          </div>
        ))}
      </div>


      {/* Manager team table */}
      {view === "manager" && (
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Team Readiness</p>
              <h2 className="text-base font-bold text-slate-900">Certification coverage and risk</h2>
            </div>
            <button onClick={handleTeamExport} disabled={exportingTeam} className={cn("flex items-center gap-1.5 rounded-lg border h-8 px-3 text-xs font-semibold transition-colors cursor-pointer", exportedTeam ? "border-emerald-200 bg-emerald-50 text-emerald-700" : exportingTeam ? "border-slate-200 bg-slate-50 text-slate-400" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
              {exportingTeam ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Exporting…</> : exportedTeam ? <><CheckCircle className="h-3.5 w-3.5" /> Exported!</> : <><BarChart3 className="h-3.5 w-3.5" /> Export</>}
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[1.4fr_1fr_0.7fr_1fr] bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                <span>Team</span><span>Coverage</span><span>Risk</span><span>Skill gap</span>
              </div>
              {teams.map(team => (
                <div key={team.name} className="grid grid-cols-[1.4fr_1fr_0.7fr_1fr] items-center border-t border-slate-100 px-5 py-3 text-sm">
                  <span className="font-semibold text-slate-900">{team.name}</span>
                  <div className="pr-4">
                    <span className="text-xs font-semibold text-slate-600">{team.coverage}%</span>
                    <Progress value={team.coverage} className="mt-1 h-1.5" indicatorClassName={team.coverage < 65 ? "bg-rose-500" : team.coverage < 80 ? "bg-amber-500" : "bg-emerald-500"} />
                  </div>
                  <StatusBadge status={team.risk} />
                  <span className="text-xs text-slate-500">{team.gap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular certs */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Popular certifications</h2>
          <button onClick={() => onNavigate("certifications")} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">VIEW ALL <ArrowUpRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {popularCerts.map(cert => (
            <div key={cert.title} onClick={() => onNavigate("certifications")} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className={cn("flex h-28 items-center justify-center bg-gradient-to-br text-5xl", cert.gradient)}><span>{cert.icon}</span></div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div><h3 className="text-sm font-bold leading-snug text-slate-900">{cert.title}</h3><p className="mt-0.5 text-xs text-slate-500">{cert.subtitle}</p></div>
                  <button onClick={e => { e.stopPropagation(); toggleBookmark(cert.title); }} className="shrink-0 text-slate-300 hover:text-indigo-500"><Bookmark className={cn("h-4 w-4", bookmarked.has(cert.title) && "fill-indigo-500 text-indigo-500")} /></button>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">{cert.level}</span>
                  <div className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-700">{cert.rating}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ongoing paths */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">{view === "employee" ? "Your active paths" : "Team active paths"}</h2>
          <button onClick={() => onNavigate("assessments")} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">VIEW ALL <ArrowUpRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {ongoingPaths.map(path => (
            <div key={path.title} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className={cn("flex h-20 items-center justify-center bg-gradient-to-br text-4xl", path.gradient)}><span>{path.icon}</span></div>
              <div className="p-3">
                <h3 className="text-sm font-bold leading-snug text-slate-900">{path.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{path.subtitle}</p>
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">{path.progress}% complete</span>
                    <span className={cn(path.daysLeft <= 5 ? "text-rose-600" : "text-slate-400")}>{path.daysLeft}d left</span>
                  </div>
                  <Progress value={path.progress} className="mt-1.5 h-1.5" indicatorClassName={path.progress >= 80 ? "bg-emerald-500" : path.progress >= 50 ? "bg-indigo-500" : "bg-amber-500"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── AI Studio Page ───────────────────────────────────────────────────────────

function AIStudioPage({
  view, agentStatuses, chainRunning, insightsLoading,
  learningPath, studyPlan, workIQ,
  assessment, assessmentLoading,
  managerInsights, insightsLoadingProp,
  onRunChain, onRunInsights, onGenerateAssessment,
}: {
  view: "employee" | "manager";
  agentStatuses: Record<string, AgentStatus>;
  chainRunning: boolean;
  insightsLoading: boolean;
  learningPath: LearningPathResult | null;
  studyPlan: StudyPlanResult | null;
  workIQ: WorkIQResult | null;
  assessment: AssessmentResult | null;
  assessmentLoading: boolean;
  managerInsights: ManagerInsightsResult | null;
  insightsLoadingProp: boolean;
  onRunChain: () => void;
  onRunInsights: () => void;
  onGenerateAssessment: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => { setSelected(null); }, [assessment]);
  const q = assessment?.questions?.[0];

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Studio"
        subtitle="Your 7 Azure AI Foundry agents — generate learning paths, study plans, assessments, and insights."
        action={
          <button
            onClick={view === "employee" ? onRunChain : onRunInsights}
            disabled={chainRunning || insightsLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {(chainRunning || insightsLoading) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {view === "employee"
              ? chainRunning ? "Running agents…" : "Generate my learning path"
              : insightsLoading ? "Analyzing…" : "Generate team insights"}
          </button>
        }
      />

      {/* Agent status strip */}
      <div className="flex flex-wrap gap-2">
        {agentDefinitions.map(a => {
          const status = agentStatuses[a.name] ?? "idle";
          return (
            <div key={a.name} className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
              status === "idle" && "border-slate-200 bg-white text-slate-500",
              status === "processing" && "border-indigo-200 bg-indigo-50 text-indigo-700",
              status === "done" && "border-emerald-200 bg-emerald-50 text-emerald-700",
              status === "error" && "border-rose-200 bg-rose-50 text-rose-600",
            )}>
              <a.icon className={cn("h-3.5 w-3.5", a.color)} />
              {a.name}
              {status === "processing" && <Loader2 className="h-3 w-3 animate-spin" />}
              {status === "done" && <CheckCircle className="h-3 w-3 text-emerald-500" />}
              {status === "error" && <AlertCircle className="h-3 w-3 text-rose-500" />}
            </div>
          );
        })}
      </div>

      {/* Employee: learning path results */}
      {view === "employee" && !chainRunning && !learningPath && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Sparkles className="h-8 w-8 text-indigo-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">No learning path generated yet</p>
          <p className="mt-1 text-xs text-slate-400">Click "Generate my learning path" to run all 5 agents in sequence.</p>
        </div>
      )}
      {view === "employee" && learningPath && <LearningPathPanel result={learningPath} studyPlan={studyPlan} workIQ={workIQ} />}

      {/* Manager: insights results */}
      {view === "manager" && !insightsLoadingProp && !managerInsights && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Radar className="h-8 w-8 text-indigo-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">No team insights generated yet</p>
          <p className="mt-1 text-xs text-slate-400">Click "Generate team insights" to analyze team readiness and skill gaps.</p>
        </div>
      )}
      {view === "manager" && insightsLoadingProp && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-5 text-sm text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Manager Insights Agent analyzing team data…
        </div>
      )}
      {view === "manager" && managerInsights && !insightsLoadingProp && (
        <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Radar className="h-4 w-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">AI Manager Insights</h2>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">Forecasted: {managerInsights.forecastedCompletion}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {managerInsights.skillGapSummary?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Skill Gaps</p>
                <div className="space-y-1.5">
                  {managerInsights.skillGapSummary.map((g, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                      <span className="font-medium text-slate-700">{g.skill}</span>
                      <StatusBadge status={g.urgency} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {managerInsights.managerRecommendations?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Recommendations</p>
                <div className="space-y-1.5">
                  {managerInsights.managerRecommendations.map((r, i) => (
                    <div key={i} className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs">
                      <div className="font-semibold text-slate-800">{r.action}</div>
                      <div className="text-slate-500">{r.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Assessment */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">AI Assessment</h2>
            {assessment?.readinessScore && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">Readiness: {assessment.readinessScore}</span>}
          </div>
          <button onClick={() => { setSelected(null); onGenerateAssessment(); }} disabled={assessmentLoading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer">
            {assessmentLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            New question
          </button>
        </div>
        {assessmentLoading && <div className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin text-indigo-500" />Generating from approved sources…</div>}
        {!assessmentLoading && q && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold leading-6 text-slate-900">{q.question}</p>
            <div className="mt-3 space-y-2">
              {q.options?.map((opt, i) => {
                const isCorrect = opt === q.correctAnswer, isSelected = opt === selected;
                return (
                  <button key={i} onClick={() => setSelected(opt)} className={cn("w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors cursor-pointer",
                    !selected && "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50",
                    selected && isCorrect && "border-emerald-300 bg-emerald-50 font-semibold text-emerald-800",
                    selected && isSelected && !isCorrect && "border-rose-300 bg-rose-50 text-rose-800",
                    selected && !isSelected && !isCorrect && "border-slate-100 bg-white opacity-60"
                  )}>{opt}</button>
                );
              })}
            </div>
            {selected && <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-slate-700"><span className="font-semibold text-sky-700">Explanation: </span>{q.explanation}{q.citation && <div className="mt-1 flex items-center gap-1 text-slate-500"><FileSearch className="h-3 w-3" />Source: {q.citation}</div>}</div>}
          </div>
        )}
        {!assessmentLoading && !q && <div className="mt-4 rounded-lg border border-slate-200 bg-white/75 p-4 text-sm text-slate-500">Click "New question" to generate an AI-grounded practice question.</div>}
      </div>

      {/* AI Coach */}
      <CoachingExchange view={view} />
    </div>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

function Sidebar({ currentPage, onPage, view, onView, onUpgrade }: { currentPage: Page; onPage: (p: Page) => void; view: "employee" | "manager"; onView: (v: "employee" | "manager") => void; onUpgrade: () => void }) {
  const nav = view === "employee" ? learnerNav : managerNav;

  const handleViewSwitch = (v: "employee" | "manager") => {
    onView(v);
    // redirect to dashboard if current page isn't in the new nav
    const newNav = v === "employee" ? learnerNav : managerNav;
    if (!newNav.find(n => n.page === currentPage)) onPage("dashboard");
  };

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
          <BrainCircuit className="h-4 w-4" />
        </div>
        <span className="text-base font-bold text-slate-900">CertifyIQ</span>
      </div>

      {/* Learner / Manager tabs */}
      <div className="px-4 mb-2">
        <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-semibold">
          <button
            onClick={() => handleViewSwitch("employee")}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-colors",
              view === "employee"
                ? "bg-indigo-700 text-white"
                : "bg-white text-slate-500 hover:bg-slate-50"
            )}
          >
            <GraduationCap className="h-4 w-4" />
            Learner
          </button>
          <button
            onClick={() => handleViewSwitch("manager")}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 border-l border-slate-200 py-2.5 transition-colors",
              view === "manager"
                ? "bg-indigo-700 text-white border-indigo-700"
                : "bg-white text-slate-500 hover:bg-slate-50"
            )}
          >
            <BriefcaseBusiness className="h-4 w-4" />
            Manager
          </button>
        </div>
      </div>

      {/* Nav label */}
      <p className="px-4 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {view === "employee" ? "Learner Menu" : "Manager Menu"}
      </p>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {nav.map(({ icon: Icon, label, page }) => (
          <button key={page} onClick={() => onPage(page)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              currentPage === page
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}>
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Upgrade card */}
      <div className="m-4 rounded-xl bg-indigo-700 p-4 text-white">
        <Sparkles className="h-5 w-5 text-indigo-200" />
        <p className="mt-2 text-xs font-semibold leading-5 text-indigo-100">Upgrade to Pro for AI coaching, full analytics, and team insights.</p>
        <button onClick={onUpgrade} className="mt-3 w-full rounded-lg bg-white py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 cursor-pointer">Upgrade →</button>
      </div>
    </aside>
  );
}

function TopHeader({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifRead, setNotifRead] = useState(false);

  const notifications = [
    { title: "Assessment ready", desc: "Your AZ-104 practice session is ready.", time: "2 min ago", icon: "📋" },
    { title: "Live session starting", desc: "Azure Security Fundamentals in 30 min.", time: "28 min ago", icon: "🎥" },
    { title: "Milestone reached!", desc: "You completed Identity & Access Management.", time: "1 hr ago", icon: "🏆" },
    { title: "Manager insight", desc: "Weekly readiness digest is available.", time: "3 hr ago", icon: "📊" },
  ];

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      const q = search.toLowerCase();
      if (q.includes("cert") || q.includes("az-") || q.includes("sc-") || q.includes("dp-")) onNavigate("certifications");
      else if (q.includes("learn") || q.includes("user") || q.includes("team member")) onNavigate("learners");
      else if (q.includes("manager") || q.includes("team lead")) onNavigate("managers");
      else if (q.includes("session") || q.includes("live") || q.includes("webinar")) onNavigate("live-sessions");
      else if (q.includes("assess") || q.includes("quiz") || q.includes("test")) onNavigate("assessments");
      else if (q.includes("analytic") || q.includes("report") || q.includes("chart")) onNavigate("analytics");
      else if (q.includes("article") || q.includes("guide") || q.includes("resource")) onNavigate("knowledge-base");
      else if (q.includes("setting") || q.includes("profile") || q.includes("account")) onNavigate("settings");
      setSearch("");
    }
  };
  return (
    <header className={cn("flex h-14 items-center gap-4 border-b px-6 backdrop-blur-sm transition-colors", darkMode ? "border-slate-700 bg-slate-900/90" : "border-slate-200 bg-white/80")}>
      <div className={cn("flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-sm", darkMode ? "border-slate-700 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-400")}>
        <Search className="h-4 w-4 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch} placeholder="Search courses, learners, certifications…" className={cn("flex-1 bg-transparent outline-none placeholder:text-slate-400", darkMode ? "text-slate-200" : "text-slate-700")} />
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />Live
        </span>
        <button
          onClick={() => setDarkMode(d => !d)}
          className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer", darkMode ? "bg-indigo-600 text-white hover:bg-indigo-500" : "text-slate-400 hover:bg-slate-100")}
          aria-label="Toggle dark mode"
        >
          <Moon className="h-4 w-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(n => !n); setNotifRead(true); }}
            className={cn("relative flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer", darkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100")}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {!notifRead && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                <button onClick={() => setShowNotifs(false)} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Close</button>
              </div>
              <div className="divide-y divide-slate-50">
                {notifications.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <span className="text-lg">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500">{n.desc}</p>
                      <p className="mt-1 text-xs text-slate-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 px-4 py-2.5">
                <button onClick={() => setShowNotifs(false)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">Mark all as read</button>
              </div>
            </div>
          )}
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700 text-xs font-bold text-white">AJ</div>
      </div>
    </header>
  );
}

export default function Home() {
  const [view, setView] = useState<"employee" | "manager">("employee");
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [chainRunning, setChainRunning] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPathResult | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlanResult | null>(null);
  const [workIQ, setWorkIQ] = useState<WorkIQResult | null>(null);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [managerInsights, setManagerInsights] = useState<ManagerInsightsResult | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const setAgent = useCallback((name: string, status: AgentStatus) =>
    setAgentStatuses(s => ({ ...s, [name]: status })), []);

  const runEmployeeChain = useCallback(async () => {
    if (chainRunning) return;
    setChainRunning(true);
    setLearningPath(null); setStudyPlan(null); setWorkIQ(null);
    setAgentStatuses({});
    try {
      setAgent("Learning Path Curator", "processing");
      const lp: LearningPathResult = await fetch("/api/learning-path", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "Cloud Operations Engineer", targetCertification: "AZ-104 Azure Administrator", skillsInventory: "Azure basics, networking, storage, some identity management", experienceLevel: "Intermediate (3 years)" }) }).then(r => r.json());
      setLearningPath(lp); setAgent("Learning Path Curator", "done");

      setAgent("Study Plan Generator", "processing");
      const sp: StudyPlanResult = await fetch("/api/study-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ learningPath: lp, targetExamDate: "2025-07-28", weeklyAvailableHours: 3.5, workloadLevel: "Medium" }) }).then(r => r.json());
      setStudyPlan(sp); setAgent("Study Plan Generator", "done");

      setAgent("Work IQ Agent", "processing");
      const wiq: WorkIQResult = await fetch("/api/work-iq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studyPlan: sp, calendarActivity: "High meeting load Mon-Wed, lighter Thu-Fri", meetingLoad: "14 meetings/week", focusTimeSlots: ["Thursday 9-11am", "Friday 2-4pm"] }) }).then(r => r.json());
      setWorkIQ(wiq); setAgent("Work IQ Agent", "done");

      setAgent("Engagement Agent", "processing");
      await fetch("/api/engagement", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ learnerId: "Alex Johnson", studyProgress: 72, completionHistory: "Consistent 14 days", assessmentScores: [78, 82, 85], streakDays: 14 }) });
      setAgent("Engagement Agent", "done");

      setAgent("Progress Intelligence", "processing");
      await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ learnerId: "Alex Johnson", completionPercentage: 72, assessmentHistory: [78, 82, 85], engagementMetrics: { streak: 14, weeklyHours: 3.5 }, targetDate: "2025-07-28" }) });
      setAgent("Progress Intelligence", "done");
    } catch {
      setAgentStatuses(s => { const n = { ...s }; for (const k of Object.keys(n)) if (n[k] === "processing") n[k] = "error"; return n; });
    } finally { setChainRunning(false); }
  }, [chainRunning, setAgent]);

  const runManagerInsights = useCallback(async () => {
    if (insightsLoading) return;
    setInsightsLoading(true); setManagerInsights(null); setAgent("Manager Insights", "processing");
    try {
      const data: ManagerInsightsResult = await fetch("/api/manager-insights", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teamName: "All Teams", teamSize: 24, readinessScore: 76, certificationCoverage: 94, teams }) }).then(r => r.json());
      setManagerInsights(data); setAgent("Manager Insights", "done");
    } catch { setAgent("Manager Insights", "error"); } finally { setInsightsLoading(false); }
  }, [insightsLoading, setAgent]);

  const generateAssessment = useCallback(async () => {
    if (assessmentLoading) return;
    setAssessmentLoading(true); setAgent("Assessment Agent", "processing");
    try {
      const data: AssessmentResult = await fetch("/api/assessment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ certification: "AZ-104 Azure Administrator", domain: "Identity and Access Management", difficulty: "Intermediate", previousResults: [{ score: 78, topic: "Storage" }] }) }).then(r => r.json());
      setAssessment(data); setAgent("Assessment Agent", "done");
    } catch { setAgent("Assessment Agent", "error"); } finally { setAssessmentLoading(false); }
  }, [assessmentLoading, setAgent]);

  // Pages that show the right panel
  const showRightPanel = currentPage === "dashboard" || currentPage === "ai-studio";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      <Sidebar currentPage={currentPage} onPage={setCurrentPage} view={view} onView={setView} onUpgrade={() => setShowUpgrade(true)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className={cn("flex flex-1 gap-5 overflow-y-auto p-5", !showRightPanel && "")}>
          <div className="flex-1 min-w-0">
            {currentPage === "dashboard" && <DashboardPage view={view} onNavigate={setCurrentPage} />}
            {currentPage === "ai-studio" && (
              <AIStudioPage
                view={view} agentStatuses={agentStatuses} chainRunning={chainRunning} insightsLoading={insightsLoading}
                learningPath={learningPath} studyPlan={studyPlan} workIQ={workIQ}
                assessment={assessment} assessmentLoading={assessmentLoading}
                managerInsights={managerInsights} insightsLoadingProp={insightsLoading}
                onRunChain={runEmployeeChain} onRunInsights={runManagerInsights}
                onGenerateAssessment={generateAssessment}
              />
            )}
            {currentPage === "learners" && <LearnersPage />}
            {currentPage === "managers" && <ManagersPage />}
            {currentPage === "certifications" && <CertificationsPage />}
            {currentPage === "live-sessions" && <LiveSessionsPage />}
            {currentPage === "assessments" && <AssessmentsPage assessment={assessment} assessmentLoading={assessmentLoading} onGenerate={generateAssessment} agentStatuses={agentStatuses} />}
            {currentPage === "analytics" && <AnalyticsPage />}
            {currentPage === "knowledge-base" && <KnowledgeBasePage />}
            {currentPage === "settings" && <SettingsPage />}
          </div>
          {showRightPanel && <RightPanel statuses={agentStatuses} view={view} onNavigate={setCurrentPage} />}
        </main>
      </div>
    </div>
  );
}
