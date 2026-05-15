"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Zap, Send, AlertCircle, CheckCircle2, Clock, ChevronRight } from "lucide-react";

const suggestions = [
  "Headache since morning", "Shortness of breath", "Chest tightness",
  "Fatigue and weakness", "Sore throat", "Stomach pain",
];

const aiAnalysis = {
  urgency: "Moderate",
  urgencyColor: "#f59e0b",
  patterns: ["Reported 3x this month", "Linked to low sleep (6.1 hrs)", "Hydration may be a factor"],
  recommendation: "Increase water intake and rest. If headache persists over 48 hrs, consult a neurologist.",
  specialist: "Neurologist",
  actions: ["Log symptom", "Set reminder", "Find nearby specialist"],
};

export default function SmartTriageAgent() {
  const [selected, setSelected] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [thinking, setThinking] = useState(false);

  const toggleSymptom = (s: string) => {
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
    setAnalyzed(false);
  };

  const analyze = () => {
    if (!selected.length) return;
    setThinking(true);
    setTimeout(() => { setThinking(false); setAnalyzed(true); }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Zap size={18} className="text-aura-violet" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Smart Symptom Analyzer</h3>
            <p className="text-xs text-aura-slate">AI-guided health insights — not a diagnosis</p>
          </div>
        </div>
        <span className="pill pill-violet">AI Powered</span>
      </div>

      {/* Symptom chips */}
      <div className="mb-4">
        <p className="text-[10px] font-bold text-aura-slate uppercase tracking-widest mb-2">What are you feeling?</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border t ${
                selected.includes(s)
                  ? "bg-aura-violet text-white border-aura-violet shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-aura-violet/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Custom input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Describe your symptoms in your own words…"
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-aura-violet/50 t"
        />
        <button
          onClick={analyze}
          disabled={!selected.length && true}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-aura-violet text-white flex items-center justify-center t hover:bg-violet-600"
        >
          <Send size={13} />
        </button>
      </div>

      <button
        onClick={analyze}
        disabled={!selected.length}
        className="w-full btn-primary py-3 rounded-2xl text-sm mb-4 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {thinking ? (
          <span className="flex items-center justify-center gap-2">
            <span className="dot-1 w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span className="dot-2 w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span className="dot-3 w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span className="ml-1">AI Analyzing…</span>
          </span>
        ) : "Analyze with AI"}
      </button>

      {/* AI result */}
      {analyzed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="rounded-2xl p-4 border" style={{ background: `${aiAnalysis.urgencyColor}08`, borderColor: `${aiAnalysis.urgencyColor}25` }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={14} style={{ color: aiAnalysis.urgencyColor }} />
              <span className="text-xs font-bold" style={{ color: aiAnalysis.urgencyColor }}>
                Urgency: {aiAnalysis.urgency}
              </span>
            </div>
            <div className="space-y-1 mb-3">
              {aiAnalysis.patterns.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={11} className="text-aura-slate" />
                  <span className="text-xs text-aura-slate">{p}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-700 font-medium leading-snug">{aiAnalysis.recommendation}</p>
          </div>

          <div className="flex gap-2">
            {aiAnalysis.actions.map((a) => (
              <button key={a} className="flex-1 text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-xl py-2 text-aura-slate hover:bg-slate-100 t">
                {a}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-aura-primary/06 border border-aura-primary/12 rounded-2xl p-3">
            <div className="w-8 h-8 rounded-xl bg-aura-primary/12 flex items-center justify-center">
              <Clock size={14} className="text-aura-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Recommended: {aiAnalysis.specialist}</p>
              <p className="text-[10px] text-aura-slate">3 available near you</p>
            </div>
            <ChevronRight size={14} className="text-aura-primary ml-auto" />
          </div>

          <p className="text-[10px] text-aura-slate text-center">
            ⚠️ This is AI health guidance, not a medical diagnosis. Always consult a doctor for serious concerns.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
