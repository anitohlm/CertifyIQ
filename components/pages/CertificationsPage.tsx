"use client";

import { useState } from "react";
import { Search, Star, Bookmark, Users, Clock, ChevronRight, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Category = "All" | "Azure" | "Security" | "Data & AI" | "DevOps";

const certs = [
  { id: 1, title: "Azure Administrator", code: "AZ-104", provider: "Microsoft", category: "Azure", level: "Intermediate", duration: "40h", enrolled: 142, rating: 4.8, progress: 72, gradient: "from-violet-400 to-indigo-500", icon: "☁️", description: "Manage Azure subscriptions, implement storage, deploy virtual networks, and manage Azure identities." },
  { id: 2, title: "Security Compliance", code: "SC-900", provider: "Microsoft", category: "Security", level: "Beginner", duration: "20h", enrolled: 98, rating: 4.6, progress: 0, gradient: "from-rose-400 to-pink-500", icon: "🛡️", description: "Understand security, compliance, and identity concepts across Microsoft cloud services." },
  { id: 3, title: "Azure Data Engineer", code: "DP-300", provider: "Microsoft", category: "Data & AI", level: "Advanced", duration: "55h", enrolled: 76, rating: 4.9, progress: 45, gradient: "from-amber-400 to-orange-500", icon: "📊", description: "Design and implement data management, monitoring, security and privacy solutions using Azure data services." },
  { id: 4, title: "DevOps Engineer Expert", code: "AZ-400", provider: "Microsoft", category: "DevOps", level: "Advanced", duration: "60h", enrolled: 63, rating: 4.7, progress: 0, gradient: "from-teal-400 to-emerald-500", icon: "⚙️", description: "Design and implement DevOps practices for version control, compliance, infrastructure, and more." },
  { id: 5, title: "Azure Solutions Architect", code: "AZ-305", provider: "Microsoft", category: "Azure", level: "Expert", duration: "70h", enrolled: 58, rating: 4.5, progress: 88, gradient: "from-sky-400 to-cyan-400", icon: "🏗️", description: "Design solutions that run on Azure including compute, network, storage and security." },
  { id: 6, title: "Security Operations Analyst", code: "SC-200", provider: "Microsoft", category: "Security", level: "Intermediate", duration: "45h", enrolled: 41, rating: 4.7, progress: 31, gradient: "from-purple-400 to-violet-500", icon: "🔐", description: "Reduce organizational risk by rapidly remediating active attacks and advising on threat protection improvements." },
  { id: 7, title: "Azure AI Engineer", code: "AI-102", provider: "Microsoft", category: "Data & AI", level: "Intermediate", duration: "50h", enrolled: 34, rating: 4.8, progress: 0, gradient: "from-indigo-400 to-blue-500", icon: "🤖", description: "Design and implement AI solutions using Azure Cognitive Services, Azure Bot Service, and Azure OpenAI." },
  { id: 8, title: "Azure Network Engineer", code: "AZ-700", provider: "Microsoft", category: "Azure", level: "Intermediate", duration: "38h", enrolled: 29, rating: 4.4, progress: 0, gradient: "from-green-400 to-teal-500", icon: "🌐", description: "Design, implement, and manage hybrid networking, connectivity, routing, security, and access." },
];

export default function CertificationsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set([1, 3]));

  const filtered = certs
    .filter(c => category === "All" || c.category === category)
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  const toggleBookmark = (id: number) => setBookmarked(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const categories: Category[] = ["All", "Azure", "Security", "Data & AI", "DevOps"];
  const levelColor = (l: string) => l === "Beginner" ? "bg-emerald-100 text-emerald-700" : l === "Intermediate" ? "bg-sky-100 text-sky-700" : l === "Advanced" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Certifications</h1>
        <p className="mt-0.5 text-sm text-slate-500">Browse and enroll in certification paths approved for your role.</p>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search certifications…" className="flex-1 outline-none placeholder:text-slate-400" />
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden text-sm font-medium">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={cn("px-3 py-2 transition-colors whitespace-nowrap", category === c ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50")}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(cert => (
          <div key={cert.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer group">
            <div className={cn("relative flex h-32 items-center justify-center bg-gradient-to-br text-5xl", cert.gradient)}>
              <span role="img">{cert.icon}</span>
              <button onClick={e => { e.stopPropagation(); toggleBookmark(cert.id); }} className="absolute right-3 top-3 rounded-full bg-white/20 p-1.5 text-white transition-colors hover:bg-white/40">
                <Bookmark className={cn("h-4 w-4", bookmarked.has(cert.id) && "fill-white")} />
              </button>
              {cert.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-3 py-1">
                  <div className="flex items-center justify-between text-xs text-white">
                    <span className="font-semibold">{cert.progress}% complete</span>
                    {cert.progress === 100 && <CheckCircle className="h-3.5 w-3.5" />}
                  </div>
                  <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/30">
                    <div className="h-full rounded-full bg-white transition-all" style={{ width: `${cert.progress}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{cert.title}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-400">{cert.code} · {cert.provider}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-bold", levelColor(cert.level))}>{cert.level}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500 line-clamp-2">{cert.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cert.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cert.enrolled}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{cert.rating}</span>
                </div>
                <button className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700">
                  {cert.progress > 0 ? "Continue" : "Enroll"} <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <span className="text-4xl mb-3">🔍</span>
          <p className="text-sm font-medium">No certifications found</p>
          <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-2 text-xs text-indigo-600 hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  );
}
