"use client";

import { useState } from "react";
import { User, Bell, Link, Shield, ChevronRight, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn("relative h-6 w-11 rounded-full transition-colors", enabled ? "bg-indigo-600" : "bg-slate-200")}
      aria-checked={enabled}
      role="switch"
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", enabled ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@company.com");
  const [role, setRole] = useState("Cloud Operations Engineer");
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    studyReminders: true,
    assessmentResults: true,
    teamUpdates: false,
    weeklyDigest: true,
    managerAlerts: false,
  });

  const [integrations] = useState([
    { name: "Microsoft Entra ID (Azure AD)", status: "Connected", icon: "🔷", desc: "SSO and identity management" },
    { name: "Microsoft Teams", status: "Connected", icon: "💜", desc: "Notifications and session links" },
    { name: "SharePoint", status: "Not connected", icon: "🟢", desc: "Knowledge base sync" },
    { name: "Outlook Calendar", status: "Not connected", icon: "📅", desc: "Study window scheduling" },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500">Manage your profile, notifications, and integrations.</p>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">AJ</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{name}</p>
            <p className="text-xs text-slate-500">{email}</p>
            <button className="mt-1 text-xs text-indigo-600 hover:underline">Change photo</button>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Full name", value: name, onChange: setName },
            { label: "Email address", value: email, onChange: setEmail },
            { label: "Role / Job title", value: role, onChange: setRole },
          ].map(f => (
            <div key={f.label}>
              <label className="mb-1 block text-xs font-semibold text-slate-600">{f.label}</label>
              <input
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition-colors"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className={cn("mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors", saved ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700")}
        >
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : "Save changes"}
        </button>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <div className="space-y-4">
          {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val]) => {
            const labels: Record<string, string> = {
              studyReminders: "Study reminders",
              assessmentResults: "Assessment results",
              teamUpdates: "Team readiness updates",
              weeklyDigest: "Weekly digest email",
              managerAlerts: "Manager alert notifications",
            };
            const descs: Record<string, string> = {
              studyReminders: "Get nudged when it's time to study based on your schedule.",
              assessmentResults: "Receive your assessment scores and recommendations.",
              teamUpdates: "Notify me when team readiness changes significantly.",
              weeklyDigest: "Summary of your learning progress every Monday.",
              managerAlerts: "Alert manager when I fall behind on my learning path.",
            };
            return (
              <div key={key} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{labels[key]}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{descs[key]}</p>
                </div>
                <Toggle enabled={val} onToggle={() => setNotifs(n => ({ ...n, [key]: !n[key] }))} />
              </div>
            );
          })}
        </div>
      </Section>

      {/* Integrations */}
      <Section title="Integrations">
        <div className="space-y-3">
          {integrations.map(intg => (
            <div key={intg.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{intg.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{intg.name}</p>
                  <p className="text-xs text-slate-500">{intg.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-semibold", intg.status === "Connected" ? "text-emerald-600" : "text-slate-400")}>{intg.status}</span>
                <button className={cn("flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  intg.status === "Connected"
                    ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                )}>
                  {intg.status === "Connected" ? "Manage" : <><Link className="h-3 w-3" /> Connect</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger zone */}
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <h2 className="text-sm font-bold text-rose-900">Danger Zone</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-800">Delete account</p>
            <p className="text-xs text-rose-600">Permanently remove your data. This cannot be undone.</p>
          </div>
          <button className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
