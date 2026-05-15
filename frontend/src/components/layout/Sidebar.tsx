"use client";

import { motion } from "framer-motion";
import {
  Home, Activity, Brain, Zap, Heart, Moon, Apple,
  Dumbbell, Shield, Bell, Settings, X, ChevronDown, Sparkles,
  User, Microscope, Calendar, MessageSquare
} from "lucide-react";
import { useProfile } from "@/hooks/useUser";
import { useWellnessScore } from "@/hooks/useHealth";
import clsx from "clsx";

const navItems = [
  { id: "home",       icon: Home,      label: "Overview",         group: "main" },
  { id: "vitals",     icon: Activity,  label: "Live Vitals",      group: "main", badge: "●" },
  { id: "body",       icon: Brain,     label: "Body Insights",    group: "main" },
  
  // 6 Specialized AI Agents
  { id: "agent-pm",   icon: User,      label: "Patient Mgmt",     group: "agents", badge: "AI" },
  { id: "agent-dx",   icon: Microscope,label: "Diagnostics",      group: "agents", badge: "AI" },
  { id: "agent-sch",  icon: Calendar,  label: "Scheduling",       group: "agents", badge: "AI" },
  { id: "agent-gen",  icon: Brain,     label: "Genomics",         group: "agents", badge: "AI" },
  { id: "agent-alert",icon: Bell,      label: "Alerting",         group: "agents", badge: "AI" },
  { id: "agent-qa",   icon: MessageSquare, label: "Medical Q&A",  group: "agents", badge: "AI" },

  { id: "wellness",   icon: Heart,     label: "Wellness OS",      group: "wellness" },
  { id: "settings",   icon: Settings,  label: "Settings",         group: "more" },
];

const groups = [
  { key: "main",     label: "Health" },
  { key: "agents",   label: "AI Agents" },
  { key: "wellness", label: "Wellness" },
  { key: "more",     label: "More" },
];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ active, setActive, mobile, onClose }: SidebarProps) {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: wellness, isLoading: wellnessLoading } = useWellnessScore();

  const score = wellness?.score || 0;
  const userName = profile ? `${profile.firstName} ${profile.lastName}` : "User";
  const userInitials = profile ? `${profile.firstName[0]}${profile.lastName[0]}` : "U";
  return (
    <aside
      className={clsx(
        "flex flex-col h-screen w-56 bg-white/80 backdrop-blur-xl border-r border-black/5",
        mobile && "fixed left-0 top-0 z-50 shadow-2xl"
      )}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Heart size={15} color="white" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">Aura Health</p>
            <div className="flex items-center gap-1">
              <Sparkles size={9} className="text-aura-teal" />
              <p className="text-[10px] text-aura-slate font-medium">AI-Powered</p>
            </div>
          </div>
        </div>
        {mobile && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 t">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Wellness score mini */}
      <div className="mx-4 mb-4 rounded-2xl p-3 bg-gradient-to-r from-aura-primary/10 to-aura-teal/10 border border-aura-primary/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-aura-slate uppercase tracking-wider">Wellness Score</span>
          <span className="text-xs font-bold text-aura-primary">{score}/100</span>
        </div>
        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-aura-primary to-aura-teal"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] text-aura-slate mt-1">
          {wellnessLoading ? "Recalculating..." : "↑ 5 pts from last week"}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-4">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group.key);
          if (!items.length) return null;
          return (
            <div key={group.key}>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.12em] px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setActive(item.id); onClose?.(); }}
                      className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm t",
                        isActive
                          ? "nav-active font-semibold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium"
                      )}
                    >
                      <Icon size={16} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className={clsx(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                          item.badge === "AI"
                            ? "bg-aura-violet/10 text-aura-violet"
                            : isActive
                              ? "text-aura-primary"
                              : "text-aura-rose"
                        )}>
                          {item.badge === "●" ? (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-aura-green animate-pulse" />
                          ) : item.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-black/5">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-2xl hover:bg-slate-50 t cursor-pointer">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-wellness flex items-center justify-center text-white font-bold text-sm">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {profileLoading ? "Loading..." : userName}
            </p>
            <p className="text-[10px] text-aura-slate truncate">
              {profile ? `${profile.age} yrs · Blood type ${profile.bloodType}` : "Syncing..."}
            </p>
          </div>
          <ChevronDown size={13} className="text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
