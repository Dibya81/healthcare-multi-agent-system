"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, Zap, TrendingUp, Moon, Droplets, Wind, Brain, Sparkles, ChevronRight, AlertTriangle } from "lucide-react";
import { useVitals, useHealthMetrics, useWellnessScore } from "@/hooks/useHealth";
import { useProfile } from "@/hooks/useUser";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HeroPanel() {
  const { data: profile } = useProfile();
  const { data: vitals, isLoading: vitalsLoading } = useVitals();
  const { data: metrics, isLoading: metricsLoading } = useHealthMetrics();
  const { data: wellness, isLoading: wellnessLoading, isError: wellnessError } = useWellnessScore();

  const [insightIdx, setInsightIdx] = useState(0);
  const [scoreVisible, setScoreVisible] = useState(false);

  useEffect(() => {
    if (!metrics || metrics.length === 0) return;
    const t = setInterval(() => setInsightIdx((i) => (i + 1) % metrics.length), 4000);
    return () => clearInterval(t);
  }, [metrics]);

  useEffect(() => {
    setTimeout(() => setScoreVisible(true), 400);
  }, []);

  if (vitalsLoading || metricsLoading || wellnessLoading) return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 animate-pulse">
      <div className="h-[400px] bg-slate-50 rounded-3xl" />
      <div className="h-[400px] w-[280px] bg-slate-50 rounded-3xl" />
    </div>
  );

  if (wellnessError || !wellness || !vitals || !metrics) return (
    <div className="card p-12 text-center text-rose-500 bg-rose-50/30 border-rose-100">
      <AlertTriangle className="mx-auto mb-3" size={32} />
      <h3 className="text-lg font-bold">Failed to load health overview</h3>
      <p className="text-sm opacity-80">Real-time health telemetry is temporarily unavailable.</p>
    </div>
  );

  const insight = metrics[insightIdx] || { icon: Sparkles, text: "Analyzing your health data...", color: "#5b8def", bg: "#eff6ff" };
  const score = wellness.score;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - score / 100);

  const mappedVitals = vitals.map(v => {
    const icons: Record<string, any> = { "Heart Rate": Heart, "SpO2": Wind, "Sleep": Moon, "Hydration": Droplets };
    const colors: Record<string, string> = { "Heart Rate": "#f43f5e", "SpO2": "#5b8def", "Sleep": "#8b5cf6", "Hydration": "#2dd4bf" };
    return {
      label: v.name,
      value: v.value,
      unit: v.unit,
      icon: icons[v.name] || Heart,
      color: colors[v.name] || "#5b8def",
      trend: v.trend || "Stable",
      ok: v.status === 'Normal' || v.status === 'Optimal'
    };
  });

  const weekScores = wellness.weeklyTrend || [74, 78, 72, 80, 84, 87, 85];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5">
      {/* ─── Left: Greeting + AI insights + Week trend ─── */}
      <div className="card p-6 relative overflow-hidden">
        {/* Soft mesh background */}
        <div className="absolute inset-0 mesh-bg opacity-60 pointer-events-none rounded-3xl" />

        <div className="relative">
          {/* Greeting */}
          <div className="mb-5">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1"
            >
              Good Evening, <span className="text-aura-primary">{profile ? profile.firstName : "User"}</span> 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-aura-slate"
            >
              Here's your AI health summary for today.
            </motion.p>
          </div>

          {/* AI Insight card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border p-4 mb-5 t cursor-pointer hover-lift"
            style={{ background: insight.bg, borderColor: `${insight.color}20` }}
            key={insightIdx}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${insight.color}18` }}>
                <insight.icon size={18} style={{ color: insight.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={10} style={{ color: insight.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: insight.color }}>
                    AI Insight
                  </span>
                  {/* Insight counter dots */}
                  <div className="flex gap-1 ml-auto">
                    {metrics.map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full t"
                        style={{ background: i === insightIdx ? insight.color : "#cbd5e1" }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-snug">{insight.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Quick vitals */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {mappedVitals.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 * i + 0.2 }}
                  className="card-white p-3.5 hover-lift cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: `${v.color}14` }}>
                      <Icon size={14} style={{ color: v.color }} />
                    </div>
                    <span className={`text-[10px] font-semibold pill ${v.ok ? "pill-green" : "pill-amber"}`}>
                      {v.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 leading-none">{v.value}</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[10px] text-aura-slate">{v.unit}</span>
                    <span className="text-[10px] text-aura-slate">·</span>
                    <span className="text-[10px] text-aura-slate">{v.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Weekly trend */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-white p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-700">Weekly Wellness Trend</p>
                <p className="text-[10px] text-aura-slate">Your score over the past 7 days</p>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-aura-primary hover:text-aura-primary/70 t">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex items-end gap-2 h-16">
              {weekDays.map((day, i) => {
                const h = (weekScores[i] / 100) * 64;
                const isToday = i === 6;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ scaleY: 0, originY: 1 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.05 * i + 0.6, duration: 0.5, ease: "easeOut" }}
                      className="w-full rounded-xl"
                      style={{
                        height: h,
                        background: isToday
                          ? "linear-gradient(180deg, #5b8def, #2dd4bf)"
                          : "rgba(91,141,239,0.18)",
                      }}
                    />
                    <span className={`text-[9px] font-semibold ${isToday ? "text-aura-primary" : "text-slate-400"}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Right: Wellness Score Ring ─── */}
      <div className="card p-6 flex flex-col items-center justify-center gap-5 min-w-[220px]">
        {/* Ring */}
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            {/* Track */}
            <circle cx="70" cy="70" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            {/* Fill */}
            <motion.circle
              cx="70" cy="70" r="52"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5b8def" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-4xl font-bold text-slate-900"
            >
              {score}
            </motion.p>
            <p className="text-[11px] font-semibold text-aura-slate">/ 100</p>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles size={9} className="text-aura-teal" />
              <span className="text-[10px] font-semibold text-aura-teal">Great</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Wellness Score</p>
          <p className="text-xs text-aura-slate mt-0.5">Updated just now by AI</p>
        </div>

        {/* Sub-scores */}
        <div className="w-full space-y-3">
          {wellness.subScores.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] font-medium text-aura-slate">{s.label}</span>
                <span className="text-[11px] font-bold" style={{ color: s.color }}>{s.pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI recommendation */}
        <div className="w-full rounded-2xl bg-aura-primary/6 border border-aura-primary/12 p-3 text-center">
          <p className="text-[11px] font-medium text-aura-primary leading-snug">
            {wellness.recommendation}
          </p>
        </div>
      </div>
    </section>
  );
}
