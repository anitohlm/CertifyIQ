"use client";

import { useState } from "react";
import { Search, Filter, ArrowUpRight, ChevronUp, ChevronDown, Award, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const learners = [
  { id: 1, name: "Alex Johnson", initials: "AJ", role: "Cloud Ops Engineer", cert: "AZ-104", readiness: 82, streak: 14, risk: "Low", status: "Active", lastActive: "Today" },
  { id: 2, name: "Sarah Chen", initials: "SC", role: "Security Analyst", cert: "SC-900", readiness: 89, streak: 21, risk: "Low", status: "Active", lastActive: "Today" },
  { id: 3, name: "Marcos Lima", initials: "ML", role: "Field Engineer", cert: "AZ-104", readiness: 32, streak: 0, risk: "High", status: "At Risk", lastActive: "5 days ago" },
  { id: 4, name: "Priya Nair", initials: "PN", role: "Data Engineer", cert: "DP-300", readiness: 71, streak: 7, risk: "Medium", status: "Active", lastActive: "Yesterday" },
  { id: 5, name: "James Okafor", initials: "JO", role: "DevOps Engineer", cert: "AZ-400", readiness: 95, streak: 30, risk: "Low", status: "Completed", lastActive: "Today" },
  { id: 6, name: "Lena Schmidt", initials: "LS", role: "Customer Success", cert: "SC-900", readiness: 58, streak: 3, risk: "Medium", status: "Active", lastActive: "2 days ago" },
  { id: 7, name: "Ryan Park", initials: "RP", role: "Cloud Architect", cert: "AZ-305", readiness: 44, streak: 0, risk: "High", status: "At Risk", lastActive: "8 days ago" },
  { id: 8, name: "Amara Diallo", initials: "AD", role: "Compliance Officer", cert: "SC-900", readiness: 100, streak: 45, risk: "Low", status: "Completed", lastActive: "Today" },
  { id: 9, name: "Tom Nguyen", initials: "TN", role: "Security Analyst", cert: "SC-200", readiness: 67, streak: 5, risk: "Medium", status: "Active", lastActive: "Yesterday" },
  { id: 10, name: "Clara Bautista", initials: "CB", role: "Cloud Ops Engineer", cert: "AZ-104", readiness: 29, streak: 0, risk: "High", status: "At Risk", lastActive: "11 days ago" },
];

const avatarColors = ["bg-indigo-500","bg-violet-500","bg-sky-500","bg-emerald-500","bg-rose-500","bg-amber-500","bg-cyan-500","bg-pink-500","bg-teal-500","bg-orange-500"];

type FilterType = "All" | "Active" | "At Risk" | "Completed";

export default function LearnersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [sortBy, setSortBy] = useState<"name" | "readiness" | "streak">("readiness");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = learners
    .filter(l => filter === "All" || l.status === filter)
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.role.toLowerCase().includes(search.toLowerCase()) || l.cert.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") return mul * a.name.localeCompare(b.name);
      if (sortBy === "readiness") return mul * (a.readiness - b.readiness);
      return mul * (a.streak - b.streak);
    });

  const stats = [
    { label: "Total learners", value: learners.length, icon: "👥", color: "bg-indigo-50 text-indigo-700" },
    { label: "Active", value: learners.filter(l => l.status === "Active").length, icon: "✅", color: "bg-emerald-50 text-emerald-700" },
    { label: "At risk", value: learners.filter(l => l.status === "At Risk").length, icon: "⚠️", color: "bg-rose-50 text-rose-700" },
    { label: "Completed", value: learners.filter(l => l.status === "Completed").length, icon: "🏆", color: "bg-amber-50 text-amber-700" },
  ];

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Learners</h1>
        <p className="mt-0.5 text-sm text-slate-500">Track certification progress across your workforce.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className={cn("inline-flex rounded-lg px-2 py-1 text-lg", s.color)}>{s.icon}</div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role, or cert…" className="flex-1 outline-none placeholder:text-slate-400" />
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden text-sm font-medium">
          {(["All","Active","At Risk","Completed"] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-2 transition-colors", filter === f ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1.2fr_0.8fr_0.8fr_auto] items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          <button onClick={() => toggleSort("name")} className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
            Learner {sortBy === "name" ? (sortDir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />) : null}
          </button>
          <span>Target cert</span>
          <button onClick={() => toggleSort("readiness")} className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
            Readiness {sortBy === "readiness" ? (sortDir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />) : null}
          </button>
          <span>Last active</span>
          <button onClick={() => toggleSort("streak")} className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
            Streak {sortBy === "streak" ? (sortDir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />) : null}
          </button>
          <span>Risk</span>
          <span>Action</span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Search className="h-8 w-8 mb-3 opacity-40" />
            <p className="text-sm font-medium">No learners match your filters</p>
            <button onClick={() => { setSearch(""); setFilter("All"); }} className="mt-2 text-xs text-indigo-600 hover:underline">Clear filters</button>
          </div>
        ) : filtered.map((l, i) => (
          <div key={l.id} className={cn("grid grid-cols-[2fr_1.2fr_1fr_1.2fr_0.8fr_0.8fr_auto] items-center gap-2 border-t border-slate-100 px-5 py-3.5 transition-colors hover:bg-slate-50/50", i % 2 === 0 ? "" : "")}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white", avatarColors[i % avatarColors.length])}>
                {l.initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{l.name}</div>
                <div className="truncate text-xs text-slate-500">{l.role}</div>
              </div>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 w-fit">{l.cert}</span>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={l.readiness >= 80 ? "text-emerald-600" : l.readiness >= 50 ? "text-amber-600" : "text-rose-600"}>{l.readiness}%</span>
              </div>
              <Progress value={l.readiness} className="mt-1 h-1.5" indicatorClassName={l.readiness >= 80 ? "bg-emerald-500" : l.readiness >= 50 ? "bg-amber-500" : "bg-rose-500"} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {l.lastActive}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
              <Award className="h-3.5 w-3.5" />
              {l.streak}d
            </div>
            <span className={cn("w-fit rounded-full px-2 py-0.5 text-xs font-bold",
              l.risk === "High" ? "bg-rose-100 text-rose-700" :
              l.risk === "Medium" ? "bg-amber-100 text-amber-700" :
              "bg-emerald-100 text-emerald-700"
            )}>{l.risk}</span>
            <button className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 cursor-pointer">
              View <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-right">Showing {filtered.length} of {learners.length} learners</p>
    </div>
  );
}
