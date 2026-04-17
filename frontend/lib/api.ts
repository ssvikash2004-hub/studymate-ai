const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UploadResult {
  document_id: string;
  filename: string;
  word_count: number;
  char_count: number;
  chunks: number;
  preview: string;
}

export interface ChatMessage {
  user: string;
  assistant: string;
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/upload`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function summarize(
  documentId: string,
  mode: "short" | "medium" | "detailed",
  language: string
): Promise<string> {
  const res = await fetch(`${API}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, mode, language }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Summarization failed");
  }
  const data = await res.json();
  return data.summary;
}

export async function askQuestion(
  documentId: string | null,
  question: string,
  history: ChatMessage[],
  language: string
): Promise<string> {
  // No document — use general chat endpoint
  if (!documentId) {
    return generalChat(question, history, language);
  }
  const res = await fetch(`${API}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      document_id: documentId,
      question,
      chat_history: history,
      language,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Q&A failed");
  }
  const data = await res.json();
  return data.answer;
}

export async function generalChat(
  question: string,
  history: ChatMessage[],
  language: string
): Promise<string> {
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, chat_history: history, language }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Chat failed");
  }
  const data = await res.json();
  return data.answer;
}

export async function generateStudyPlan(payload: {
  subject: string;
  topics: string;
  exam_date: string;
  hours_per_day: number;
  language: string;
}): Promise<string> {
  const res = await fetch(`${API}/study-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Study plan generation failed");
  }
  const data = await res.json();
  return data.plan;
}
