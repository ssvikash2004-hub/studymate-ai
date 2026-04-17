"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Zap, Loader2, Copy, Check } from "lucide-react";
import { summarize } from "@/lib/api";

interface Props {
  documentId: string;
  language: string;
}

type Mode = "short" | "medium" | "detailed";

const modes: { value: Mode; label: string; desc: string; gradient: string; emoji: string }[] = [
  { value: "short",    label: "Short",    desc: "3–5 bullet points",  gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", emoji: "⚡" },
  { value: "medium",   label: "Medium",   desc: "8–12 key points",    gradient: "linear-gradient(135deg, #8b5cf6, #c084fc)", emoji: "📝" },
  { value: "detailed", label: "Detailed", desc: "Full breakdown",      gradient: "linear-gradient(135deg, #ec4899, #f472b6)", emoji: "📚" },
];

export default function SummaryPanel({ documentId, language }: Props) {
  const [mode, setMode] = useState<Mode>("medium");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const result = await summarize(documentId, mode, language);
      setSummary(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Summarization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedMode = modes.find((m) => m.value === mode)!;

  return (
    <div className="flex flex-col gap-5">
      {/* Mode selector */}
      <div className="glass-card p-5">
        <p className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-widest">Summary Mode</p>
        <div className="flex gap-3">
          {modes.map((m) => (
            <button
              key={m.value}
              id={`summary-mode-${m.value}`}
              onClick={() => setMode(m.value)}
              className="flex-1 p-4 rounded-xl text-center transition-all duration-250 cursor-pointer relative overflow-hidden"
              style={{
                background: mode === m.value ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.02)",
                border: mode === m.value ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.06)",
                transform: mode === m.value ? "scale(1.02)" : "scale(1)",
                boxShadow: mode === m.value ? "0 0 20px rgba(99,102,241,0.15)" : "none",
              }}
            >
              {mode === m.value && (
                <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: m.gradient, borderRadius: "0 0 4px 4px" }} />
              )}
              <div className="text-xl mb-1">{m.emoji}</div>
              <div
                className="text-sm font-semibold mb-0.5"
                style={{ color: mode === m.value ? "#a5b4fc" : "#64748b" }}
              >
                {m.label}
              </div>
              <div className="text-xs" style={{ color: mode === m.value ? "#6366f1" : "#374151" }}>{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        id="btn-summarize"
        onClick={handleSummarize}
        disabled={loading}
        className="btn-primary flex items-center justify-center gap-2.5 py-4 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ fontSize: "0.95rem", fontWeight: 700 }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Generating Summary…</span>
          </>
        ) : (
          <>
            <Zap size={18} />
            <span>Generate {selectedMode.label} Summary</span>
          </>
        )}
      </button>

      {/* Loading skeleton */}
      {loading && (
        <div className="glass-card p-6 space-y-3">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-4/5" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Summary output */}
      {summary && !loading && (
        <div className="glass-card p-6 animate-fade-in-up" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: selectedMode.gradient }}
              >
                {selectedMode.emoji}
              </div>
              <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {selectedMode.label} Summary
              </span>
            </div>
            <button
              id="btn-copy-summary"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: copied ? "rgba(52,211,153,0.1)" : "rgba(99,102,241,0.08)",
                border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(99,102,241,0.2)"}`,
                color: copied ? "#34d399" : "#a5b4fc",
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
