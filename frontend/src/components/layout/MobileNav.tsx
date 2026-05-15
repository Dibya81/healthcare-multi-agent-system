"use client";

import { motion } from "framer-motion";
import { Home, Activity, Brain, Moon, Shield } from "lucide-react";
import clsx from "clsx";

const items = [
  { id: "home",      icon: Home,     label: "Home" },
  { id: "agent-dx",  icon: Brain,    label: "Analyze" },
  { id: "agent-qa",  icon: Activity, label: "Ask AI" },
  { id: "agent-alert", icon: Shield, label: "Alerts" },
];

interface MobileNavProps {
  active: string;
  setActive: (id: string) => void;
}

export default function MobileNav({ active, setActive }: MobileNavProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-t border-black/06 px-4 py-2">
      <div className="flex items-center justify-around">
        {items.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.88 }}
              onClick={() => setActive(id)}
              className="flex flex-col items-center gap-1 py-1"
            >
              <div className={clsx(
                "w-10 h-10 rounded-2xl flex items-center justify-center t",
                isActive
                  ? "bg-aura-primary text-white shadow-glow"
                  : "text-slate-400 hover:text-slate-700"
              )}>
                <Icon size={19} />
              </div>
              <span className={clsx(
                "text-[10px] font-semibold t",
                isActive ? "text-aura-primary" : "text-slate-400"
              )}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
