"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, AlertCircle, Heart, Moon, Droplets, Brain } from "lucide-react";

const insights = [
  { icon: Heart, text: "Heart rate variability improved by 8ms this week.", color: "#f43f5e", time: "Just now" },
  { icon: Moon, text: "AI suggests sleeping 30 min earlier for optimal recovery.", color: "#8b5cf6", time: "2m ago" },
  { icon: TrendingUp, text: "Wellness score hit a 3-month high today!", color: "#10b981", time: "5m ago" },
  { icon: AlertCircle, text: "Hydration 18% below daily target — time to drink water.", color: "#f59e0b", time: "8m ago" },
  { icon: Brain, text: "Stress patterns calm today — great for focused work.", color: "#5b8def", time: "12m ago" },
  { icon: Droplets, text: "Blood pressure stable. Keep up the low-sodium diet!", color: "#2dd4bf", time: "18m ago" },
];

export default function AgentActivityFeed() {
  const [feed, setFeed] = useState(insights.slice(0, 4));
  useEffect(() => {
    let idx = 4;
    const t = setInterval(() => {
      setFeed((prev) => [insights[idx % insights.length], ...prev.slice(0, 5)]);
      idx++;
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
      className="card p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-aura-violet" />
          <h3 className="font-bold text-slate-900 text-sm">AI Insights</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse" />
          <span className="text-[10px] font-semibold text-aura-green">Live</span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {feed.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={`${item.text}-${i}`}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl p-3 border hover-lift cursor-pointer"
                style={{ background: `${item.color}06`, borderColor: `${item.color}18` }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                    <Icon size={12} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">{item.text}</p>
                    <p className="text-[9px] text-aura-slate mt-1">{item.time}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* AI activity indicator */}
      <div className="mt-3 pt-3 border-t border-black/05">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-aura-primary dot-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-aura-primary dot-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-aura-primary dot-3" />
            </div>
            <span className="text-[10px] text-aura-slate font-medium">AI monitoring your health</span>
          </div>
          <span className="text-[10px] font-semibold text-aura-primary">24/7</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-aura-primary to-aura-teal"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
