"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlerts, useAcknowledgeAlert } from "@/hooks/useAgents";
import {
  Bell, AlertTriangle, ShieldAlert, Zap, Clock, Info,
  ChevronRight, CheckCircle, Smartphone, Mail, Phone, Settings,
  AlertCircle, History
} from "lucide-react";

const severityColor = (s: string) =>
  s === "High" || s === "high" || s === "Critical" ? "text-rose-600 bg-rose-50 border-rose-200"
  : s === "Medium" || s === "medium" ? "text-amber-600 bg-amber-50 border-amber-200"
  : "text-blue-600 bg-blue-50 border-blue-200";

const statusColor = (s: string) =>
  s === "Escalated" || s === "escalated" ? "text-rose-700 bg-rose-100"
  : s === "Active" || s === "active" ? "text-amber-700 bg-amber-100"
  : "text-emerald-700 bg-emerald-100";

const TABS = ["Live Alerts", "Policy", "History"];

export default function AlertingAgent() {
  const { data: alerts, isLoading: alertsLoading, isError: alertsError } = useAlerts();
  const acknowledgeAlert = useAcknowledgeAlert();
  
  const [activeTab, setActiveTab] = useState("Live Alerts");

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (alertsLoading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-40 bg-slate-50 rounded-3xl" />
      <div className="h-12 bg-slate-50 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-24 bg-slate-50 rounded-2xl" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
      </div>
    </div>
  );

  if (alertsError || !alerts) return (
    <div className="card p-12 text-center text-rose-500 bg-rose-50/30 border-rose-100">
      <AlertTriangle className="mx-auto mb-3" size={32} />
      <h3 className="text-lg font-bold">Failed to load safety monitor</h3>
      <p className="text-sm opacity-80">Unable to retrieve real-time safety alerts.</p>
    </div>
  );

  const activeAlerts = alerts.filter(a => a.status === "Active" || a.status === "active" || a.status === "Escalated" || a.status === "escalated");
  const resolvedAlerts = alerts.filter(a => a.status === "Resolved" || a.status === "resolved");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-r from-rose-500/5 to-amber-500/5 border-rose-200/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
              <Bell size={22} className="text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900">Alerting & Escalation Agent</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Safety Critical</span>
              </div>
              <p className="text-sm text-aura-slate">
                Continuous monitoring of health data with autonomous escalation of critical findings.
              </p>
            </div>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-black/10 bg-white hover:bg-slate-50 t">
            <Settings size={14} /> Configure Rules
          </button>
        </div>

        {/* Status Snapshot */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: "Active Alerts", value: activeAlerts.length.toString(), icon: AlertTriangle, color: "text-amber-600" },
            { label: "Escalated", value: activeAlerts.filter(a => a.status === 'Escalated' || a.status === 'escalated').length.toString(), icon: ShieldAlert, color: "text-rose-600" },
            { label: "Resolution Rate", value: "98%", icon: CheckCircle, color: "text-emerald-600" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white/70 rounded-2xl p-3 text-center border border-white">
                <Icon size={18} className={`${s.color} mx-auto mb-1`} />
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
                <p className="text-[11px] text-aura-slate">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/60 border border-black/5 rounded-2xl">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 text-sm font-semibold py-2 rounded-xl t ${
              activeTab === t ? "bg-rose-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          
          {activeTab === "Live Alerts" && (
            <div className="space-y-3">
              {activeAlerts.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No active safety alerts. System stable.</div>
              ) : (
                activeAlerts.map((a) => (
                  <div key={a.id} className={`card-white p-5 border-l-4 ${a.severity === "High" || a.severity === "high" || a.severity === "Critical" ? "border-l-rose-500" : "border-l-amber-500"}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.severity === "High" || a.severity === "high" || a.severity === "Critical" ? "bg-rose-50" : "bg-amber-50"}`}>
                        <AlertCircle size={18} className={a.severity === "High" || a.severity === "high" || a.severity === "Critical" ? "text-rose-600" : "text-amber-600"} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusColor(a.status)}`}>{a.status}</span>
                          </div>
                          <span className="text-[10px] text-aura-slate">{a.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">{a.message}</p>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-black/5">
                          <Zap size={12} className="text-aura-primary shrink-0" />
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-slate-700 uppercase">Agent Action</p>
                            <p className="text-[11px] text-aura-slate">{a.actionTaken || 'Monitoring and awaiting escalation thresholds.'}</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAcknowledge(a.id)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-slate-800 hover:bg-black t shrink-0"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Policy" && (
            <div className="card-white p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Escalation Protocol</h3>
                <p className="text-xs text-aura-slate">How the AI agent routes notifications based on clinical severity.</p>
              </div>
              <div className="space-y-4">
                {[
                  { level: "Level 1: Standard", trigger: "Routine deviations", channel: "In-app Notification", responseTime: "< 4 hours" },
                  { level: "Level 2: Urgent", trigger: "Persistent high vitals", channel: "Push + SMS", responseTime: "< 30 minutes" },
                  { level: "Level 3: Critical", trigger: "Severe vital drop / Emergency", channel: "Call + Emergency Contact", responseTime: "Immediate" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-black/5 bg-slate-50/50">
                    <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center font-bold text-aura-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level</p>
                        <p className="text-xs font-bold text-slate-800">{p.level}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Channel</p>
                        <p className="text-xs font-medium text-slate-700">{p.channel}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Response</p>
                        <p className="text-xs font-bold text-rose-600">{p.responseTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "History" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <p className="text-xs font-bold text-aura-slate">Resolution History</p>
                <button className="text-xs font-semibold text-aura-primary hover:underline">Download Log</button>
              </div>
              {resolvedAlerts.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No resolved alerts in history.</div>
              ) : (
                resolvedAlerts.map((a) => (
                  <div key={a.id} className="card-white p-4 flex items-center gap-4 opacity-75">
                    <History size={16} className="text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{a.title}</p>
                      <p className="text-xs text-aura-slate">{a.timestamp} · {a.status}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
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
