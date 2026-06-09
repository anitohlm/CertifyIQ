"use client";

import { useState } from "react";
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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

const navItems = [
  { icon: HomeIcon, label: "Dashboard", active: true },
  { icon: UsersRound, label: "Learners" },
  { icon: BriefcaseBusiness, label: "Managers" },
  { icon: GraduationCap, label: "Certifications" },
  { icon: PlayCircle, label: "Live Sessions" },
  { icon: ClipboardCheck, label: "Assessments" },
  { icon: BarChart3, label: "Analytics" },
  { icon: BookOpen, label: "Knowledge Base" },
  { icon: Settings, label: "Settings" }
];

const agents = [
  { name: "Learning Path Curator", icon: Layers3, status: "Mapping skills to AZ-104", color: "text-indigo-600", bg: "bg-indigo-50" },
  { name: "Study Plan Generator", icon: CalendarClock, status: "Optimizing study windows", color: "text-sky-600", bg: "bg-sky-50" },
  { name: "Engagement Agent", icon: BellRing, status: "Nudging at-risk learners", color: "text-amber-600", bg: "bg-amber-50" },
  { name: "Assessment Agent", icon: ClipboardCheck, status: "Grounding practice checks", color: "text-emerald-600", bg: "bg-emerald-50" },
  { name: "Progress Intelligence", icon: TrendingUp, status: "Forecasting competency growth", color: "text-cyan-600", bg: "bg-cyan-50" }
];

const popularCerts = [
  { title: "Azure Administrator", subtitle: "AZ-104 · Microsoft", level: "Intermediate", enrolled: 142, rating: 4.8, gradient: "from-violet-400 to-indigo-500", icon: "☁️" },
  { title: "Security Compliance", subtitle: "SC-900 · Enterprise", level: "Beginner", enrolled: 98, rating: 4.6, gradient: "from-rose-400 to-pink-500", icon: "🛡️" },
  { title: "Data Analytics", subtitle: "DP-300 · Azure", level: "Advanced", enrolled: 76, rating: 4.9, gradient: "from-amber-400 to-orange-500", icon: "📊" },
  { title: "DevOps Engineer", subtitle: "AZ-400 · DevOps", level: "Advanced", enrolled: 63, rating: 4.7, gradient: "from-teal-400 to-emerald-500", icon: "⚙️" }
];

const ongoingPaths = [
  { title: "Identity & Governance", subtitle: "AZ-104 Module 3", progress: 72, daysLeft: 5, gradient: "from-blue-400 to-indigo-400", icon: "🔐" },
  { title: "Network Security", subtitle: "SC-200 · Section 2", progress: 45, daysLeft: 12, gradient: "from-purple-400 to-violet-500", icon: "🌐" },
  { title: "Cloud Architecture", subtitle: "AZ-305 · Foundation", progress: 88, daysLeft: 2, gradient: "from-sky-400 to-cyan-400", icon: "🏗️" },
  { title: "Compliance Ops", subtitle: "Regulatory · Module 1", progress: 31, daysLeft: 18, gradient: "from-emerald-400 to-green-400", icon: "📋" }
];

const teamAchievements = [
  { name: "Sarah Chen", role: "Cloud Ops", pct: 89, daysLeft: 7, avatar: "SC" },
  { name: "Marcos Lima", role: "Field Eng", pct: 32, daysLeft: 12, avatar: "ML" }
];

const topLearners = [
  { name: "AZ-104 Track", count: "142 learners", rating: 4.8, color: "bg-indigo-500" },
  { name: "SC-900 Track", count: "98 learners", rating: 4.6, color: "bg-rose-500" },
  { name: "DP-300 Track", count: "76 learners", rating: 4.9, color: "bg-amber-500" },
  { name: "AZ-400 Track", count: "63 learners", rating: 4.7, color: "bg-emerald-500" },
  { name: "AZ-305 Track", count: "58 learners", rating: 4.5, color: "bg-cyan-500" }
];

const employeeMetrics = [
  { label: "Readiness", value: "82%", icon: Gauge, tone: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Plan adherence", value: "91%", icon: Target, tone: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Learning streak", value: "14d", icon: Award, tone: "text-amber-600", bg: "bg-amber-50" },
  { label: "Weekly load", value: "3.5h", icon: Timer, tone: "text-sky-600", bg: "bg-sky-50" }
];

const managerMetrics = [
  { label: "Team readiness", value: "76%", icon: UsersRound, tone: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Compliance", value: "94%", icon: ShieldCheck, tone: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Risk cohort", value: "12", icon: AlertTriangle, tone: "text-amber-600", bg: "bg-amber-50" },
  { label: "Forecast", value: "18d", icon: LineChart, tone: "text-sky-600", bg: "bg-sky-50" }
];

const teams = [
  { name: "Cloud Operations", coverage: 88, risk: "Low", gap: "Cost governance" },
  { name: "Customer Success", coverage: 71, risk: "Medium", gap: "Regulatory workflow" },
  { name: "Security Analysts", coverage: 93, risk: "Low", gap: "Incident reporting" },
  { name: "Field Engineering", coverage: 58, risk: "High", gap: "Azure networking" }
];

// ─── Components ──────────────────────────────────────────────────────────────

function Sidebar({ view, onView }: { view: "employee" | "manager"; onView: (v: "employee" | "manager") => void }) {
  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
          <BrainCircuit className="h-4 w-4" aria-hidden />
        </div>
        <span className="text-base font-bold text-slate-900">CertifyIQ</span>
      </div>

      {/* View Toggle */}
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

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </button>
        ))}
      </nav>

      {/* Upgrade */}
      <div className="m-4 rounded-xl bg-indigo-700 p-4 text-white">
        <Sparkles className="h-5 w-5 text-indigo-200" aria-hidden />
        <p className="mt-2 text-xs font-semibold leading-5 text-indigo-100">
          Upgrade to Pro for AI coaching, full analytics, and team insights.
        </p>
        <button className="mt-3 w-full rounded-lg bg-white py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-50">
          Upgrade →
        </button>
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
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Toggle dark mode">
          <Moon className="h-4 w-4" aria-hidden />
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Notifications">
          <Bell className="h-4 w-4" aria-hidden />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700 text-xs font-bold text-white">
          AJ
        </div>
      </div>
    </header>
  );
}

function HeroBanner({ view }: { view: "employee" | "manager" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-6 right-24 h-24 w-24 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute right-10 top-8 text-6xl opacity-70 select-none" aria-hidden>📚</div>
      <div className="pointer-events-none absolute bottom-4 right-40 text-4xl opacity-50 select-none" aria-hidden>🎓</div>

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
          {view === "employee" ? "Personalized Readiness" : "Team Oversight"}
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-snug">
          {view === "employee"
            ? "Hi, Alex 👋  Your next milestone is 18 days away."
            : "Hi, Manager 👋  Team readiness at 76% — 12 at risk."}
        </h1>
        <p className="mt-1.5 max-w-lg text-sm leading-6 text-indigo-100">
          {view === "employee"
            ? "CertifyIQ identified 3 high-quality study windows this week and adjusted your path around delivery milestones."
            : "CertifyIQ surfaces certification risk, coverage gaps, and completion forecasts across all your teams."}
        </p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50">
          {view === "employee" ? "Start studying" : "View full report"}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function MetricsRow({ view }: { view: "employee" | "manager" }) {
  const metrics = view === "employee" ? employeeMetrics : managerMetrics;
  return (
    <div className="grid grid-cols-4 gap-3">
      {metrics.map(({ label, value, icon: Icon, tone, bg }) => (
        <div key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className={cn("inline-flex rounded-lg p-2", bg)}>
            <Icon className={cn("h-4 w-4", tone)} aria-hidden />
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
          <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
        </div>
      ))}
    </div>
  );
}

function CourseCard({
  title, subtitle, level, enrolled, rating, gradient, icon, bookmarked = false
}: typeof popularCerts[0] & { bookmarked?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("flex h-32 items-center justify-center bg-gradient-to-br text-5xl", gradient)}>
        <span role="img">{icon}</span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          </div>
          <button className="shrink-0 text-slate-300 hover:text-indigo-500" aria-label="Bookmark">
            <Bookmark className={cn("h-4 w-4", bookmarked && "fill-indigo-500 text-indigo-500")} aria-hidden />
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
      <div className={cn("flex h-24 items-center justify-center bg-gradient-to-br text-4xl", gradient)}>
        <span role="img">{icon}</span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-slate-900 leading-snug">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">{progress}% complete</span>
            <span className={cn("text-xs font-semibold", daysLeft <= 5 ? "text-rose-600" : "text-slate-400")}>
              {daysLeft}d left
            </span>
          </div>
          <Progress
            value={progress}
            className="mt-1.5 h-1.5"
            indicatorClassName={progress >= 80 ? "bg-emerald-500" : progress >= 50 ? "bg-indigo-500" : "bg-amber-500"}
          />
        </div>
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4">
      {/* Team Achievement */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Team achievement</h2>
          <button className="relative h-8 w-14 rounded-full bg-indigo-600 transition-colors" aria-label="Toggle">
            <span className="absolute right-1 top-1 h-6 w-6 rounded-full bg-white shadow" />
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">Goal achieved success unlocked.</p>
        <div className="mt-4 space-y-3">
          {teamAchievements.map((a) => (
            <div key={a.name} className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {a.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="truncate text-slate-900">{a.name}</span>
                  <span className="shrink-0 text-slate-400">{a.daysLeft} days left</span>
                </div>
                <Progress value={a.pct} className="mt-1.5 h-1.5" indicatorClassName={a.pct >= 70 ? "bg-indigo-500" : "bg-amber-500"} />
                <div className="mt-0.5 text-xs text-slate-400">{a.pct}% achieved</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tracks */}
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
                <div className="text-xs font-bold text-slate-900 truncate">{t.name}</div>
                <div className="text-xs text-slate-500">{t.count}</div>
              </div>
              <button className="shrink-0 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Rail */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Multi-Agent</p>
            <h2 className="text-sm font-bold text-slate-900">Live orchestration</h2>
          </div>
          <Workflow className="h-4 w-4 text-indigo-600" aria-hidden />
        </div>
        <div className="mt-3 space-y-2">
          {agents.map((agent) => (
            <div key={agent.name} className="flex gap-2.5 rounded-lg border border-slate-100 p-2.5">
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", agent.bg)}>
                <agent.icon className={cn("h-3.5 w-3.5", agent.color)} aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{agent.name}</div>
                <div className="mt-0.5 text-xs leading-4 text-slate-400 line-clamp-1">{agent.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ManagerTeamView() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Team Readiness</p>
          <h2 className="text-base font-bold text-slate-900">Certification coverage and risk</h2>
        </div>
        <Button variant="secondary" className="h-8 text-xs">
          <BarChart3 className="h-3.5 w-3.5" aria-hidden />
          Export
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
                <Progress
                  value={team.coverage}
                  className="mt-1 h-1.5"
                  indicatorClassName={team.coverage < 65 ? "bg-rose-500" : team.coverage < 80 ? "bg-amber-500" : "bg-emerald-500"}
                />
              </div>
              <span className={cn("w-fit rounded-full px-2 py-0.5 text-xs font-bold",
                team.risk === "High" && "bg-rose-100 text-rose-700",
                team.risk === "Medium" && "bg-amber-100 text-amber-700",
                team.risk === "Low" && "bg-emerald-100 text-emerald-700"
              )}>
                {team.risk}
              </span>
              <span className="text-xs text-slate-500">{team.gap}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MainContent({ view }: { view: "employee" | "manager" }) {
  return (
    <div className="flex-1 space-y-5">
      <HeroBanner view={view} />
      <MetricsRow view={view} />

      {view === "manager" && <ManagerTeamView />}

      {/* Popular Certifications */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Popular certifications</h2>
          <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            VIEW ALL <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {popularCerts.map((cert) => <CourseCard key={cert.title} {...cert} />)}
        </div>
      </div>

      {/* Ongoing Paths */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {view === "employee" ? "Your active paths" : "Team active paths"}
          </h2>
          <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            VIEW ALL <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {ongoingPaths.map((path) => <OngoingCard key={path.title} {...path} />)}
        </div>
      </div>

      {/* AI Coaching Exchange */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" aria-hidden />
          <h2 className="text-sm font-bold text-slate-900">AI coaching exchange</h2>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-100 p-3.5 text-sm leading-6 text-slate-700">
            I have only three hours this week. What should I study first?
          </div>
          <div className="rounded-lg bg-indigo-700 p-3.5 text-sm leading-6 text-white">
            Focus on identity governance — your assessment history shows the fastest readiness gain there. Thursday has a 70-minute window.
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm leading-6 text-slate-700">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              Manager note
            </div>
            <p className="mt-1">Learner remains on track for the June 28 target with medium schedule risk.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────

export default function Home() {
  const [view, setView] = useState<"employee" | "manager">("employee");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar view={view} onView={setView} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader />
        <main className="flex flex-1 gap-5 overflow-y-auto p-5">
          <MainContent view={view} />
          <RightPanel />
        </main>
      </div>
    </div>
  );
}
