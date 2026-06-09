"use client";

import { useState } from "react";
import { Search, Users, TrendingUp, ShieldCheck, ArrowUpRight, ChevronDown, ChevronUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const managers = [
  {
    id: 1, name: "Diana Reyes", initials: "DR", role: "Cloud Ops Manager", avatar: "bg-indigo-500",
    teamSize: 8, readiness: 84, compliance: 96,
    team: [
      { name: "Alex Johnson", cert: "AZ-104", readiness: 82 },
      { name: "Clara Bautista", cert: "AZ-104", readiness: 29 },
      { name: "Tom Nguyen", cert: "SC-200", readiness: 67 },
    ]
  },
  {
    id: 2, name: "Marcus Webb", initials: "MW", role: "Security Manager", avatar: "bg-rose-500",
    teamSize: 6, readiness: 91, compliance: 100,
    team: [
      { name: "Sarah Chen", cert: "SC-900", readiness: 89 },
      { name: "Ryan Park", cert: "AZ-305", readiness: 44 },
      { name: "Lena Schmidt", cert: "SC-900", readiness: 58 },
    ]
  },
  {
    id: 3, name: "Fatima Al-Amin", initials: "FA", role: "Data Engineering Lead", avatar: "bg-amber-500",
    teamSize: 5, readiness: 68, compliance: 80,
    team: [
      { name: "Priya Nair", cert: "DP-300", readiness: 71 },
      { name: "James Okafor", cert: "AZ-400", readiness: 95 },
    ]
  },
  {
    id: 4, name: "Leo Ostrowski", initials: "LO", role: "Field Engineering Manager", avatar: "bg-emerald-500",
    teamSize: 10, readiness: 52, compliance: 72,
    team: [
      { name: "Marcos Lima", cert: "AZ-104", readiness: 32 },
      { name: "Amara Diallo", cert: "SC-900", readiness: 100 },
    ]
  },
];

export default function ManagersPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const filtered = managers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const orgAvgReadiness = Math.round(managers.reduce((s, m) => s + m.readiness, 0) / managers.length);
  const orgAvgCompliance = Math.round(managers.reduce((s, m) => s + m.compliance, 0) / managers.length);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Managers</h1>
        <p className="mt-0.5 text-sm text-slate-500">Track manager-led team readiness and compliance coverage.</p>
      </div>

      {/* Org-level stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total managers", value: managers.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Total direct reports", value: managers.reduce((s, m) => s + m.teamSize, 0), icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "Org avg readiness", value: `${orgAvgReadiness}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg compliance", value: `${orgAvgCompliance}%`, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className={cn("inline-flex rounded-lg p-2", s.bg)}>
              <s.icon className={cn("h-4 w-4", s.color)} />
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search managers…" className="flex-1 outline-none placeholder:text-slate-400" />
      </div>

      {/* Manager cards */}
      <div className="space-y-2.5">
        {filtered.map(mgr => (
          <div key={mgr.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-4 px-5 py-4">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white", mgr.avatar)}>
                {mgr.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{mgr.name}</h3>
                    <p className="text-xs text-slate-500">{mgr.role} · {mgr.teamSize} reports</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 mb-1">Team Readiness</div>
                      <div className="flex items-center gap-2">
                        <Progress value={mgr.readiness} className="w-24 h-1.5" indicatorClassName={mgr.readiness >= 80 ? "bg-emerald-500" : mgr.readiness >= 60 ? "bg-amber-500" : "bg-rose-500"} />
                        <span className={cn("text-xs font-bold", mgr.readiness >= 80 ? "text-emerald-600" : mgr.readiness >= 60 ? "text-amber-600" : "text-rose-600")}>{mgr.readiness}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 mb-1">Compliance</div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className={cn("h-3.5 w-3.5", mgr.compliance === 100 ? "text-emerald-500" : "text-amber-500")} />
                        <span className="text-xs font-bold text-slate-700">{mgr.compliance}%</span>
                      </div>
                    </div>
                    <button onClick={() => toggle(mgr.id)} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      Team {expanded.has(mgr.id) ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <button className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors">
                      Insights <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Expanded team */}
            {expanded.has(mgr.id) && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Team members (sample)</p>
                <div className="grid grid-cols-3 gap-2">
                  {mgr.team.map((member, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.cert}</p>
                      </div>
                      <span className={cn("text-xs font-bold", member.readiness >= 80 ? "text-emerald-600" : member.readiness >= 60 ? "text-amber-600" : "text-rose-600")}>
                        {member.readiness}%
                      </span>
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
