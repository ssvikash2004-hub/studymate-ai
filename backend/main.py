from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

from services.pdf_service import (
    extract_text_from_pdf,
    extract_text_from_txt,
    chunk_text,
    get_context_window,
)
from services.gemini_service import summarize_content, answer_question, generate_study_plan

app = FastAPI(title="StudyMate AI API", version="1.0.0")

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-Memory Document Store (per session via document_id) ───────────────────
document_store: dict[str, dict] = {}

# ─── Request Models ───────────────────────────────────────────────────────────

class SummarizeRequest(BaseModel):
    document_id: str
    mode: str = "medium"
    language: str = "english"

class QuestionRequest(BaseModel):
    document_id: str
    question: str
    chat_history: Optional[list] = []
    language: str = "english"

class StudyPlanRequest(BaseModel):
    subject: str
    topics: str
    exam_date: str
    hours_per_day: int = 4
    language: str = "english"

class GeneralChatRequest(BaseModel):
    question: str
    chat_history: Optional[list] = []
    language: str = "english"

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "StudyMate AI API is running 🚀"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a PDF or text file and extract its content."""
    filename = file.filename or ""
    content_bytes = await file.read()

    if filename.lower().endswith(".pdf"):
        try:
            text = extract_text_from_pdf(content_bytes)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")
    elif filename.lower().endswith((".txt", ".md")):
        text = extract_text_from_txt(content_bytes)
    else:
        raise HTTPException(status_code=400, detail="Only PDF, TXT, and MD files are supported.")

    if not text or len(text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Could not extract meaningful text from the file. Please try another file.")

    chunks = chunk_text(text)
    document_id = filename.replace(" ", "_").replace(".", "_") + f"_{len(document_store)}"

    document_store[document_id] = {
        "filename": filename,
        "full_text": text,
        "chunks": chunks,
        "word_count": len(text.split()),
        "char_count": len(text),
    }

    return {
        "document_id": document_id,
        "filename": filename,
        "word_count": len(text.split()),
        "char_count": len(text),
        "chunks": len(chunks),
        "preview": text[:500] + "..." if len(text) > 500 else text,
    }


@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    """Summarize the uploaded document."""
    doc = document_store.get(req.document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found. Please upload a file first.")

    context = get_context_window(doc["chunks"])
    summary = summarize_content(context, mode=req.mode, language=req.language)
    return {"summary": summary, "mode": req.mode}


@app.post("/ask")
async def ask_question(req: QuestionRequest):
    """Answer a question based on the uploaded document."""
    doc = document_store.get(req.document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found. Please upload a file first.")

    context = get_context_window(doc["chunks"])
    answer = answer_question(context, req.question, req.chat_history or [], language=req.language)
    return {"answer": answer, "question": req.question}


@app.post("/study-plan")
async def create_study_plan(req: StudyPlanRequest):
    """Generate a personalized study plan."""
    plan = generate_study_plan(
        subject=req.subject,
        topics=req.topics,
        exam_date=req.exam_date,
        hours_per_day=req.hours_per_day,
        language=req.language,
    )
    return {"plan": plan}


@app.post("/general-chat")
async def general_chat(req: GeneralChatRequest):
    """Answer a general question without a document."""
    from services.gemini_service import general_answer
    answer = general_answer(req.question, req.chat_history or [], language=req.language)
    return {"answer": answer, "question": req.question}


@app.delete("/document/{document_id}")
async def delete_document(document_id: str):
    """Remove a document from the store."""
    if document_id in document_store:
        del document_store[document_id]
        return {"message": "Document removed successfully."}
    raise HTTPException(status_code=404, detail="Document not found.")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
