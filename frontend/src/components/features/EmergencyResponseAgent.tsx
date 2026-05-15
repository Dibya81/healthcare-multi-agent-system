"use client";

import { motion } from "framer-motion";
import { Shield, Phone, MapPin, Heart, AlertTriangle, CheckCircle2, Users } from "lucide-react";

const contacts = [
  { name: "Emily Johnson", rel: "Wife", phone: "+1 555-0102", priority: 1 },
  { name: "Dr. Marcus Lee", rel: "Primary Care", phone: "+1 555-0198", priority: 2 },
];

const hospitals = [
  { name: "City Medical Center", dist: "0.8 mi", eta: "3 min", beds: "Available" },
  { name: "St. Luke's Hospital", dist: "1.4 mi", eta: "5 min", beds: "Available" },
  { name: "Riverside Clinic", dist: "2.1 mi", eta: "8 min", beds: "Limited" },
];

const readinessChecks = [
  { label: "Emergency contacts configured", done: true },
  { label: "Location services enabled", done: true },
  { label: "Medical ID set up", done: true },
  { label: "Insurance card uploaded", done: false },
  { label: "Medication list current", done: true },
];

export default function EmergencyResponseAgent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <Shield size={18} className="text-aura-rose" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Emergency Assist</h3>
            <p className="text-xs text-aura-slate">AI-powered safety & emergency readiness</p>
          </div>
        </div>
        <span className="pill pill-green">Ready</span>
      </div>

      {/* SOS button */}
      <div className="flex justify-center mb-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(244,63,94,0.15)", animationDuration: "2s" }} />
          <button className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 shadow-lg font-bold text-white t hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #f43f5e, #e11d48)", boxShadow: "0 8px 32px rgba(244,63,94,0.35)" }}>
            <AlertTriangle size={22} />
            <span className="text-xs font-bold">SOS</span>
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-aura-slate mb-5">
        Press and hold to alert contacts & share your live location
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Emergency contacts */}
        <div>
          <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-2">Emergency Contacts</p>
          <div className="space-y-2">
            {contacts.map((c, i) => (
              <div key={i} className="card-sm p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aura-primary to-aura-teal flex items-center justify-center text-white font-bold text-sm">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{c.name}</p>
                  <p className="text-[10px] text-aura-slate">{c.rel} · Priority {c.priority}</p>
                </div>
                <button className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                  <Phone size={12} className="text-aura-green" />
                </button>
              </div>
            ))}
            <button className="w-full text-xs font-medium text-aura-primary py-2 rounded-xl bg-aura-primary/06 border border-aura-primary/12 hover:bg-aura-primary/10 t">
              + Add Contact
            </button>
          </div>
        </div>

        {/* Nearby hospitals */}
        <div>
          <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-2">Nearby Hospitals</p>
          <div className="space-y-2">
            {hospitals.map((h, i) => (
              <div key={i} className="card-sm p-3">
                <div className="flex items-start gap-2">
                  <MapPin size={12} className="text-aura-rose mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{h.name}</p>
                    <p className="text-[10px] text-aura-slate">{h.dist} · ETA {h.eta}</p>
                  </div>
                  <span className={`pill text-[9px] ${h.beds === "Available" ? "pill-green" : "pill-amber"}`}>{h.beds}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Readiness checklist */}
      <div className="mt-4">
        <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-2">Emergency Readiness</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {readinessChecks.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 size={12} className={c.done ? "text-aura-green" : "text-slate-300"} />
              <span className={`text-[11px] ${c.done ? "text-slate-600" : "text-slate-400"}`}>{c.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-aura-primary to-aura-teal" style={{ width: "80%" }} />
        </div>
        <p className="text-[10px] text-aura-slate mt-1">4/5 ready · Upload insurance card to complete setup</p>
      </div>
    </motion.div>
  );
}
