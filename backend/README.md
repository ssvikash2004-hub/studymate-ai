# StudyMate AI – Backend

A FastAPI backend powered by Google Gemini AI.

## Setup

```bash
cd backend
pip install -r requirements.txt
```

## Configure API Key

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_key_here
```

Get your key from: https://aistudio.google.com/app/apikey

## Run

```bash
uvicorn main:app --reload --port 8000
```

API will be available at: http://localhost:8000

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload PDF/TXT file |
| POST | `/summarize` | Summarize uploaded document |
| POST | `/ask` | Ask a question about the document |
| POST | `/study-plan` | Generate a study plan |
| DELETE | `/document/{id}` | Remove a document |
