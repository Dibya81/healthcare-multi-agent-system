"use client";

import { motion } from "framer-motion";
import { Activity, Heart, Moon, Droplets, Wind, Zap, Watch } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const hrData = [62, 68, 74, 88, 72, 69, 71, 73, 70, 72].map((v, i) => ({ t: `${9 + i}:00`, hr: v }));

const metrics = [
  { label: "Heart Rate",  value: "72",  unit: "bpm",  icon: Heart,    color: "#f43f5e", ok: true,  bar: 72 },
  { label: "SpO₂",        value: "98",  unit: "%",    icon: Wind,     color: "#5b8def", ok: true,  bar: 98 },
  { label: "Sleep",       value: "7.4", unit: "hrs",  icon: Moon,     color: "#8b5cf6", ok: true,  bar: 74 },
  { label: "Hydration",   value: "62",  unit: "%",    icon: Droplets, color: "#2dd4bf", ok: false, bar: 62 },
  { label: "Stress",      value: "Low", unit: "",     icon: Zap,      color: "#10b981", ok: true,  bar: 20 },
  { label: "Activity",    value: "6.2", unit: "k",    icon: Activity, color: "#f59e0b", ok: true,  bar: 62 },
];

const wearables = [
  { device: "Apple Watch", hr: 72, spo2: 98, status: "connected", color: "#f43f5e" },
  { device: "Whoop 4.0",   hr: 72, spo2: 97, status: "connected", color: "#5b8def" },
];

export default function AIHealthMonitor() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card p-6 h-full"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f43f5e18,#5b8def18)" }}>
            <Activity size={18} className="text-aura-primary" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Health Monitor</h3>
            <p className="text-xs text-aura-slate">Your real-time biometric dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse" />
          <span className="text-xs font-semibold text-aura-green">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Metrics grid */}
        <div>
          <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-3">Biometrics</p>
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="card-sm p-3 hover-lift cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                      <Icon size={12} style={{ color: m.color }} />
                    </div>
                    <span className={`text-[9px] font-bold pill ${m.ok ? "pill-green" : "pill-amber"}`}>
                      {m.ok ? "✓" : "!"}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 leading-none">{m.value}</p>
                  <p className="text-[10px] text-aura-slate mt-0.5">{m.label}{m.unit ? ` · ${m.unit}` : ""}</p>
                  <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.bar}%`, background: m.color }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Chart + wearables */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-2">Heart Rate — Today</p>
            <div className="bg-slate-50 rounded-2xl p-3">
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={hrData}>
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11 }} />
                  <Area type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={2} fill="url(#hrGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-2">Wearable Devices</p>
            <div className="space-y-2">
              {wearables.map((w, i) => (
                <div key={i} className="card-sm p-3 flex items-center gap-3">
                  <Watch size={16} style={{ color: w.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{w.device}</p>
                    <p className="text-[10px] text-aura-slate">{w.hr} bpm · SpO₂ {w.spo2}%</p>
                  </div>
                  <span className="pill pill-green text-[9px]">{w.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-3" style={{ background: "linear-gradient(135deg,rgba(91,141,239,0.06),rgba(45,212,191,0.06))", border: "1px solid rgba(91,141,239,0.12)" }}>
            <p className="text-xs font-semibold text-aura-primary mb-1">🤖 AI Recommendation</p>
            <p className="text-xs text-aura-slate leading-snug">Drink 2 more glasses of water today. Your hydration is below target after this morning's run.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
