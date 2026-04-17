"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { uploadFile, UploadResult } from "@/lib/api";

interface Props {
  onUploaded: (result: UploadResult) => void;
}

export default function FileUpload({ onUploaded }: Props) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setStatus("uploading");
      setErrorMsg("");
      setProgress(0);

      // Simulate progress bar while uploading
      const interval = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 8 : p));
      }, 200);

      try {
        const res = await uploadFile(file);
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setResult(res);
          setStatus("done");
          onUploaded(res);
        }, 400);
      } catch (e: unknown) {
        clearInterval(interval);
        setStatus("error");
        setErrorMsg(e instanceof Error ? e.message : "Upload failed. Please try again.");
      }
    },
    [onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"], "text/markdown": [".md"] },
    maxFiles: 1,
    disabled: status === "uploading",
  });

  const reset = () => {
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setProgress(0);
  };

  if (status === "done" && result) {
    return (
      <div className="glass-card p-6 animate-fade-in-up" style={{ border: "1px solid rgba(52,211,153,0.2)" }}>
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}
          >
            <CheckCircle size={22} style={{ color: "#34d399" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold flex items-center gap-2 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <FileText size={15} style={{ color: "#a5b4fc" }} />
              {result.filename}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                {result.word_count.toLocaleString()} words
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                {result.chunks} chunks
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.08)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                ✓ Ready for AI
              </span>
            </div>
            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{result.preview}</p>
          </div>
          <button
            id="upload-change-file"
            onClick={reset}
            className="text-xs text-slate-600 hover:text-white transition-colors flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/5"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        id="upload-dropzone"
        className="glass-card p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden"
        style={{
          border: isDragActive
            ? "2px dashed #6366f1"
            : status === "error"
            ? "2px dashed #ef4444"
            : "2px dashed rgba(99,102,241,0.25)",
          background: isDragActive ? "rgba(99,102,241,0.06)" : undefined,
          boxShadow: isDragActive ? "0 0 40px rgba(99,102,241,0.12) inset" : undefined,
        }}
      >
        {/* Subtle radial glow when dragging */}
        {isDragActive && (
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        )}

        <input {...getInputProps()} id="file-input" />

        {status === "uploading" ? (
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              <Loader2 size={30} className="animate-spin" style={{ color: "#a5b4fc" }} />
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Processing file…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: "linear-gradient(to right, #6366f1, #ec4899)" }}
                />
              </div>
            </div>
            <p className="text-slate-500 text-sm">Extracting and chunking content…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-18 h-18 rounded-2xl flex items-center justify-center p-5"
              style={{
                background: isDragActive
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(99,102,241,0.1)",
                border: `1px solid ${isDragActive ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.25)"}`,
                transition: "all 0.3s ease",
                boxShadow: isDragActive ? "0 0 30px rgba(99,102,241,0.3)" : "none",
              }}
            >
              <Upload size={30} style={{ color: isDragActive ? "white" : "#a5b4fc" }} />
            </div>
            <div>
              <p className="text-white font-semibold text-base mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {isDragActive ? "🎯 Drop it here!" : "Upload Study Material"}
              </p>
              <p className="text-slate-500 text-sm">
                Drag & drop or <span style={{ color: "#a5b4fc" }}>click to browse</span>
              </p>
              <p className="text-slate-600 text-xs mt-1">PDF · TXT · MD — up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      {status === "error" && (
        <div
          className="flex items-center gap-2 p-3.5 rounded-xl text-sm animate-fade-in-up"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
        >
          <XCircle size={16} />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
