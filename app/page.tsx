"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  BarChart3,
  BellRing,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  Gauge,
  GraduationCap,
  Layers3,
  LineChart,
  LockKeyhole,
  Network,
  PlayCircle,
  Radar,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  UsersRound,
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const agents = [
  {
    name: "Learning Path Curator",
    icon: Layers3,
    status: "Mapping role skills to AZ-104 and internal cloud standards",
    color: "text-indigo-700"
  },
  {
    name: "Study Plan Generator",
    icon: CalendarClock,
    status: "Optimizing study windows around delivery milestones",
    color: "text-sky-700"
  },
  {
    name: "Engagement Agent",
    icon: BellRing,
    status: "Nudging two learners before readiness drops",
    color: "text-amber-700"
  },
  {
    name: "Assessment Agent",
    icon: ClipboardCheck,
    status: "Grounding practice checks in approved source material",
    color: "text-emerald-700"
  },
  {
    name: "Progress Intelligence",
    icon: TrendingUp,
    status: "Forecasting competency growth across priority roles",
    color: "text-cyan-700"
  },
  {
    name: "Manager Insights",
    icon: Radar,
    status: "Surfacing certification risk and coverage gaps",
    color: "text-rose-700"
  }
];

const employeeMetrics = [
  { label: "Readiness", value: "82%", icon: Gauge, tone: "text-emerald-700" },
  { label: "Plan adherence", value: "91%", icon: Target, tone: "text-indigo-700" },
  { label: "Learning streak", value: "14d", icon: Award, tone: "text-amber-700" },
  { label: "Weekly load", value: "3.5h", icon: Timer, tone: "text-sky-700" }
];

const managerMetrics = [
  { label: "Team readiness", value: "76%", icon: UsersRound, tone: "text-indigo-700" },
  { label: "Compliance coverage", value: "94%", icon: ShieldCheck, tone: "text-emerald-700" },
  { label: "Risk cohort", value: "12", icon: AlertTriangle, tone: "text-amber-700" },
  { label: "Forecast completion", value: "18d", icon: LineChart, tone: "text-sky-700" }
];

const studyPlan = [
  {
    day: "Today",
    title: "Identity and governance review",
    detail: "45 minutes from approved AZ-104 module and internal access policy",
    status: "Ready"
  },
  {
    day: "Wed",
    title: "Scenario practice",
    detail: "Adaptive lab focused on RBAC, Entra ID, and policy exceptions",
    status: "Scheduled"
  },
  {
    day: "Fri",
    title: "Readiness pulse",
    detail: "Cited 12-question assessment with knowledge-gap scoring",
    status: "Assessment"
  }
];

const teams = [
  { name: "Cloud Operations", coverage: 88, risk: "Low", gap: "Cost governance" },
  { name: "Customer Success", coverage: 71, risk: "Medium", gap: "Regulatory workflow" },
  { name: "Security Analysts", coverage: 93, risk: "Low", gap: "Incident reporting" },
  { name: "Field Engineering", coverage: 58, risk: "High", gap: "Azure networking" }
];

const capabilities = [
  ["Role intelligence", "Maps certifications, compliance rules, and internal standards to each role."],
  ["Adaptive planning", "Balances workload, calendar windows, deadlines, and historical study behavior."],
  ["Grounded assessment", "Creates practice checks from approved repositories with source citations."],
  ["Manager visibility", "Highlights readiness, gaps, risks, and completion forecasts for leaders."]
];

function MetricCard({
  label,
  value,
  icon: Icon,
  tone
}: {
  label: string;
  value: string;
  icon: typeof Gauge;
  tone: string;
}) {
  return (
    <Card className="min-h-32">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-slate-100 p-2">
          <Icon className={cn("h-5 w-5", tone)} aria-hidden />
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden />
      </div>
      <div className="mt-5 text-3xl font-bold tracking-normal text-slate-950">{value}</div>
      <div className="mt-1 text-sm font-medium text-slate-500">{label}</div>
    </Card>
  );
}

function AgentRail() {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-sky-700">
            Multi-Agent Workflow
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Live orchestration</h2>
        </div>
        <Workflow className="h-5 w-5 text-indigo-700" aria-hidden />
      </div>
      <div className="mt-5 space-y-3">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="flex gap-3 rounded-lg border border-slate-200 bg-white/70 p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <agent.icon className={cn("h-5 w-5", agent.color)} aria-hidden />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-950">{agent.name}</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">{agent.status}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EmployeeView() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="grid metric-grid gap-4">
          {employeeMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">
                Personalized Learning Journey
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Azure Administrator readiness path
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Work IQ identified three high-quality learning windows this week and
                adjusted the schedule around customer escalation coverage.
              </p>
            </div>
            <Button>
              <PlayCircle className="h-4 w-4" aria-hidden />
              Start next action
            </Button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {studyPlan.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-indigo-700">{item.day}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex items-center gap-3">
              <SearchCheck className="h-5 w-5 text-sky-700" aria-hidden />
              <h2 className="text-xl font-bold text-slate-950">Grounded assessment</h2>
            </div>
            <div className="mt-5 rounded-lg border border-slate-200 bg-white/75 p-4">
              <p className="text-sm font-semibold text-slate-500">Practice question</p>
              <p className="mt-2 text-base font-semibold leading-7 text-slate-950">
                Which access model best satisfies least privilege for temporary
                production troubleshooting?
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                  Just-in-time elevation with approval and expiration
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-3">
                  Permanent contributor assignment at subscription scope
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <FileSearch className="h-4 w-4" aria-hidden />
                Sources: Internal Access Policy v4, AZ-104 Identity Module
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-indigo-700" aria-hidden />
              <h2 className="text-xl font-bold text-slate-950">Next development path</h2>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Cloud governance</span>
                  <span>86%</span>
                </div>
                <Progress value={86} className="mt-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Networking fundamentals</span>
                  <span>64%</span>
                </div>
                <Progress value={64} className="mt-2" indicatorClassName="bg-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Incident readiness</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="mt-2" indicatorClassName="bg-sky-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <AgentRail />
    </div>
  );
}

function ManagerView() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="grid metric-grid gap-4">
          {managerMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-indigo-700">
                Team Readiness Dashboard
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Certification coverage and capability risk
              </h2>
            </div>
            <Button variant="secondary">
              <BarChart3 className="h-4 w-4" aria-hidden />
              Export insight pack
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr] bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-normal text-slate-500">
                <span>Team</span>
                <span>Coverage</span>
                <span>Risk</span>
                <span>Skill gap</span>
              </div>
              {teams.map((team) => (
                <div
                  key={team.name}
                  className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr] items-center border-t border-slate-200 bg-white/70 px-4 py-4 text-sm"
                >
                  <span className="font-bold text-slate-950">{team.name}</span>
                  <div className="pr-6">
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>{team.coverage}%</span>
                    </div>
                    <Progress
                      value={team.coverage}
                      className="mt-2"
                      indicatorClassName={team.coverage < 65 ? "bg-rose-600" : team.coverage < 80 ? "bg-amber-500" : "bg-emerald-500"}
                    />
                  </div>
                  <span
                    className={cn(
                      "w-fit rounded-full px-2.5 py-1 text-xs font-bold",
                      team.risk === "High" && "bg-rose-100 text-rose-700",
                      team.risk === "Medium" && "bg-amber-100 text-amber-700",
                      team.risk === "Low" && "bg-emerald-100 text-emerald-700"
                    )}
                  >
                    {team.risk}
                  </span>
                  <span className="font-medium text-slate-600">{team.gap}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <Network className="h-5 w-5 text-sky-700" aria-hidden />
              <h2 className="text-xl font-bold text-slate-950">Coverage matrix</h2>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {Array.from({ length: 24 }).map((_, index) => {
                const tone =
                  index % 7 === 0
                    ? "bg-rose-500"
                    : index % 5 === 0
                      ? "bg-amber-400"
                      : index % 3 === 0
                        ? "bg-sky-500"
                        : "bg-emerald-500";
                return (
                  <div
                    key={index}
                    className={cn("h-10 rounded-md shadow-sm", tone)}
                    title={`Coverage cell ${index + 1}`}
                  />
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-5 w-5 text-indigo-700" aria-hidden />
              <h2 className="text-xl font-bold text-slate-950">Strategic recommendation</h2>
            </div>
            <div className="mt-5 rounded-lg border border-sky-200 bg-sky-50 p-4">
              <p className="text-sm leading-6 text-slate-700">
                Prioritize Azure networking pathway for Field Engineering. The
                forecast shows a 23% improvement in deployment readiness if six
                learners complete the accelerated track within 30 days.
              </p>
              <Button className="mt-4" variant="secondary">
                Create cohort plan
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <AgentRail />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 lg:px-8">
        <header className="flex flex-col gap-5 rounded-lg border border-white/70 bg-white/60 p-5 shadow-glass backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-700 text-white shadow-lg shadow-indigo-700/20">
              <BrainCircuit className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-normal text-slate-950">
                  CertifyIQ
                </h1>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  Workforce readiness intelligence
                </span>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                AI-powered certification, compliance, and capability development
                for employees, managers, and workforce planning leaders.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">
              <LockKeyhole className="h-4 w-4" aria-hidden />
              Entra RBAC
            </Button>
            <Button>
              <Sparkles className="h-4 w-4" aria-hidden />
              Ask CertifyIQ
            </Button>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden p-0">
            <div className="grid min-h-72 gap-6 p-6 lg:grid-cols-[1fr_300px]">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-normal text-sky-700">
                    Modern Enterprise Intelligence
                  </p>
                  <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal text-slate-950">
                    See who is ready, who is at risk, and what each learner should do next.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    CertifyIQ combines Azure AI Foundry agents, Azure OpenAI,
                    Work IQ signals, RAG grounding, and manager analytics to make
                    workforce readiness visible and actionable.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {capabilities.map(([title, text]) => (
                    <div key={title} className="rounded-lg border border-slate-200 bg-white/70 p-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                      <h3 className="mt-3 text-sm font-bold text-slate-950">{title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">AI readiness pulse</span>
                  <Sparkles className="h-4 w-4 text-sky-300" aria-hidden />
                </div>
                <div className="mt-6 text-5xl font-bold">76%</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Organization-wide forecasted certification readiness across
                  active initiatives.
                </p>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Compliance</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="mt-2 bg-slate-800" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Certification</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="mt-2 bg-slate-800" indicatorClassName="bg-sky-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>Skills coverage</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="mt-2 bg-slate-800" indicatorClassName="bg-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-indigo-700" aria-hidden />
              <h2 className="text-xl font-bold text-slate-950">AI coaching exchange</h2>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-lg bg-slate-100 p-4 text-sm leading-6 text-slate-700">
                I have only three hours this week. What should I study first?
              </div>
              <div className="rounded-lg bg-indigo-700 p-4 text-sm leading-6 text-white">
                Focus on identity governance and access policy scenarios. Your
                assessment history shows the fastest readiness gain there, and
                Thursday has a 70-minute learning window.
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
                Manager note: learner remains on track for the June 28 certification
                target with medium schedule risk.
              </div>
            </div>
          </Card>
        </section>

        <Tabs defaultValue="employee">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <TabsList>
              <TabsTrigger value="employee">Employee View</TabsTrigger>
              <TabsTrigger value="manager">Manager View</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
              Grounded by Azure AI Search, Cosmos DB, Blob Storage, and approved repositories
            </div>
          </div>
          <TabsContent value="employee">
            <EmployeeView />
          </TabsContent>
          <TabsContent value="manager">
            <ManagerView />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
