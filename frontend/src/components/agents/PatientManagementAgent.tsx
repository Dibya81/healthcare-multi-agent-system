"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile, useHealthSummary } from "@/hooks/useUser";
import { useVitals } from "@/hooks/useHealth";
import { useAlerts } from "@/hooks/useAgents";
import {
  User as UserIcon, FileText, Clock, Shield, ChevronRight, Search,
  Heart, Pill, AlertTriangle, CheckCircle, Plus, Download,
  Activity, Calendar, Edit3
} from "lucide-react";

const TABS = ["Overview", "Records", "Medications", "Conditions", "Allergies"];

export default function PatientManagementAgent() {
  const { data: patient, isLoading: profileLoading, isError: profileError } = useProfile();
  const { data: vitals } = useVitals();
  const { data: alerts } = useAlerts();
  const { data: summary } = useHealthSummary();
  
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");

  const severityColor = (s: string) =>
    s === "Severe" ? "text-rose-600 bg-rose-50 border-rose-200"
    : s === "Medium" || s === "Moderate" ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-emerald-600 bg-emerald-50 border-emerald-200";

  const statusColor = (s: string) =>
    s === "Active" ? "text-aura-primary bg-blue-50 border-blue-200"
    : s === "Managed" ? "text-violet-600 bg-violet-50 border-violet-200"
    : "text-slate-400 bg-slate-50 border-slate-200";

  if (profileLoading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-40 bg-slate-50 rounded-3xl" />
      <div className="h-12 bg-slate-50 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="h-24 bg-slate-50 rounded-2xl" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
      </div>
    </div>
  );

  if (profileError || !patient) return (
    <div className="card p-12 text-center text-rose-500 bg-rose-50/30 border-rose-100">
      <AlertTriangle className="mx-auto mb-3" size={32} />
      <h3 className="text-lg font-bold">Failed to load health records</h3>
      <p className="text-sm opacity-80">Please ensure the backend API is running and try again.</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Agent Header */}
      <div className="card p-5 bg-gradient-to-r from-aura-primary/5 to-aura-teal/5 border-aura-primary/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-aura-primary/10 border border-aura-primary/20 flex items-center justify-center">
              <User size={22} className="text-aura-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900">Patient Management Agent</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  FHIR R4 Compliant
                </span>
              </div>
              <p className="text-sm text-aura-slate">
                Centralized health records, history compilation, and longitudinal data tracking.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-aura-primary border border-aura-primary/30 bg-white hover:bg-aura-primary/5 t">
              <Download size={14} /> Export Records
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-aura-primary hover:bg-aura-primary/90 shadow-aura t">
              <Plus size={14} /> Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Patient Card */}
      <div className="card-white p-5">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-wellness flex items-center justify-center text-white font-bold text-2xl shrink-0">
            W
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Full Name", value: patient.name },
              { label: "Date of Birth", value: patient.dob },
              { label: "Blood Type", value: patient.bloodType },
              { label: "Primary Physician", value: patient.physician },
              { label: "Weight / Height", value: `${patient.weight} · ${patient.height}` },
              { label: "Location", value: patient.location },
              { label: "Last Visit", value: patient.lastVisit },
              { label: "Next Appointment", value: patient.nextVisit },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{f.label}</p>
                <p className="text-sm font-semibold text-slate-800">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/60 border border-black/5 rounded-2xl">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 text-sm font-semibold py-2 rounded-xl t ${
              activeTab === t
                ? "bg-aura-primary text-white shadow-aura"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Active Conditions", value: patient.conditions.filter(c => c.status === 'Active').length.toString(), icon: Activity, color: "text-aura-primary", bg: "bg-blue-50" },
                { label: "Current Medications", value: patient.medications.length.toString(), icon: Pill, color: "text-violet-600", bg: "bg-violet-50" },
                { label: "Recorded Allergies", value: patient.allergies.length.toString(), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Medical Records", value: patient.history.length.toString(), icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Active Alerts", value: alerts?.length.toString() || "0", icon: Clock, color: "text-aura-teal", bg: "bg-teal-50" },
                { label: "Data Compliance", value: "HIPAA", icon: Shield, color: "text-slate-600", bg: "bg-slate-50" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="card-white p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={20} className={s.color} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                      <p className="text-xs text-aura-slate font-medium">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "Records" && (
            <div className="space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aura-primary/20"
                  placeholder="Search records…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {patient.history.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No medical records found.</div>
              ) : (
                patient.history.filter(h => h.summary.toLowerCase().includes(search.toLowerCase()) || h.type.toLowerCase().includes(search.toLowerCase())).map((h, i) => (
                  <div key={i} className="card-white p-4 flex items-start gap-4 hover:border-aura-primary/20 t cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-aura-primary/10 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-aura-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-800">{h.type}</span>
                        {h.hasReport && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Report Available</span>}
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{h.summary}</p>
                      <div className="flex gap-3 text-[11px] text-aura-slate">
                        <span>📅 {h.date}</span>
                        <span>👨‍⚕️ {h.provider}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 shrink-0 mt-1" />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Medications" && (
            <div className="space-y-3">
              {patient.medications.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No current medications.</div>
              ) : (
                patient.medications.map((m, i) => (
                  <div key={i} className="card-white p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                      <Pill size={16} className="text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-slate-800">{m.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${statusColor(m.status)}`}>{m.status}</span>
                      </div>
                      <div className="flex gap-3 text-xs text-aura-slate">
                        <span>💊 {m.dosage}</span>
                        <span>For: {m.for}</span>
                        <span>Refill: {m.refillDate}</span>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-aura-primary px-3 py-1.5 rounded-lg border border-aura-primary/30 hover:bg-aura-primary/5 t">
                      Refill
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Conditions" && (
            <div className="space-y-3">
              {patient.conditions.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No reported conditions.</div>
              ) : (
                patient.conditions.map((c, i) => (
                  <div key={i} className="card-white p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-800">{c.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${statusColor(c.status)}`}>{c.status}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${severityColor(c.severity)}`}>{c.severity}</span>
                      </div>
                      <p className="text-xs text-aura-slate">Diagnosed since {c.since}</p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-700 t"><Edit3 size={14} /></button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Allergies" && (
            <div className="space-y-3">
              {patient.allergies.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No allergies recorded.</div>
              ) : (
                patient.allergies.map((a, i) => (
                  <div key={i} className="card-white p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <AlertTriangle size={16} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-slate-800">{a.allergen}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${severityColor(a.severity)}`}>{a.severity}</span>
                      </div>
                      <p className="text-xs text-aura-slate">Reaction: {a.reaction}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
