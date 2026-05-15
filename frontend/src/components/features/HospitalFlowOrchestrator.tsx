"use client";

import { motion } from "framer-motion";
import { Heart, Dumbbell, Moon, Apple, Wind, TrendingUp, ChevronRight, Sparkles } from "lucide-react";

const plans = [
  {
    icon: Dumbbell, label: "Today's Exercise", sub: "Light activity recommended",
    color: "#5b8def", action: "30 min walk + stretching",
    reasoning: "Muscle recovery at 83% — avoid intense workouts today.",
    pill: "Gentle", pillColor: "pill-blue",
  },
  {
    icon: Moon, label: "Sleep Optimization", sub: "Bedtime in 3 hrs",
    color: "#8b5cf6", action: "Wind down by 10:30 PM",
    reasoning: "Your best sleep quality occurs when asleep before 11 PM.",
    pill: "Priority", pillColor: "pill-violet",
  },
  {
    icon: Wind, label: "Breathing Exercise", sub: "4-7-8 technique",
    color: "#2dd4bf", action: "5 min breathwork",
    reasoning: "AI detected mild stress uptick. Breathwork reduces cortisol by 26%.",
    pill: "Calm", pillColor: "pill-teal",
  },
  {
    icon: Apple, label: "Nutrition Tip", sub: "Personalized by AI",
    color: "#10b981", action: "Add leafy greens to dinner",
    reasoning: "Iron levels slightly lower this week. Spinach & kale help.",
    pill: "Health", pillColor: "pill-green",
  },
];

const weekActivity = [45, 62, 30, 78, 55, 90, 62];
const weekLabels = ["M", "T", "W", "T", "F", "S", "S"];

export default function HospitalFlowOrchestrator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
            <Heart size={18} className="text-aura-rose" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Wellness Coach</h3>
            <p className="text-xs text-aura-slate">Personalized daily health plan</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pill pill-violet">
          <Sparkles size={10} />
          <span>AI Curated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Plans */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest">Today's AI Plan</p>
          {plans.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.07 * i }}
                className="card-white p-4 hover-lift cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}14` }}>
                    <Icon size={16} style={{ color: p.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold text-slate-800">{p.label}</p>
                      <span className={`pill text-[9px] ${p.pillColor}`}>{p.pill}</span>
                    </div>
                    <p className="text-xs font-medium text-aura-slate">{p.action}</p>
                    <p className="text-[10px] text-aura-slate/70 mt-1 leading-snug">{p.reasoning}</p>
                  </div>
                  <ChevronRight size={13} className="text-slate-300 flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Activity + streaks */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-3">Weekly Activity</p>
            <div className="card-white p-4">
              <div className="flex items-end gap-2 h-20 mb-2">
                {weekLabels.map((d, i) => {
                  const isToday = i === 6;
                  return (
                    <div key={d} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.06 * i + 0.3, duration: 0.5 }}
                        className="w-full rounded-xl"
                        style={{
                          height: `${weekActivity[i]}%`,
                          background: isToday ? "linear-gradient(180deg,#5b8def,#2dd4bf)" : "rgba(91,141,239,0.15)",
                          originY: "bottom",
                        }}
                      />
                      <span className={`text-[9px] font-semibold ${isToday ? "text-aura-primary" : "text-slate-400"}`}>{d}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">6.2k <span className="text-xs font-normal text-aura-slate">steps today</span></p>
                  <p className="text-[10px] text-aura-slate">Goal: 10k · 62% achieved</p>
                </div>
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(91,141,239,0.1),rgba(45,212,191,0.1))" }}>
                  <TrendingUp size={14} className="text-aura-primary mb-0.5" />
                  <span className="text-[10px] font-bold text-aura-primary">+8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="card-white p-4">
            <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-3">Wellness Streaks 🔥</p>
            <div className="space-y-2.5">
              {[
                { label: "Daily Steps", days: 12, color: "#5b8def" },
                { label: "Sleep Goal", days: 7, color: "#8b5cf6" },
                { label: "Hydration", days: 3, color: "#2dd4bf" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-aura-slate w-24">{s.label}</span>
                  <div className="flex-1 flex gap-1">
                    {Array.from({ length: 14 }).map((_, j) => (
                      <div
                        key={j}
                        className="flex-1 h-3 rounded-sm"
                        style={{ background: j < s.days ? s.color : "rgba(148,163,184,0.15)" }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.days}d</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
