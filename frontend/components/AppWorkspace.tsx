"use client";

import { useState } from "react";
import {
  BookOpen, Upload, Zap, MessageSquare, Calendar,
  Globe, ChevronRight, Info, Sparkles,
} from "lucide-react";
import FileUpload from "@/components/FileUpload";
import SummaryPanel from "@/components/SummaryPanel";
import ChatInterface from "@/components/ChatInterface";
import StudyPlanPanel from "@/components/StudyPlanPanel";
import type { UploadResult } from "@/lib/api";

type Tab = "upload" | "summary" | "chat" | "plan";

const tabs: { id: Tab; label: string; icon: React.ElementType; requiresDoc: boolean; emoji: string }[] = [
  { id: "upload",  label: "Upload",     icon: Upload,         requiresDoc: false, emoji: "📄" },
  { id: "summary", label: "Summarize",  icon: Zap,            requiresDoc: true,  emoji: "⚡" },
  { id: "chat",    label: "Q&A Chat",   icon: MessageSquare,  requiresDoc: true,  emoji: "💬" },
  { id: "plan",    label: "Study Plan", icon: Calendar,       requiresDoc: false, emoji: "📅" },
];

const tabTitles: Record<Tab, { title: string; subtitle: string; gradient: string }> = {
  upload:  { title: "Upload Study Material",   subtitle: "PDF, TXT, or MD files — AI extracts everything", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  summary: { title: "Smart Summarization",     subtitle: "AI-powered summaries from your material",        gradient: "linear-gradient(135deg, #ec4899, #f472b6)" },
  chat:    { title: "Context-Aware Q&A",       subtitle: "Ask anything about your uploaded content",       gradient: "linear-gradient(135deg, #8b5cf6, #c084fc)" },
  plan:    { title: "Study Plan Generator",    subtitle: "Personalized day-by-day study schedules",        gradient: "linear-gradient(135deg, #f472b6, #fb7185)" },
};

export default function AppWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [document, setDocument] = useState<UploadResult | null>(null);
  const [language, setLanguage] = useState<"english" | "malayalam">("english");

  const handleUploaded = (result: UploadResult) => {
    setDocument(result);
    setActiveTab("summary");
  };

  const handleTabClick = (tab: Tab) => {
    if (tabs.find((t) => t.id === tab)?.requiresDoc && !document) return;
    setActiveTab(tab);
  };

  const current = tabTitles[activeTab];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#060812" }}>
      {/* Top Nav */}
      <header
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(6,8,18,0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-glow"
            style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
          >
            <BookOpen size={17} color="white" />
          </div>
          <span
            className="font-bold text-white text-lg"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            StudyMate<span style={{ color: "#8b5cf6" }}> AI</span>
          </span>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-2">
          {document && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
            >
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 5px #34d399" }} />
              {document.filename}
            </div>
          )}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Globe size={13} style={{ color: "#475569", marginLeft: 4 }} />
            {(["english", "malayalam"] as const).map((lang) => (
              <button
                key={lang}
                id={`lang-${lang}`}
                onClick={() => setLanguage(lang)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: language === lang ? "rgba(99,102,241,0.25)" : "transparent",
                  color: language === lang ? "#a5b4fc" : "#475569",
                  boxShadow: language === lang ? "0 0 10px rgba(99,102,241,0.2)" : "none",
                }}
              >
                {lang === "english" ? "EN" : "മലയാളം"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="w-60 flex-shrink-0 flex flex-col gap-1.5 p-4 border-r overflow-y-auto"
          style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(6,8,18,0.9)" }}
        >
          <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold px-3 mb-3 mt-1">Features</p>

          {tabs.map((tab) => {
            const locked = tab.requiresDoc && !document;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                disabled={locked}
                className={`nav-tab w-full justify-between ${activeTab === tab.id ? "active" : ""} ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{tab.emoji}</span>
                  <span>{tab.label}</span>
                </div>
                {activeTab === tab.id && <ChevronRight size={13} style={{ color: "#6366f1" }} />}
              </button>
            );
          })}

          <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {document ? (
              <div
                className="p-3 rounded-xl animate-fade-in-up"
                style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)" }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Info size={11} style={{ color: "#6366f1" }} />
                  <span className="text-xs text-slate-400 font-medium">Active File</span>
                </div>
                <p className="text-xs text-slate-300 truncate font-semibold">{document.filename}</p>
                <div className="flex gap-2 mt-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                    {document.word_count.toLocaleString()} words
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}
              >
                <p className="text-xs leading-relaxed" style={{ color: "#fbbf24" }}>
                  ⬆️ Upload a file to unlock Summary and Q&A.
                </p>
              </div>
            )}
          </div>

          {/* Powered by badge */}
          <div className="mt-auto pt-4">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}
            >
              <Sparkles size={11} style={{ color: "#c084fc" }} />
              <span className="text-xs" style={{ color: "#6b7280" }}>Gemini AI via OpenRouter</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto" style={{ background: "linear-gradient(135deg, #060812 0%, #0b0f1e 100%)" }}>
          {/* Page header */}
          <div className="px-8 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: current.gradient }}
              >
                {(() => { const T = tabs.find(t => t.id === activeTab)!.icon; return <T size={15} color="white" />; })()}
              </div>
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.01em" }}
              >
                {current.title}
              </h1>
            </div>
            <p className="text-sm text-slate-500 ml-11">{current.subtitle}</p>
          </div>

          <div className="p-8">
            {activeTab === "upload" && (
              <div className="max-w-xl animate-fade-in-up">
                <FileUpload onUploaded={handleUploaded} />
                {!document && (
                  <div className="mt-6 glass-card p-6">
                    <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <span>✨</span> How it works
                    </h2>
                    <ol className="space-y-3">
                      {[
                        { step: "Upload your PDF notes or text file", color: "#6366f1" },
                        { step: "AI extracts and understands your content", color: "#8b5cf6" },
                        { step: "Get instant summaries, Q&A, or study plans", color: "#ec4899" },
                      ].map(({ step, color }, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                            style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
                          >
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {activeTab === "summary" && document && (
              <div className="max-w-2xl animate-fade-in-up">
                <SummaryPanel documentId={document.document_id} language={language} />
              </div>
            )}

            {activeTab === "chat" && document && (
              <div className="max-w-2xl animate-fade-in-up">
                <ChatInterface documentId={document.document_id} language={language} />
              </div>
            )}

            {activeTab === "plan" && (
              <div className="max-w-2xl animate-fade-in-up">
                <StudyPlanPanel language={language} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
