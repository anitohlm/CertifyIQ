"use client";

import { useState } from "react";
import { TrendingUp, Users, ShieldCheck, Award, BarChart3, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const teamReadiness = [
  { team: "Security Analysts", pct: 93, color: "bg-emerald-500" },
  { team: "Cloud Operations", pct: 88, color: "bg-indigo-500" },
  { team: "Customer Success", pct: 71, color: "bg-sky-500" },
  { team: "Field Engineering", pct: 58, color: "bg-amber-500" },
  { team: "Data Engineering", pct: 46, color: "bg-rose-500" },
];

const monthlyData = [
  { month: "Jan", completions: 4, enrollments: 12 },
  { month: "Feb", completions: 7, enrollments: 18 },
  { month: "Mar", completions: 5, enrollments: 15 },
  { month: "Apr", completions: 11, enrollments: 22 },
  { month: "May", completions: 9, enrollments: 19 },
  { month: "Jun", completions: 14, enrollments: 26 },
];

const certDistribution = [
  { cert: "AZ-104", count: 42, color: "bg-indigo-500" },
  { cert: "SC-900", count: 31, color: "bg-rose-500" },
  { cert: "DP-300", count: 18, color: "bg-amber-500" },
  { cert: "AZ-400", count: 15, color: "bg-emerald-500" },
  { cert: "AZ-305", count: 12, color: "bg-sky-500" },
  { cert: "Other", count: 9, color: "bg-slate-400" },
];

const total = certDistribution.reduce((s, c) => s + c.count, 0);

type Period = "7d" | "30d" | "90d";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const maxCompletions = Math.max(...monthlyData.map(d => d.completions));
  const maxEnrollments = Math.max(...monthlyData.map(d => d.enrollments));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
          <p className="mt-0.5 text-sm text-slate-500">Workforce readiness trends and certification metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden text-xs font-medium">
            {(["7d","30d","90d"] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={cn("px-3 py-2 transition-colors", period === p ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50")}>{p}</button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Org readiness", value: "76%", change: "+4%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active learners", value: "87", change: "+12", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Compliance coverage", value: "94%", change: "+2%", icon: ShieldCheck, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "Certs earned this month", value: "14", change: "+5", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={cn("rounded-lg p-2", kpi.bg)}>
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">{kpi.change}</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{kpi.value}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-4">
        {/* Team readiness bar chart */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Team Readiness</h2>
            <BarChart3 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 space-y-3">
            {teamReadiness.map(t => (
              <div key={t.team}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate max-w-[140px]">{t.team}</span>
                  <span className="font-bold text-slate-900 ml-2">{t.pct}%</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full transition-all duration-700", t.color)} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />≥80% Good</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />60–79% Fair</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" />&lt;60% At Risk</span>
          </div>
        </div>

        {/* Monthly completions bar chart */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Monthly Completions vs Enrollments</h2>
          </div>
          <div className="mt-4 flex items-end gap-3 h-36">
            {monthlyData.map(d => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end gap-0.5">
                  <div
                    className="flex-1 rounded-t bg-indigo-500 transition-all duration-700"
                    style={{ height: `${(d.completions / maxEnrollments) * 110}px` }}
                    title={`Completions: ${d.completions}`}
                  />
                  <div
                    className="flex-1 rounded-t bg-indigo-200 transition-all duration-700"
                    style={{ height: `${(d.enrollments / maxEnrollments) * 110}px` }}
                    title={`Enrollments: ${d.enrollments}`}
                  />
                </div>
                <span className="text-xs text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />Completions</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-indigo-200" />Enrollments</span>
          </div>
        </div>
      </div>

      {/* Cert distribution */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">Certification Distribution</h2>
        <div className="mt-4 flex items-center gap-6">
          {/* Segmented bar */}
          <div className="flex-1">
            <div className="flex h-4 overflow-hidden rounded-full">
              {certDistribution.map(c => (
                <div key={c.cert} className={cn("transition-all", c.color)} style={{ width: `${(c.count / total) * 100}%` }} title={`${c.cert}: ${c.count}`} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {certDistribution.map(c => (
                <div key={c.cert} className="flex items-center gap-1.5 text-xs">
                  <span className={cn("h-2.5 w-2.5 rounded-full", c.color)} />
                  <span className="font-medium text-slate-700">{c.cert}</span>
                  <span className="text-slate-400">{c.count} · {Math.round((c.count / total) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
          {/* Total */}
          <div className="shrink-0 text-center">
            <div className="text-3xl font-bold text-slate-900">{total}</div>
            <div className="text-xs text-slate-500 mt-0.5">Active enrollments</div>
          </div>
        </div>
      </div>
    </div>
  );
}
