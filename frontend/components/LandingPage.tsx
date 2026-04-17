"use client";

import { BookOpen, Brain, Zap, Calendar, MessageSquare, FileText, ArrowRight, Sparkles, Globe, Star, Shield, Cpu } from "lucide-react";

interface Props {
  onStart: () => void;
}

const features = [
  {
    icon: FileText,
    title: "Document Upload",
    desc: "Upload PDFs, notes, and text files. AI extracts and understands your content instantly.",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    glow: "rgba(99,102,241,0.4)",
  },
  {
    icon: Zap,
    title: "Smart Summarization",
    desc: "Get bullet-point summaries in short, medium, or detailed mode — tailored to your needs.",
    gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
    glow: "rgba(236,72,153,0.4)",
  },
  {
    icon: MessageSquare,
    title: "Context-Aware Q&A",
    desc: "Ask anything about your material. AI answers strictly from your uploaded content.",
    gradient: "linear-gradient(135deg, #8b5cf6, #c084fc)",
    glow: "rgba(139,92,246,0.4)",
  },
  {
    icon: Calendar,
    title: "Study Plan Generator",
    desc: "Input your exam date and topics. Get a day-by-day personalized study schedule.",
    gradient: "linear-gradient(135deg, #f472b6, #fb7185)",
    glow: "rgba(244,114,182,0.4)",
  },
  {
    icon: Globe,
    title: "Malayalam + English",
    desc: "Fully bilingual support. Get explanations in your native language for better understanding.",
    gradient: "linear-gradient(135deg, #34d399, #10b981)",
    glow: "rgba(52,211,153,0.4)",
  },
  {
    icon: Cpu,
    title: "Powered by Gemini AI",
    desc: "Google's most capable AI understands academic content and delivers precise answers.",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    glow: "rgba(251,191,36,0.4)",
  },
];

const stats = [
  { value: "10x", label: "Faster studying" },
  { value: "PDF", label: "& text support" },
  { value: "AI", label: "Powered answers" },
  { value: "Free", label: "No signup needed" },
];

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #060812 0%, #0b0f1e 50%, #060812 100%)" }}>
      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Background orbs */}
      <div className="glow-orb" style={{ width: 700, height: 700, background: "radial-gradient(circle, #6366f1, #8b5cf6)", top: -250, left: -250, opacity: 0.15 }} />
      <div className="glow-orb" style={{ width: 600, height: 600, background: "radial-gradient(circle, #ec4899, #f472b6)", bottom: -200, right: -200, opacity: 0.12 }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, #8b5cf6, #c084fc)", top: "45%", left: "35%", opacity: 0.08 }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#6366f1" : "#ec4899",
            top: `${15 + i * 13}%`,
            left: `${8 + i * 14}%`,
            opacity: 0.4,
            animation: `particle-float ${3 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Nav */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", background: "rgba(6,8,18,0.6)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow"
            style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
          >
            <BookOpen size={20} color="white" />
          </div>
          <div>
            <span className="font-bold text-lg text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
              StudyMate<span style={{ color: "#8b5cf6" }}> AI</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
            <span className="text-xs" style={{ color: "#94a3b8" }}>Powered by Gemini AI</span>
          </div>
          <button id="nav-get-started" onClick={onStart} className="btn-primary text-sm px-5 py-2.5">
            Get Started <ArrowRight size={14} style={{ display: "inline", marginLeft: 4 }} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-28 pb-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
            animationDelay: "0s",
          }}
        >
          <Sparkles size={14} style={{ color: "#fbbf24" }} />
          AI-Powered Study Assistant for Students
          <Star size={12} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
        </div>

        {/* Headline */}
        <h1
          className="text-6xl sm:text-8xl font-extrabold leading-[1.05] mb-6 animate-fade-in-up"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em", animationDelay: "0.05s" }}
        >
          Study Smarter,
          <br />
          <span className="gradient-text">Not Harder</span>
        </h1>

        <p
          className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up"
          style={{ lineHeight: 1.7, animationDelay: "0.12s" }}
        >
          Upload your notes and textbooks. Get instant AI summaries, ask questions about your material,
          and generate personalized study plans — all in one place.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <button
            id="hero-start-btn"
            onClick={onStart}
            className="btn-primary flex items-center gap-2.5 text-base px-10 py-4"
            style={{ fontSize: "1rem", fontWeight: 700 }}
          >
            <span>Start Studying Now</span>
            <ArrowRight size={18} />
          </button>
          <span className="text-slate-500 text-sm flex items-center gap-1.5">
            <Shield size={13} style={{ color: "#34d399" }} />
            Free · No signup required
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10 animate-fade-in-up" style={{ animationDelay: "0.28s" }}>
          {["📄 PDF Upload", "⚡ Instant Summary", "💬 Smart Q&A", "📅 Study Plan", "🌐 Malayalam Support"].map((badge) => (
            <span key={badge} className="badge">{badge}</span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-4" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#c084fc" }}>
            <Brain size={12} /> FEATURES
          </div>
          <h2
            className="text-4xl font-extrabold text-white mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            Everything to ace your exams
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Built for college students, competitive exam aspirants, and lifelong learners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card glass-card-hover p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.07}s`, position: "relative", overflow: "hidden" }}
            >
              {/* subtle top glow line */}
              <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: f.gradient, opacity: 0.5, borderRadius: "0 0 4px 4px" }} />

              <div
                className="feature-icon-wrap"
                style={{ background: f.gradient }}
              >
                <f.icon size={20} color="white" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 text-center px-6 py-24">
        <div
          className="relative inline-block max-w-2xl w-full mx-auto p-12 rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.25)" }}
        >
          {/* inner glow */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div className="text-5xl mb-5 animate-float">🎯</div>
          <h2 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
            Ready for your next exam?
          </h2>
          <p className="text-slate-400 mb-8 text-base">
            Join thousands of students who study smarter with AI.
          </p>
          <button
            id="cta-start-btn"
            onClick={onStart}
            className="btn-primary inline-flex items-center gap-2.5 text-base px-10 py-4"
            style={{ fontWeight: 700 }}
          >
            <span>Launch StudyMate</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-slate-600 text-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span>StudyMate AI</span>
        <span className="mx-2 text-slate-700">·</span>
        <span>Built for Hackathon</span>
        <span className="mx-2 text-slate-700">·</span>
        <span>Powered by <span style={{ color: "#8b5cf6" }}>Gemini AI</span></span>
      </footer>
    </div>
  );
}
