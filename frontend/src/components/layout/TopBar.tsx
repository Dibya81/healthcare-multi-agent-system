"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Menu, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useUser";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { data: profile, isLoading } = useProfile();
  const [time, setTime] = useState<Date | null>(null);
  const [greeting, setGreeting] = useState("Good Morning");

  const name = profile ? profile.firstName : "User";
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "User Profile";
  const initials = profile ? `${profile.firstName[0]}${profile.lastName[0]}` : "U";

  useEffect(() => {
    const now = new Date();
    setTime(now);
    const h = now.getHours();
    if (h < 12)       setGreeting("Good Morning");
    else if (h < 17)  setGreeting("Good Afternoon");
    else if (h < 21)  setGreeting("Good Evening");
    else              setGreeting("Good Night");

    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-black/5 px-5 py-3.5 flex items-center gap-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-800 t">
        <Menu size={20} />
      </button>

      {/* Greeting */}
      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-slate-800">
          {greeting}, <span className="text-aura-primary">{name}</span> 👋
        </p>
        <p className="text-xs text-aura-slate">
          {time ? time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : ""}
        </p>
      </div>

      {/* AI insight strip */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="flex items-center gap-2 bg-gradient-to-r from-aura-primary/8 to-aura-teal/8 border border-aura-primary/10 rounded-2xl px-4 py-2 cursor-pointer hover:shadow-aura t">
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-aura-primary dot-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-aura-primary dot-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-aura-primary dot-3" />
          </div>
          <Sparkles size={12} className="text-aura-primary" />
          <p className="text-xs font-medium text-aura-primary truncate">
            AI: Your recovery improved by 12% this week — great sleep quality!
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative w-9 h-9 rounded-2xl bg-white border border-black/06 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-sm t">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-aura-rose rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-black/06 cursor-pointer hover:opacity-80 t">
          <div className="w-9 h-9 rounded-full bg-gradient-wellness flex items-center justify-center text-white font-bold text-sm shadow-glow">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {isLoading ? "Syncing..." : fullName}
            </p>
            <p className="text-[10px] text-aura-slate">
              {profile ? `${profile.age} yrs old · ${profile.bloodType}` : "Healthcare Profile"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
