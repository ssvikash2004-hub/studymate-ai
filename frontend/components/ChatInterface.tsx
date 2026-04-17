"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Trash2, Sparkles } from "lucide-react";
import { askQuestion } from "@/lib/api";
import type { ChatMessage } from "@/lib/api";

interface Props {
  documentId: string;
  language: string;
}

const SUGGESTIONS = [
  { text: "Summarize the main topic in simple terms", emoji: "📌" },
  { text: "What are the key concepts in this material?", emoji: "🔑" },
  { text: "Explain the most important points", emoji: "💡" },
  { text: "What should I focus on for the exam?", emoji: "🎯" },
];

export default function ChatInterface({ documentId, language }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;
    setInput("");
    setError("");
    setLoading(true);
    const userMsg = question.trim();
    const tempHistory = [...messages];
    try {
      const answer = await askQuestion(documentId, userMsg, tempHistory, language);
      setMessages((prev) => [...prev, { user: userMsg, assistant: answer }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to get answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #c084fc)" }}
            >
              <Sparkles size={13} color="white" />
            </div>
            <span className="text-sm font-medium text-slate-400">Try asking…</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s.text}
                id={`suggestion-${i}`}
                onClick={() => sendMessage(s.text)}
                className="text-left p-4 rounded-xl text-sm transition-all duration-200 cursor-pointer group"
                style={{
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  color: "#94a3b8",
                  animationDelay: `${i * 0.05}s`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.12)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.35)";
                  (e.currentTarget as HTMLElement).style.color = "#c7d9fe";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.15)";
                  (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <span className="text-base mr-2">{s.emoji}</span>
                {s.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex flex-col gap-5 max-h-[460px] overflow-y-auto pr-1 pb-2">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col gap-3 animate-fade-in-up">
              {/* User bubble */}
              <div className="flex justify-end items-end gap-2">
                <div className="chat-bubble-user text-sm">{msg.user}</div>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  <User size={13} color="white" />
                </div>
              </div>
              {/* AI bubble */}
              <div className="flex justify-start items-end gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #0b0f1e, #1a1f3c)", border: "1px solid rgba(99,102,241,0.25)" }}
                >
                  <Bot size={13} style={{ color: "#a5b4fc" }} />
                </div>
                <div className="chat-bubble-ai">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-bold" style={{ color: "#a5b4fc" }}>StudyMate AI</span>
                  </div>
                  <div className="markdown-content text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.assistant}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start items-end gap-2 animate-fade-in-up">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #0b0f1e, #1a1f3c)", border: "1px solid rgba(99,102,241,0.25)" }}
              >
                <Bot size={13} style={{ color: "#a5b4fc" }} />
              </div>
              <div className="chat-bubble-ai flex items-center gap-1.5 py-3 px-4">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="p-3 rounded-xl text-sm"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Input area */}
      <div
        className="glass-card p-3 flex items-end gap-3"
        style={{ border: "1px solid rgba(99,102,241,0.15)" }}
      >
        <textarea
          id="chat-input"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your material… (Enter to send)"
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none outline-none leading-relaxed"
        />
        <div className="flex flex-col gap-1.5">
          {messages.length > 0 && (
            <button
              id="btn-clear-chat"
              onClick={() => setMessages([])}
              title="Clear chat"
              className="p-2 rounded-lg transition-all"
              style={{ color: "#374151" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#ef4444";
                (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#374151";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            id="btn-send-chat"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl transition-all disabled:opacity-30"
            style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
            onMouseEnter={(e) => { if (!loading && input.trim()) (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            <Send size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
