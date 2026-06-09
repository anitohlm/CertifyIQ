"use client";

import { useState } from "react";
import { Play, CheckCircle2, XCircle, Clock, Target, TrendingUp, Award, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const history = [
  { id: 1, cert: "AZ-104", domain: "Identity & Access Management", score: 88, status: "Passed", date: "Jun 8, 2026", questions: 25, duration: "22 min" },
  { id: 2, cert: "AZ-104", domain: "Storage Solutions", score: 72, status: "Passed", date: "Jun 6, 2026", questions: 20, duration: "18 min" },
  { id: 3, cert: "AZ-104", domain: "Virtual Networks", score: 56, status: "Failed", date: "Jun 4, 2026", questions: 20, duration: "25 min" },
  { id: 4, cert: "SC-900", domain: "Security Concepts", score: 91, status: "Passed", date: "Jun 2, 2026", questions: 15, duration: "14 min" },
  { id: 5, cert: "AZ-104", domain: "Compute Resources", score: 80, status: "Passed", date: "May 30, 2026", questions: 25, duration: "20 min" },
];

const domains = [
  { name: "Identity & Access Management", cert: "AZ-104", mastery: 88, questions: 245 },
  { name: "Storage Solutions", cert: "AZ-104", mastery: 72, questions: 180 },
  { name: "Virtual Networks", cert: "AZ-104", mastery: 56, questions: 210 },
  { name: "Compute Resources", cert: "AZ-104", mastery: 80, questions: 195 },
  { name: "Security Concepts", cert: "SC-900", mastery: 91, questions: 120 },
];

export default function AssessmentsPage() {
  const [starting, setStarting] = useState<string | null>(null);

  const handleStart = (domain: string) => {
    setStarting(domain);
    setTimeout(() => setStarting(null), 2000);
  };

  const avg = Math.round(history.reduce((s, h) => s + h.score, 0) / history.length);
  const passed = history.filter(h => h.status === "Passed").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Assessments</h1>
        <p className="mt-0.5 text-sm text-slate-500">Practice questions and track your domain mastery.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Assessments taken", value: history.length, icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Average score", value: `${avg}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pass rate", value: `${Math.round((passed / history.length) * 100)}%`, icon: CheckCircle2, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "Badges earned", value: 3, icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
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

      <div className="grid grid-cols-[1fr_1.5fr] gap-4">
        {/* Domain mastery */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">Domain Mastery</h2>
          <div className="space-y-4">
            {domains.map(d => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-slate-700">{d.name}</span>
                    <span className="ml-2 text-slate-400">{d.cert}</span>
                  </div>
                  <span className={cn("font-bold", d.mastery >= 80 ? "text-emerald-600" : d.mastery >= 60 ? "text-amber-600" : "text-rose-600")}>{d.mastery}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", d.mastery >= 80 ? "bg-emerald-500" : d.mastery >= 60 ? "bg-amber-500" : "bg-rose-500")}
                    style={{ width: `${d.mastery}%` }}
                  />
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{d.questions} questions in bank</span>
                  <button
                    onClick={() => handleStart(d.name)}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold transition-colors",
                      starting === d.name
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    )}
                  >
                    {starting === d.name ? <><CheckCircle2 className="h-3 w-3" />Starting…</> : <><Play className="h-3 w-3" />Practice</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5">
            <h2 className="text-sm font-bold text-slate-900">Assessment History</h2>
            <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors">
              <Play className="h-3 w-3" /> New Assessment
            </button>
          </div>
          <div className="grid grid-cols-[1fr_0.6fr_0.6fr_0.5fr_auto] items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-400">
            <span>Domain</span><span>Score</span><span>Date</span><span>Time</span><span />
          </div>
          {history.map(item => (
            <div key={item.id} className="grid grid-cols-[1fr_0.6fr_0.6fr_0.5fr_auto] items-center gap-2 border-t border-slate-100 px-5 py-3.5 hover:bg-slate-50/50">
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.domain}</div>
                <div className="text-xs text-slate-400">{item.cert} · {item.questions} questions</div>
              </div>
              <div className="flex items-center gap-1.5">
                {item.status === "Passed"
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  : <XCircle className="h-3.5 w-3.5 text-rose-500" />
                }
                <span className={cn("text-sm font-bold", item.status === "Passed" ? "text-emerald-600" : "text-rose-600")}>{item.score}%</span>
              </div>
              <span className="text-xs text-slate-500">{item.date}</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3 w-3" />{item.duration}</span>
              <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <RotateCcw className="h-3 w-3" /> Retry
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
