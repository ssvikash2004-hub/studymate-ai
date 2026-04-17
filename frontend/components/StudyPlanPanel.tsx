"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Loader2, BookOpen, Copy, Check } from "lucide-react";
import { generateStudyPlan } from "@/lib/api";

interface Props {
  language: string;
}

export default function StudyPlanPanel({ language }: Props) {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState(4);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleGenerate = async () => {
    if (!subject.trim() || !topics.trim() || !examDate) return;
    setLoading(true);
    setError("");
    setPlan("");
    try {
      const result = await generateStudyPlan({
        subject: subject.trim(),
        topics: topics.trim(),
        exam_date: examDate,
        hours_per_day: hours,
        language,
      });
      setPlan(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate study plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValid = subject.trim() && topics.trim() && examDate;

  return (
    <div className="flex flex-col gap-5">
      {/* Form */}
      <div className="glass-card p-6 space-y-5">
        {/* Subject */}
        <div>
          <label className="text-xs text-slate-500 font-semibold mb-2 block uppercase tracking-wider" htmlFor="plan-subject">
            📚 Subject / Course
          </label>
          <input
            id="plan-subject"
            type="text"
            placeholder="e.g. Data Structures, Physics, History"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="fancy-input"
          />
        </div>

        {/* Topics */}
        <div>
          <label className="text-xs text-slate-500 font-semibold mb-2 block uppercase tracking-wider" htmlFor="plan-topics">
            🗂️ Topics to Cover
          </label>
          <textarea
            id="plan-topics"
            rows={3}
            placeholder="e.g. Arrays, Linked Lists, Trees, Sorting, Dynamic Programming"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="fancy-input"
            style={{ resize: "none", lineHeight: "1.6" }}
          />
        </div>

        {/* Date + Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-2 block uppercase tracking-wider" htmlFor="plan-date">
              📅 Exam Date
            </label>
            <input
              id="plan-date"
              type="date"
              min={minDate}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="fancy-input"
              style={{ colorScheme: "dark" }}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-2 block uppercase tracking-wider" htmlFor="plan-hours">
              ⏰ Hours/Day:{" "}
              <span className="font-bold" style={{ color: "#a5b4fc" }}>{hours}h</span>
            </label>
            <input
              id="plan-hours"
              type="range"
              min={1}
              max={10}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full mt-3"
              style={{ accentColor: "#6366f1" }}
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>1h</span><span>10h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        id="btn-generate-plan"
        onClick={handleGenerate}
        disabled={loading || !isValid}
        className="btn-primary flex items-center justify-center gap-2.5 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ fontSize: "0.95rem", fontWeight: 700 }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Building Your Study Plan…</span>
          </>
        ) : (
          <>
            <Calendar size={18} />
            <span>Generate Study Plan</span>
          </>
        )}
      </button>

      {/* Loading skeleton */}
      {loading && (
        <div className="glass-card p-6 space-y-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 15, width: `${65 + (i % 4) * 9}%` }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Plan output */}
      {plan && !loading && (
        <div className="glass-card p-6 animate-fade-in-up" style={{ border: "1px solid rgba(236,72,153,0.15)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f472b6, #fb7185)" }}
              >
                <BookOpen size={15} color="white" />
              </div>
              <div>
                <span className="font-semibold text-white text-sm block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Your Personalized Study Plan
                </span>
                <span className="text-xs text-slate-500">{subject}</span>
              </div>
            </div>
            <button
              id="btn-copy-plan"
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
          <div className="markdown-content max-h-[520px] overflow-y-auto pr-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
