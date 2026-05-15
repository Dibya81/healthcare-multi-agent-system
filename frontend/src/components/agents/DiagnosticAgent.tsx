"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagnosticHistory, useRunDiagnosis } from "@/hooks/useAgents";
import { useHealthMetrics } from "@/hooks/useHealth";
import {
  Search, Microscope, Camera, Image, ChevronRight,
  AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Zap, Brain
} from "lucide-react";

const TABS = ["AI Analyses", "Symptom Log", "Submit New"];

export default function DiagnosticAgent() {
  const { data: analyses, isLoading: analysesLoading, isError: analysesError } = useDiagnosticHistory();
  const { data: metrics } = useHealthMetrics();
  const runDiagnosis = useRunDiagnosis();

  const [activeTab, setActiveTab] = useState("AI Analyses");
  const [selected, setSelected] = useState<any | null>(null);
  const [inputText, setInputText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const severityColor = (s: string) =>
    s === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200"
    : s === "None" ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : s === "High" ? "text-rose-600 bg-rose-50 border-rose-200"
    : "text-slate-500 bg-slate-50 border-slate-200";

  const statusBadge = (s: string) =>
    s === "Normal" ? "text-emerald-700 bg-emerald-100"
    : s === "Action Required" ? "text-rose-700 bg-rose-100"
    : "text-amber-700 bg-amber-100";

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    try {
      await runDiagnosis.mutateAsync({ text: inputText });
      setAnalyzed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (analysesLoading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-40 bg-slate-50 rounded-3xl" />
      <div className="h-12 bg-slate-50 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-24 bg-slate-50 rounded-2xl" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
      </div>
    </div>
  );

  if (analysesError || !analyses) return (
    <div className="card p-12 text-center text-rose-500 bg-rose-50/30 border-rose-100">
      <AlertTriangle className="mx-auto mb-3" size={32} />
      <h3 className="text-lg font-bold">Failed to load diagnostics</h3>
      <p className="text-sm opacity-80">Unable to retrieve AI analysis history.</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-r from-violet-500/5 to-aura-primary/5 border-violet-200/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center">
            <Microscope size={22} className="text-violet-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-slate-900">Diagnostic Agent</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">Multimodal AI</span>
            </div>
            <p className="text-sm text-aura-slate">
              Advanced photo & imaging analysis correlated with your clinical history.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: "Analyses Run", value: "24", icon: Brain, color: "text-violet-600" },
            { label: "Avg Confidence", value: "86%", icon: TrendingUp, color: "text-emerald-600" },
            { label: "Actions Flagged", value: "3", icon: AlertTriangle, color: "text-amber-600" },
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
              activeTab === t ? "bg-violet-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

          {activeTab === "AI Analyses" && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
              <div className="space-y-3">
                {analyses.length === 0 ? (
                  <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No diagnostic history found.
                  </div>
                ) : (
                  analyses.map((a: any) => (
                    <button
                      key={a.id}
                      onClick={() => setSelected(selected?.id === a.id ? null : a)}
                      className={`w-full card-white p-4 text-left flex items-start gap-4 hover:border-violet-300 t ${selected?.id === a.id ? "border-violet-400" : ""}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        {a.type === "Photo Analysis" ? <Camera size={16} className="text-violet-600" />
                         : a.type === "Chest X-Ray" ? <Image size={16} className="text-violet-600" />
                         : <Zap size={16} className="text-violet-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-800">{a.type}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusBadge(a.status)}`}>{a.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-1.5">{a.input}</p>
                        <div className="flex gap-3 text-[11px] text-aura-slate">
                          <span>🗓 {a.date}</span>
                          <span>🤖 {a.aiModel}</span>
                          <span className={`font-semibold border px-1.5 rounded-full ${severityColor(a.severity)}`}>{a.severity === "None" ? "No Severity" : a.severity}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-aura-slate mb-1">Confidence</p>
                        <p className="text-lg font-bold text-violet-600">{a.confidence}%</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Detail pane */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="card-white p-5 h-fit"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold text-aura-slate">{selected.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(selected.status)}`}>{selected.status}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{selected.type}</h3>
                    <p className="text-sm text-aura-slate mb-4">{selected.input}</p>

                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">AI Findings</p>
                      <div className="space-y-2">
                        {selected.findings.map((f: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-slate-700">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Confidence Score</p>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${selected.confidence}%` }} />
                      </div>
                      <p className="text-xs text-right text-violet-600 font-bold mt-1">{selected.confidence}%</p>
                    </div>

                    <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 t">
                      View Full Report
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === "Symptom Log" && (
            <div className="space-y-3">
              <div className="p-10 text-center text-aura-slate bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                AI Pattern Correlation will appear here as you submit new symptom logs.
              </div>
            </div>
          )}

          {activeTab === "Submit New" && (
            <div className="card-white p-6 max-w-2xl">
              <h3 className="text-base font-bold text-slate-900 mb-4">Submit for AI Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Describe your symptoms or concern</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-black/8 p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400/30 resize-none"
                    placeholder="e.g., I've had a persistent rash on my right arm for 3 days, with mild itching..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-black/5">
                  <Camera size={18} className="text-violet-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">Attach Photo (Optional)</p>
                    <p className="text-xs text-aura-slate">Upload an image for visual AI analysis</p>
                  </div>
                  <button className="text-xs font-semibold text-violet-600 px-3 py-1.5 rounded-lg border border-violet-200 hover:bg-violet-50 t">
                    Upload
                  </button>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !inputText.trim()}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 t flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Analyzing with AI...</>
                  ) : analyzed ? (
                    <><CheckCircle size={16} /> Analysis Complete — View Results</>
                  ) : (
                    <><Brain size={16} /> Run AI Diagnosis</>
                  )}
                </button>
                {analyzed && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-sm font-semibold text-emerald-800 mb-1">✅ Analysis complete — results saved to your record</p>
                    <p className="text-xs text-emerald-700">Check the AI Analyses tab to view details.</p>
                  </motion.div>
                )}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
