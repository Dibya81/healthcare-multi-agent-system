"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchedule } from "@/hooks/useAgents";
import {
  Calendar as CalendarIcon, Clock, CheckCircle, Bell, Pill, ChevronRight,
  Plus, User, MapPin, X, AlertCircle
} from "lucide-react";

const statusColor = (s: string) =>
  s === "Confirmed" || s === "confirmed" ? "text-emerald-700 bg-emerald-100 border-emerald-200"
  : "text-amber-700 bg-amber-100 border-amber-200";

const TABS = ["Appointments", "Reminders", "Prescriptions"];

export default function SchedulingAgent() {
  const { data: events, isLoading: eventsLoading, isError: eventsError } = useSchedule();
  
  const [activeTab, setActiveTab] = useState("Appointments");
  const [localReminders, setLocalReminders] = useState<any[]>([]);

  if (eventsLoading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-40 bg-slate-50 rounded-3xl" />
      <div className="h-12 bg-slate-50 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-24 bg-slate-50 rounded-2xl" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
      </div>
    </div>
  );

  if (eventsError || !events) return (
    <div className="card p-12 text-center text-rose-500 bg-rose-50/30 border-rose-100">
      <AlertCircle className="mx-auto mb-3" size={32} />
      <h3 className="text-lg font-bold">Failed to load schedule</h3>
      <p className="text-sm opacity-80">Unable to retrieve upcoming appointments and medications.</p>
    </div>
  );

  const appointments = events.filter(e => e.type === 'appointment' || e.type === 'lab');
  const medications = events.filter(e => e.type === 'medication');

  const toggleReminder = (id: string) => {
    setReminders(r => r.map(rem => rem.id === id ? { ...rem, active: !rem.active } : rem));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-200/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CalendarIcon size={22} className="text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900">Scheduling Agent</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Auto-Managed</span>
              </div>
              <p className="text-sm text-aura-slate">
                Smart appointment slots, medication reminders, and prescription management.
              </p>
            </div>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md t">
            <Plus size={14} /> Book Appointment
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: "Upcoming", value: appointments.filter(a => a.status === "Confirmed" || a.status === "confirmed").length.toString(), icon: CheckCircle, color: "text-emerald-600" },
            { label: "Medications", value: medications.length.toString(), icon: Pill, color: "text-violet-600" },
            { label: "Active Alerts", value: "0", icon: Bell, color: "text-aura-primary" },
          ].map(s => {
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
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 text-sm font-semibold py-2 rounded-xl t ${activeTab === t ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

          {activeTab === "Appointments" && (
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No upcoming appointments.</div>
              ) : (
                appointments.map(a => (
                  <div key={a.id} className="card-white p-5">
                    <div className="flex items-start gap-4">
                      <div className="text-center shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">{a.time.split(',')[0]}</span>
                          <span className="text-lg font-black text-emerald-700">{a.time.split(' ')[1] || a.id.slice(-2)}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${statusColor(a.status)}`}>{a.status}</span>
                        </div>
                        <div className="space-y-0.5">
                          {a.provider && (
                            <div className="flex items-center gap-1.5 text-xs text-aura-slate">
                              <User size={11} /> <span>{a.provider}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-aura-slate">
                            <Clock size={11} /> <span>{a.time}</span>
                          </div>
                          {a.location && (
                            <div className="flex items-center gap-1.5 text-xs text-aura-slate">
                              <MapPin size={11} /> <span>{a.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button className="text-xs font-semibold text-aura-primary px-3 py-1.5 rounded-lg border border-aura-primary/30 hover:bg-blue-50 t">Reschedule</button>
                        <button className="text-xs font-semibold text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 t">Cancel</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Reminders" && (
            <div className="space-y-3">
              {medications.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No active reminders.</div>
              ) : (
                medications.map(r => (
                  <div key={r.id} className={`card-white p-4 flex items-center gap-4 t ${r.status !== 'Active' ? "opacity-50" : ""}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.type === "medication" ? "bg-violet-50" : "bg-emerald-50"}`}>
                      {r.type === "medication" ? <Pill size={16} className="text-violet-600" />
                       : <CalendarIcon size={16} className="text-emerald-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 mb-0.5">{r.title}</p>
                      <div className="flex gap-3 text-xs text-aura-slate">
                        <span>⏰ {r.time}</span>
                        <span>🔄 Daily</span>
                      </div>
                    </div>
                    <button
                      className={`relative w-11 h-6 rounded-full t ${r.status === 'Active' ? "bg-emerald-500" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow t ${r.status === 'Active' ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                ))
              )}
              <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-400 hover:border-emerald-300 hover:text-emerald-600 t flex items-center justify-center gap-2">
                <Plus size={16} /> Add New Reminder
              </button>
            </div>
          )}

          {activeTab === "Prescriptions" && (
            <div className="space-y-3">
              {medications.length === 0 ? (
                <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No active prescriptions.</div>
              ) : (
                medications.map((p, i) => (
                  <div key={i} className="card-white p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        <Pill size={16} className="text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 mb-1">{p.title}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-aura-slate mb-2">
                          <span>👨‍⚕️ {p.provider || 'Assigned Physician'}</span>
                          <span>⏳ Next Dose: {p.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-400 rounded-full" style={{ width: `60%` }} />
                          </div>
                          <span className="text-xs font-semibold text-violet-600">3 refills left</span>
                        </div>
                      </div>
                      <button className="text-xs font-semibold text-white bg-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-700 t shrink-0">
                        Request Refill
                      </button>
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
