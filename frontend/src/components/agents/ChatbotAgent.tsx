"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSendChatMessage, useChatHistory } from "@/hooks/useAgents";
import {
  MessageSquare, Send, User, Bot, Sparkles, Plus, Search,
  History, Bookmark, Share2, Info, CheckCircle, HelpCircle,
  Stethoscope, Pill, Microscope, Loader2
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const suggestedPrompts = [
  { icon: Stethoscope, label: "Explain my last visit" },
  { icon: Pill, label: "Is my medication safe?" },
  { icon: Microscope, label: "Interpret lab results" },
  { icon: HelpCircle, label: "Wellness tips for today" },
];

export default function ChatbotAgent() {
  const { data: chatHistory, isLoading: historyLoading } = useChatHistory();
  const sendMessageMutation = useSendChatMessage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Aura, your Medical Intelligence assistant. I have access to your health records, genetic profile, and recent vitals. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessageMutation.isPending]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || sendMessageMutation.isPending) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const response = await sendMessageMutation.mutateAsync(text);
      const assistantMsg: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: Message = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting to the medical intelligence core. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-5">
      {/* Sidebar - History & Tools */}
      <div className="hidden lg:flex flex-col w-64 gap-4">
        <button className="flex items-center gap-2 w-full py-3 px-4 rounded-xl bg-aura-primary text-white font-bold shadow-aura hover:bg-aura-primary/90 t">
          <Plus size={16} /> New Consultation
        </button>

        <div className="card-white flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-black/5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-black/5 text-xs focus:outline-none"
                placeholder="Search history..."
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase px-3 py-2 tracking-widest">Recent Chats</p>
            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={16} className="text-aura-primary animate-spin" />
              </div>
            ) : chatHistory && chatHistory.length > 0 ? (
              chatHistory.map((chat: any) => (
                <button key={chat.id} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 t group">
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-aura-primary truncate">{chat.title}</p>
                  <p className="text-[10px] text-aura-slate">{chat.date}</p>
                </button>
              ))
            ) : (
              <p className="text-[10px] text-aura-slate text-center py-4">No recent history</p>
            )}
          </div>
          <div className="p-3 bg-slate-50 border-t border-black/5">
            <button className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 t">
              <span className="flex items-center gap-2"><Bookmark size={13} /> Saved Insights</span>
              <span className="text-[10px] bg-slate-200 px-1.5 rounded-full">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="card-white flex-1 flex flex-col overflow-hidden relative border-none shadow-aura-lg">
          {/* Header */}
          <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-aura-primary/10 flex items-center justify-center">
                <Bot size={20} className="text-aura-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Q&A Chatbot Agent</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-aura-slate font-medium">Personal Medical Intelligence · Online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 t"><Bookmark size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600 t"><Share2 size={18} /></button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === "user" ? "bg-slate-800" : "bg-gradient-primary"
                }`}>
                  {m.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                </div>
                <div className={`max-w-[80%] space-y-1 ${m.role === "user" ? "items-end text-right" : ""}`}>
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user" 
                      ? "bg-aura-primary text-white rounded-tr-none shadow-aura" 
                      : "bg-white text-slate-800 rounded-tl-none border border-black/5 shadow-sm"
                  }`}>
                    {m.content}
                  </div>
                  <p className="text-[10px] text-aura-slate font-medium px-1">{m.timestamp}</p>
                </div>
              </motion.div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 opacity-50">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white border border-black/5 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                  <span className="w-1 h-1 bg-aura-slate rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-aura-slate rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 bg-aura-slate rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts overlay */}
          {messages.length === 1 && (
            <div className="px-5 py-4 bg-slate-50/50 border-t border-black/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Suggested consults</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {suggestedPrompts.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleSend(p.label)}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-black/5 text-[11px] font-semibold text-slate-700 hover:border-aura-primary hover:text-aura-primary t shadow-sm"
                    >
                      <Icon size={12} /> {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-black/5">
            <div className="relative flex items-center gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <input
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-50 border border-black/8 text-sm focus:outline-none focus:ring-2 focus:ring-aura-primary/20 t"
                  placeholder="Ask anything about your health..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  disabled={sendMessageMutation.isPending}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-aura-primary t">
                  <Sparkles size={16} />
                </button>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={sendMessageMutation.isPending || !input.trim()}
                className="w-11 h-11 rounded-xl bg-aura-primary text-white flex items-center justify-center shadow-aura hover:bg-aura-primary/90 disabled:opacity-50 disabled:shadow-none t shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3">
              <p className="flex items-center gap-1 text-[10px] text-aura-slate font-medium">
                <Shield size={10} /> Secure HIPPA Encrypted
              </p>
              <p className="flex items-center gap-1 text-[10px] text-aura-slate font-medium">
                <CheckCircle size={10} /> Validated Insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Shield({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
