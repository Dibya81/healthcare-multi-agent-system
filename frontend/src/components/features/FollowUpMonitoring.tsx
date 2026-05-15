"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertCircle, Clock, Pill, ChevronRight, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const memories = [
  { date: "May 13", event: "Headache reported", pattern: "Recurring — 3rd time this month", severity: "mild", color: "#f59e0b" },
  { date: "May 10", event: "Resting HR elevated (88 bpm)", pattern: "Linked to poor sleep", severity: "watch", color: "#f59e0b" },
  { date: "May 7",  event: "SpO₂ dipped to 94%", pattern: "During morning run — normal", severity: "resolved", color: "#10b981" },
  { date: "May 3",  event: "BP slightly elevated", pattern: "Normalized after rest", severity: "resolved", color: "#10b981" },
];

const medications = [
  { name: "Vitamin D3", dose: "1000 IU", time: "Morning", taken: true },
  { name: "Omega-3",    dose: "1g",      time: "Morning", taken: true },
  { name: "Magnesium",  dose: "400mg",   time: "Evening", taken: false },
];

const trendData = [
  { week: "W1", score: 78 }, { week: "W2", score: 80 }, { week: "W3", score: 77 },
  { week: "W4", score: 83 }, { week: "W5", score: 85 }, { week: "W6", score: 87 },
];

export default function FollowUpMonitoring() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Brain size={18} className="text-aura-violet" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Health Memory</h3>
            <p className="text-xs text-aura-slate">Lifelong pattern tracking & predictive insights</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pill pill-violet">
          <Sparkles size={10} />
          <span>6 months tracked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Long-term trend */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-slate-800">Long-term Wellness Trend</p>
                <p className="text-xs text-aura-slate">6-week trajectory — improving steadily</p>
              </div>
              <div className="flex items-center gap-1.5 text-aura-green">
                <TrendingUp size={14} />
                <span className="text-xs font-bold">+9 pts</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11 }} />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#trendGrad)" dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Health events */}
          <div>
            <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-2">Symptom Memory</p>
            <div className="space-y-2">
              {memories.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="card-white p-3 flex items-center gap-3 hover-lift cursor-pointer"
                >
                  <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: m.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{m.event}</p>
                    <p className="text-[10px] text-aura-slate truncate">{m.pattern}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-aura-slate font-mono">{m.date}</p>
                    <span className={`text-[9px] font-bold pill ${m.severity === "resolved" ? "pill-green" : "pill-amber"}`}>
                      {m.severity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Medications + AI prediction */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-2">Medications Today</p>
            <div className="space-y-2">
              {medications.map((m, i) => (
                <div key={i} className={`card-sm p-3 flex items-center gap-3 ${m.taken ? "opacity-60" : ""}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${m.taken ? "bg-green-50" : "bg-amber-50"}`}>
                    <Pill size={13} className={m.taken ? "text-aura-green" : "text-aura-amber"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{m.name}</p>
                    <p className="text-[10px] text-aura-slate">{m.dose} · {m.time}</p>
                  </div>
                  {m.taken
                    ? <span className="text-[9px] font-bold pill pill-green">Taken</span>
                    : <button className="text-[9px] font-bold pill pill-amber">Remind</button>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* AI prediction */}
          <div className="card-white p-4 border" style={{ borderColor: "rgba(139,92,246,0.15)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-aura-violet" />
              <span className="text-[10px] font-bold text-aura-violet uppercase tracking-wider">AI Prediction</span>
            </div>
            <p className="text-xs text-slate-700 leading-snug mb-3">
              Based on your patterns, you may experience a headache if sleep falls below 6.5 hrs tonight. Try to be in bed by 10:30 PM.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 text-[11px] font-semibold btn-glass py-2 rounded-xl text-aura-slate">Dismiss</button>
              <button className="flex-1 text-[11px] font-semibold btn-primary py-2 rounded-xl">Set Alarm</button>
            </div>
          </div>

          <div className="card-white p-3 flex items-center gap-3">
            <AlertCircle size={14} className="text-aura-primary" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-800">Annual checkup due</p>
              <p className="text-[10px] text-aura-slate">In 2 months · Last: May 2025</p>
            </div>
            <ChevronRight size={13} className="text-aura-slate" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
