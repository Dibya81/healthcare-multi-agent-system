"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";
import HeroPanel from "@/components/sections/HeroPanel";
import BodyVisualization from "@/components/sections/BodyVisualization";
import PatientManagementAgent from "@/components/agents/PatientManagementAgent";
import DiagnosticAgent from "@/components/agents/DiagnosticAgent";
import SchedulingAgent from "@/components/agents/SchedulingAgent";
import GenomicsAgent from "@/components/agents/GenomicsAgent";
import AlertingAgent from "@/components/agents/AlertingAgent";
import ChatbotAgent from "@/components/agents/ChatbotAgent";
import FloatingAIAssistant from "@/components/widgets/FloatingAIAssistant";
import AuthModal from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
          setAuthModalOpen(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
          setAuthModalOpen(false);
      } else {
          setAuthModalOpen(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="relative min-h-screen mesh-bg">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <Sidebar active={activeSection} setActive={setActiveSection} />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <Sidebar active={activeSection} setActive={setActiveSection} mobile onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-28 lg:pb-8 space-y-5">
            {activeSection === "home" && (
                <>
                    {/* Hero: personal greeting + wellness score */}
                    <HeroPanel />

                    {/* 3D Digital Twin — centerpiece */}
                    <BodyVisualization />

                    {/* AI Health Overview + Live Intelligence */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5">
                      <div className="space-y-5">
                        <PatientManagementAgent />
                        <SchedulingAgent />
                      </div>
                      <div className="space-y-5">
                        <AlertingAgent />
                        <div className="card-white p-5">
                          <h3 className="text-sm font-bold text-slate-900 mb-3">AI Consultation</h3>
                          <ChatbotAgent />
                        </div>
                      </div>
                    </div>
                </>
            )}

            {activeSection === "vitals" && <PatientManagementAgent />}
            {activeSection === "body" && <BodyVisualization />}
            
            {/* AI Agent Routes */}
            {activeSection === "agent-pm" && <PatientManagementAgent />}
            {activeSection === "agent-dx" && <DiagnosticAgent />}
            {activeSection === "agent-sch" && <SchedulingAgent />}
            {activeSection === "agent-gen" && <GenomicsAgent />}
            {activeSection === "agent-alert" && <AlertingAgent />}
            {activeSection === "agent-qa" && <ChatbotAgent />}

            {activeSection === "wellness" && <BodyVisualization />}
            {/* Adding placeholders for missing sections to prevent blank pages */}
            {["fitness", "nutrition", "settings"].includes(activeSection) && (
                <div className="card p-12 flex flex-col items-center justify-center text-center h-64">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <span className="text-2xl opacity-50">🚧</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Coming Soon</h3>
                    <p className="text-sm text-aura-slate">The {activeSection} module is currently under development.</p>
                </div>
            )}
            
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
        <MobileNav active={activeSection} setActive={setActiveSection} />
      </div>

      {/* Floating AI Companion */}
      <FloatingAIAssistant />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
