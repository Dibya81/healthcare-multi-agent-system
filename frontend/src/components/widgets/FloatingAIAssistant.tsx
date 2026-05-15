"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, MessageSquare, X, Send, Sparkles } from "lucide-react";

import { useProfile } from "@/hooks/useUser";
import { useWellnessScore } from "@/hooks/useHealth";

export default function FloatingAIAssistant() {
  const { data: profile } = useProfile();
  const { data: wellness } = useWellnessScore();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const name = profile ? profile.firstName : "there";
  const score = wellness ? wellness.score : "calculating";

  const initialChat = [
    { role: "ai", text: `Hi ${name}! I've been monitoring your health today. Your wellness score is ${score} — how can I help you today?` },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 card overflow-hidden shadow-aura-lg"
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #5b8def, #2dd4bf)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Heart size={16} color="white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">Aura AI Companion</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                    <p className="text-[10px] text-white/70">Always here for you</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white t">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3" style={{ background: "#f8faff" }}>
              {initialChat.map((item, i) => (
                <div key={i} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                  {item.role === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-aura-primary to-aura-teal flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <Heart size={10} color="white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      item.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-white border border-black/06 text-slate-700 rounded-bl-sm shadow-sm"
                    }`}
                    style={item.role === "user" ? { background: "linear-gradient(135deg,#5b8def,#2dd4bf)" } : {}}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-aura-primary to-aura-teal flex items-center justify-center mr-2 flex-shrink-0">
                  <Heart size={10} color="white" />
                </div>
                <div className="bg-white border border-black/06 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-aura-slate dot-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-aura-slate dot-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-aura-slate dot-3" />
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-black/05">
              <div className="relative">
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Ask about your health…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-aura-primary/40 t"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center text-white t hover:opacity-80"
                  style={{ background: "linear-gradient(135deg,#5b8def,#2dd4bf)" }}>
                  <Send size={13} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Sparkles size={9} className="text-aura-slate/40" />
                <span className="text-[9px] text-aura-slate/40">Aura AI · Your personal health companion</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-aura-lg"
        style={{ background: open ? "#475569" : "linear-gradient(135deg,#5b8def,#2dd4bf)" }}
      >
        {open ? <X size={22} color="white" /> : <Heart size={22} color="white" />}
      </motion.button>
      {!open && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-aura-green border-2 border-white animate-pulse" />
      )}
    </div>
  );
}
