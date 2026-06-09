"use client";

import { useState } from "react";
import { Search, FileText, Video, BookOpen, ExternalLink, Clock, Star, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

type ResType = "All" | "Article" | "Video" | "Guide" | "Template";

const resources = [
  { id: 1, title: "AZ-104 Study Guide — Identity & Access Management", type: "Guide", category: "Azure", duration: "45 min read", rating: 4.9, tags: ["AZ-104","Identity","RBAC"], bookmarked: true },
  { id: 2, title: "Zero Trust Architecture Fundamentals", type: "Article", category: "Security", duration: "12 min read", rating: 4.7, tags: ["Security","ZeroTrust","SC-900"] },
  { id: 3, title: "Azure Networking Deep Dive (Video Series)", type: "Video", category: "Azure", duration: "3h 20 min", rating: 4.8, tags: ["AZ-700","Networking","VNet"] },
  { id: 4, title: "Compliance Checklist — GDPR & ISO 27001", type: "Template", category: "Compliance", duration: "5 min setup", rating: 4.6, tags: ["Compliance","GDPR","ISO"] },
  { id: 5, title: "DevOps CI/CD Pipeline Best Practices", type: "Article", category: "DevOps", duration: "18 min read", rating: 4.5, tags: ["AZ-400","CI/CD","DevOps"] },
  { id: 6, title: "DP-300 Query Optimization Techniques", type: "Video", category: "Data & AI", duration: "1h 15 min", rating: 4.9, tags: ["DP-300","SQL","Performance"] },
  { id: 7, title: "Azure AI Services Overview", type: "Guide", category: "Data & AI", duration: "30 min read", rating: 4.7, tags: ["AI-102","Cognitive","OpenAI"] },
  { id: 8, title: "Exam Readiness Checklist Template", type: "Template", category: "Azure", duration: "3 min setup", rating: 4.8, tags: ["Exam","Prep","All Certs"] },
  { id: 9, title: "Cloud Cost Governance Strategies", type: "Article", category: "Azure", duration: "15 min read", rating: 4.4, tags: ["Cost","Governance","FinOps"] },
];

const typeIcon = { Article: FileText, Video, Guide: BookOpen, Template: FileText };
const typeColor: Record<string, string> = {
  Article: "bg-sky-100 text-sky-700",
  Video: "bg-rose-100 text-rose-700",
  Guide: "bg-indigo-100 text-indigo-700",
  Template: "bg-emerald-100 text-emerald-700",
};

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ResType>("All");
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set(resources.filter(r => r.bookmarked).map(r => r.id)));

  const filtered = resources
    .filter(r => type === "All" || r.type === type)
    .filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      r.category.toLowerCase().includes(search.toLowerCase())
    );

  const toggleBookmark = (id: number) => setBookmarked(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Knowledge Base</h1>
        <p className="mt-0.5 text-sm text-slate-500">Approved articles, guides, templates, and videos for your certification journey.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, tag, or category…" className="flex-1 outline-none placeholder:text-slate-400" />
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden text-sm font-medium">
          {(["All","Article","Video","Guide","Template"] as ResType[]).map(t => (
            <button key={t} onClick={() => setType(t)} className={cn("px-3 py-2 transition-colors", type === t ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50")}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map(r => {
          const Icon = typeIcon[r.type as keyof typeof typeIcon] || FileText;
          return (
            <div key={r.id} className="group flex flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
              <div className="flex items-start justify-between gap-2">
                <div className={cn("rounded-lg p-2", typeColor[r.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <button onClick={e => { e.stopPropagation(); toggleBookmark(r.id); }} className="text-slate-300 hover:text-indigo-500 transition-colors">
                  <Bookmark className={cn("h-4 w-4", bookmarked.has(r.id) && "fill-indigo-500 text-indigo-500")} />
                </button>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">{r.title}</h3>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{tag}</span>
                ))}
              </div>
              <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.duration}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{r.rating}</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <BookOpen className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm font-medium">No resources found</p>
          <button onClick={() => { setSearch(""); setType("All"); }} className="mt-2 text-xs text-indigo-600 hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  );
}
