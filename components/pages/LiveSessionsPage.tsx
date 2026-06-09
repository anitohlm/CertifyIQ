"use client";

import { useState } from "react";
import { Video, Users, Clock, Calendar, CheckCircle, ChevronRight, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const upcoming = [
  { id: 1, title: "AZ-104 Identity & Access Deep Dive", instructor: "Dr. Maya Torres", date: "Today", time: "3:00 PM", duration: "90 min", enrolled: 24, spots: 30, cert: "AZ-104", live: true, color: "bg-indigo-500" },
  { id: 2, title: "Zero Trust Security Architecture", instructor: "Chris Nakamura", date: "Tomorrow", time: "10:00 AM", duration: "60 min", enrolled: 18, spots: 25, cert: "SC-900", live: false, color: "bg-rose-500" },
  { id: 3, title: "Azure Networking Masterclass", instructor: "Aisha Patel", date: "Jun 12", time: "2:00 PM", duration: "120 min", enrolled: 31, spots: 40, cert: "AZ-700", live: false, color: "bg-sky-500" },
  { id: 4, title: "DP-300 Query Performance Tuning", instructor: "Lucas Ferrari", date: "Jun 13", time: "11:00 AM", duration: "75 min", enrolled: 15, spots: 20, cert: "DP-300", live: false, color: "bg-amber-500" },
  { id: 5, title: "DevOps CI/CD Pipeline Workshop", instructor: "Yuna Kim", date: "Jun 15", time: "9:00 AM", duration: "180 min", enrolled: 22, spots: 30, cert: "AZ-400", live: false, color: "bg-emerald-500" },
];

const past = [
  { id: 1, title: "AZ-104 Storage Solutions", date: "Jun 4", duration: "90 min", attendees: 27, cert: "AZ-104", recordingAvailable: true },
  { id: 2, title: "SC-900 Compliance Frameworks", date: "Jun 2", duration: "60 min", attendees: 19, cert: "SC-900", recordingAvailable: true },
  { id: 3, title: "Introduction to Azure AI Services", date: "May 30", duration: "75 min", attendees: 32, cert: "AI-102", recordingAvailable: true },
  { id: 4, title: "AZ-400 Infrastructure as Code", date: "May 28", duration: "120 min", attendees: 24, cert: "AZ-400", recordingAvailable: false },
];

export default function LiveSessionsPage() {
  const [registered, setRegistered] = useState<Set<number>>(new Set([1]));

  const toggleRegister = (id: number) => setRegistered(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Live Sessions</h1>
        <p className="mt-0.5 text-sm text-slate-500">Join instructor-led sessions and review recordings.</p>
      </div>

      {/* Live now banner */}
      {upcoming.filter(s => s.live).map(session => (
        <div key={session.id} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white">
          <div className="pointer-events-none absolute right-6 top-6 text-6xl opacity-20 select-none">📡</div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE NOW
                </span>
                <span className="text-xs text-indigo-200">{session.cert}</span>
              </div>
              <h2 className="mt-2 text-lg font-bold">{session.title}</h2>
              <div className="mt-1.5 flex items-center gap-3 text-sm text-indigo-100">
                <span className="flex items-center gap-1"><Mic className="h-3.5 w-3.5" />{session.instructor}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{session.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{session.enrolled} attending</span>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-50">
              <Video className="h-4 w-4" /> Join Now
            </button>
          </div>
        </div>
      ))}

      {/* Upcoming */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-slate-700">Upcoming Sessions</h2>
        <div className="space-y-2.5">
          {upcoming.filter(s => !s.live).map(session => (
            <div key={session.id} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white text-xl", session.color)}>
                <Video className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{session.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mic className="h-3 w-3" />{session.instructor}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date} · {session.time}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400">{session.enrolled}/{session.spots} spots</span>
                    <button
                      onClick={() => toggleRegister(session.id)}
                      className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                        registered.has(session.id)
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      )}
                    >
                      {registered.has(session.id) ? <><CheckCircle className="h-3.5 w-3.5" />Registered</> : <>Register <ChevronRight className="h-3 w-3" /></>}
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${(session.enrolled / session.spots) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past sessions */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-slate-700">Past Sessions</h2>
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr_auto] items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-400">
            <span>Session</span><span>Date</span><span>Duration</span><span>Attendees</span><span>Recording</span>
          </div>
          {past.map(s => (
            <div key={s.id} className="grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr_auto] items-center gap-2 border-t border-slate-100 px-5 py-3.5 text-sm hover:bg-slate-50/50">
              <div>
                <div className="font-semibold text-slate-900">{s.title}</div>
                <div className="text-xs text-slate-400">{s.cert}</div>
              </div>
              <span className="text-slate-500 text-xs">{s.date}</span>
              <span className="text-slate-500 text-xs">{s.duration}</span>
              <span className="text-slate-500 text-xs">{s.attendees} attended</span>
              {s.recordingAvailable
                ? <button className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"><Video className="h-3 w-3" />Watch</button>
                : <span className="text-xs text-slate-300">Unavailable</span>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
