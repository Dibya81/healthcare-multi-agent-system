"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Heart, Wind, Brain, Droplets, Activity, Zap, AlertTriangle } from "lucide-react";
import { useVitals, useHealthMetrics } from "@/hooks/useHealth";

const HumanBody3D = dynamic(() => import("@/components/three/HumanBody3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-aura-teal/30 border-t-aura-teal animate-spin mx-auto mb-3" />
        <p className="text-xs text-aura-slate font-medium">Loading body model…</p>
      </div>
    </div>
  ),
});

export default function BodyVisualization() {
  const { data: vitals, isLoading: vitalsLoading } = useVitals();
  const { data: metrics, isLoading: metricsLoading } = useHealthMetrics();
  const [activeOrgan, setActiveOrgan] = useState<string | null>("heart");

  if (vitalsLoading || metricsLoading) return (
    <div className="card h-[560px] animate-pulse flex items-center justify-center bg-slate-50/50">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-aura-primary/30 border-t-aura-primary animate-spin mx-auto mb-3" />
        <p className="text-xs text-aura-slate font-bold">Synchronizing Digital Twin...</p>
      </div>
    </div>
  );

  if (!vitals || !metrics) return (
    <div className="card h-[560px] flex flex-col items-center justify-center text-rose-500 bg-rose-50/30">
      <AlertTriangle size={32} className="mb-3" />
      <h3 className="font-bold">Telemetry Offline</h3>
      <p className="text-xs opacity-80">Unable to establish connection to biometric sensors.</p>
    </div>
  );

  const organMapping = [
    { id: "heart",  icon: Heart,    label: "Heart",       vitalKey: "Heart Rate", color: "#f43f5e" },
    { id: "lung",   icon: Wind,     label: "Lungs",       vitalKey: "SpO2",       color: "#fb923c" },
    { id: "brain",  icon: Brain,    label: "Brain",       vitalKey: "Sleep",      color: "#8b5cf6" },
    { id: "blood",  icon: Droplets, label: "Blood",       vitalKey: "Hydration",  color: "#2dd4bf" },
  ];

  const organs = organMapping.map(om => {
    const v = vitals.find(v => v.name === om.vitalKey);
    const m = metrics.find(m => m.name === om.label);
    return {
      id: om.id,
      icon: om.icon,
      label: om.label,
      value: v ? `${v.value} ${v.unit}` : "N/A",
      color: om.color,
      status: v?.status || "Normal",
      insight: m?.description || `Biometric sensors show stable ${om.label.toLowerCase()} performance.`
    };
  });

  const active = organs.find((o) => o.id === activeOrgan);

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] min-h-[560px]">

        {/* ── LEFT: Organ Selector ── */}
        <div className="p-5 border-r border-black/04 flex flex-col gap-2">
          <div className="mb-2">
            <p className="text-xs font-bold text-aura-slate uppercase tracking-widest">Body Systems</p>
            <p className="text-[10px] text-aura-slate/70 mt-0.5">Tap to inspect</p>
          </div>
          {organs.map((o) => {
            const Icon = o.icon;
            const isActive = activeOrgan === o.id;
            return (
              <motion.button
                key={o.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveOrgan(isActive ? null : o.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left t border ${
                  isActive
                    ? "border-2 shadow-sm"
                    : "border-transparent bg-slate-50 hover:bg-slate-100"
                }`}
                style={isActive ? { borderColor: o.color, background: `${o.color}0d` } : {}}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 t"
                  style={{ background: isActive ? `${o.color}20` : "#f1f5f9" }}>
                  <Icon size={15} style={{ color: isActive ? o.color : "#94a3b8" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${isActive ? "text-slate-900" : "text-slate-600"}`}>{o.label}</p>
                  <p className="text-[10px] truncate" style={{ color: isActive ? o.color : "#94a3b8" }}>{o.value}</p>
                </div>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: o.color, opacity: isActive ? 1 : 0.3 }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* ── CENTER: 3D Body ── */}
        <div className="relative body-bg flex items-center justify-center overflow-hidden min-h-[480px] lg:min-h-0">
          {/* Animated scan line */}
          <div className="scan-bar absolute left-0 right-0 h-px z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(45,212,191,0.6), transparent)" }} />

          {/* Title */}
          <div className="absolute top-4 left-0 right-0 text-center z-10">
            <p className="text-xs font-bold text-aura-slate/60 uppercase tracking-widest">AI Digital Twin</p>
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <HumanBody3D activeOrgan={activeOrgan} />
          </div>

          {/* Active insight popup */}
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute bottom-5 left-4 right-4 z-20"
            >
              <div className="card-white p-3.5 border" style={{ borderColor: `${active.color}25` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: `${active.color}18` }}>
                    <active.icon size={11} style={{ color: active.color }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: active.color }}>{active.label}</span>
                  <span className="pill ml-auto text-[9px]" style={{ color: active.color, background: `${active.color}12` }}>
                    {active.status}
                  </span>
                </div>
                <p className="text-xs text-aura-slate leading-snug">{active.insight}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT: Live Biometrics ── */}
        <div className="p-5 border-l border-black/04 flex flex-col gap-3">
          <div className="mb-1">
            <p className="text-xs font-bold text-aura-slate uppercase tracking-widest">Live Biometrics</p>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-aura-green glow-pulse animate-pulse" />
              <p className="text-[10px] text-aura-green font-medium">Real-time</p>
            </div>
          </div>

          {organs.map((o, i) => {
            const Icon = o.icon;
            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`card-sm p-3 cursor-pointer hover-lift t ${activeOrgan === o.id ? "ring-2" : ""}`}
                style={{ ringColor: o.color } as React.CSSProperties}
                onClick={() => setActiveOrgan(activeOrgan === o.id ? null : o.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${o.color}14` }}>
                    <Icon size={12} style={{ color: o.color }} />
                  </div>
                  <span className="text-[10px] text-aura-slate font-medium flex-1">{o.label}</span>
                  <span className={`text-[9px] font-bold pill`} style={{ color: o.color, background: `${o.color}12` }}>{o.status}</span>
                </div>
                <p className="text-sm font-bold text-slate-800">{o.value}</p>
                {/* Mini bar */}
                <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: o.color }}
                    initial={{ width: 0 }}
                    animate={{ width: o.status === "Optimal" || o.status === "Great" || o.status === "Low" ? "92%" : "72%" }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.06 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
