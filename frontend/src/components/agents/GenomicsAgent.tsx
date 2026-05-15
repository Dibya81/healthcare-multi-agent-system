"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenomicProfile } from "@/hooks/useAgents";
import {
  Dna, TrendingUp, Shield, AlertTriangle, ChevronDown,
  ChevronRight, Info, BarChart3, Microscope, Sparkles
} from "lucide-react";

const riskColor = (l: string) =>
  l === "High" || l === "high" ? "text-rose-600 bg-rose-50 border-rose-200"
  : l === "Moderate" || l === "moderate" ? "text-amber-600 bg-amber-50 border-amber-200"
  : l === "Low-Moderate" || l === "low-moderate" ? "text-orange-600 bg-orange-50 border-orange-200"
  : "text-emerald-600 bg-emerald-50 border-emerald-200";

const riskBarColor = (l: string) =>
  l === "High" || l === "high" ? "bg-rose-500"
  : l === "Moderate" || l === "moderate" ? "bg-amber-500"
  : l === "Low-Moderate" || l === "low-moderate" ? "bg-orange-400"
  : "bg-emerald-500";

const TABS = ["Risk Profile", "Traits", "Variants"];

export default function GenomicsAgent() {
  const { data: genomics, isLoading: genomicsLoading, isError: genomicsError } = useGenomicProfile();
  
  const [activeTab, setActiveTab] = useState("Risk Profile");
  const [expanded, setExpanded] = useState<string | null>(null);

  if (genomicsLoading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-40 bg-slate-50 rounded-3xl" />
      <div className="h-12 bg-slate-50 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-24 bg-slate-50 rounded-2xl" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
      </div>
    </div>
  );

  if (genomicsError || !genomics) return (
    <div className="card p-12 text-center text-rose-500 bg-rose-50/30 border-rose-100">
      <Dna className="mx-auto mb-3" size={32} />
      <h3 className="text-lg font-bold">Failed to load genomic data</h3>
      <p className="text-sm opacity-80">Unable to retrieve genetic risk profile.</p>
    </div>
  );

  const { risks = [], traits = [], variants = [], summary = {} } = genomics;
  
  const profile = {
    sampleId: summary.sampleId || "GEN-2024-WJ-001",
    sequenced: summary.sequenced || "2024-09-15",
    coverage: summary.coverage || "30x Whole Genome",
    variants: variants.length,
    pathogenic: variants.filter((v: any) => v.classification === 'Pathogenic').length,
    likelySig: variants.filter((v: any) => v.classification === 'Significant').length,
    vus: summary.vus || 0,
  };
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-r from-rose-500/5 to-violet-500/5 border-rose-200/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
              <Dna size={22} className="text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900">Genomics Agent</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Precision Medicine</span>
              </div>
              <p className="text-sm text-aura-slate">
                Genetic variant analysis, health risk pipelines, and personalized prevention insights.
              </p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs text-aura-slate">Sample ID</p>
            <p className="text-sm font-bold text-slate-800">{profile.sampleId}</p>
          </div>
        </div>

        {/* Genomic Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label: "Variants Analyzed", value: profile.variants.toLocaleString(), color: "text-slate-800" },
            { label: "Pathogenic Variants", value: profile.pathogenic.toString(), color: "text-rose-600" },
            { label: "Likely Significant", value: profile.likelySig.toString(), color: "text-amber-600" },
            { label: "Variants of Unc. Sig.", value: profile.vus.toString(), color: "text-slate-500" },
          ].map(s => (
            <div key={s.label} className="bg-white/70 rounded-2xl p-3 text-center border border-white">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-aura-slate mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-aura-slate bg-white/50 rounded-xl px-3 py-2 border border-white/80">
          <Info size={12} className="shrink-0 text-aura-primary" />
          <span>Sequenced {profile.sequenced} · {profile.coverage} · Analyzed with variant pipeline v3.2</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/60 border border-black/5 rounded-2xl">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 text-sm font-semibold py-2 rounded-xl t ${activeTab === t ? "bg-rose-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

          {activeTab === "Risk Profile" && (
            <div className="space-y-3">
              {risks.length === 0 ? (
                <div className="p-10 text-center text-aura-slate bg-slate-50 rounded-3xl border border-dashed border-slate-200">No genomic risk markers identified.</div>
              ) : (
                risks.map((r: any) => (
                  <div key={r.condition} className="card-white overflow-hidden">
                    <button
                      className="w-full p-4 text-left flex items-center gap-4"
                      onClick={() => setExpanded(expanded === r.condition ? null : r.condition)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-bold text-slate-900">{r.condition}</h3>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${riskColor(r.level)}`}>{r.level}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-[11px] text-aura-slate mb-1">
                              <span>Your genetic risk</span>
                              <span className="font-bold">{r.risk}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(r.risk * 2, 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${riskBarColor(r.level)}`}
                              />
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[11px] text-aura-slate">Population</p>
                            <p className="text-xs font-bold text-slate-600">{r.population}%</p>
                          </div>
                        </div>
                      </div>
                      <ChevronDown size={14} className={`text-slate-400 shrink-0 t ${expanded === r.condition ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {expanded === r.condition && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-slate-100">
                            <div className="pt-3 space-y-2">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-semibold text-slate-600">Key Variant:</span>
                                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-700 font-mono">{r.variant}</code>
                              </div>
                              <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5">
                                <Sparkles size={12} className="text-aura-primary shrink-0 mt-0.5" />
                                <span>{r.insight}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Traits" && (
            <div className="space-y-3">
              {traits.length === 0 ? (
                <div className="p-10 text-center text-aura-slate bg-slate-50 rounded-3xl border border-dashed border-slate-200">No genetic traits data found.</div>
              ) : (
                traits.map((t: any, i: number) => (
                  <div key={i} className="card-white p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                      <Dna size={16} className="text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{t.trait}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-aura-primary/10 text-aura-primary">{t.result}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-violet-700">{t.gene}</code>
                      </div>
                      <p className="text-xs text-aura-slate">{t.impact}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Variants" && (
            <div className="card-white p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                  <Microscope size={18} className="text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Genomic Variants ({variants.length} found)</p>
                  <p className="text-xs text-aura-slate">Clinically significant variants identified in your genome.</p>
                </div>
              </div>
              <div className="space-y-3">
                {variants.length === 0 ? (
                   <div className="p-8 text-center text-aura-slate bg-slate-50 rounded-2xl border border-dashed border-slate-200">No pathogenic variants detected.</div>
                ) : (
                  variants.map((v: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/60">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-black text-rose-700 font-mono">{v.gene}</code>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">{v.classification}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-aura-slate">Variant:</span> <code className="font-mono text-violet-700 bg-white/60 px-1 rounded">{v.rsid}</code></div>
                        <div><span className="text-aura-slate">Zygosity:</span> <span className="font-semibold text-slate-700">{v.zygosity}</span></div>
                        <div className="col-span-2"><span className="text-aura-slate">Associated with:</span> <span className="font-semibold text-slate-700"> {v.condition}</span></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
