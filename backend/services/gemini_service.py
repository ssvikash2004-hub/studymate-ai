from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

MODEL = "google/gemini-2.0-flash-lite-001"


def _chat(prompt: str) -> str:
    """Send a prompt to OpenRouter and return the text response."""
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content or ""


def summarize_content(text: str, mode: str = "medium", language: str = "english") -> str:
    """Generate a summary of the provided text."""
    lang_instruction = "Respond in Malayalam." if language == "malayalam" else "Respond in English."

    length_map = {
        "short": "Provide a very concise summary in 3-5 bullet points.",
        "medium": "Provide a detailed summary with 8-12 bullet points covering key concepts, important definitions, and main ideas.",
        "detailed": "Provide a comprehensive summary with sections, bullet points, key concepts, important terms, and any formulas or facts mentioned.",
    }
    length_instruction = length_map.get(mode, length_map["medium"])

    prompt = f"""You are an expert study assistant. {lang_instruction}

Analyze the following study material and {length_instruction}

Format your response with:
- 📌 A title/topic line
- 🔑 Key Concepts section
- 📝 Main Points (as bullet points)
- ⚡ Quick Facts (if any)

Study Material:
\"\"\"
{text}
\"\"\"
"""
    return _chat(prompt)


def answer_question(context: str, question: str, chat_history: list, language: str = "english") -> str:
    """Answer a question based on the provided context and chat history."""
    lang_instruction = "Respond in Malayalam." if language == "malayalam" else "Respond in English."

    history_text = ""
    if chat_history:
        history_text = "\n\nPrevious conversation:\n"
        for msg in chat_history[-6:]:  # last 3 Q&A pairs
            history_text += f"User: {msg['user']}\nAssistant: {msg['assistant']}\n\n"

    prompt = f"""You are a helpful study assistant. {lang_instruction}
Answer the student's question STRICTLY based on the provided study material below.
If the answer is not found in the material, say "I couldn't find information about this in your uploaded material."
Always be encouraging and clear.
{history_text}
Study Material:
\"\"\"
{context}
\"\"\"

Student's Question: {question}

Provide a clear, well-structured answer with:
- Direct answer to the question
- Supporting details from the material
- Examples if relevant
- If applicable, mention which part of the material this comes from
"""
    return _chat(prompt)


def generate_study_plan(subject: str, topics: str, exam_date: str, hours_per_day: int, language: str = "english") -> str:
    """Generate a personalized study plan."""
    lang_instruction = "Respond in Malayalam." if language == "malayalam" else "Respond in English."

    prompt = f"""You are an expert academic planner. {lang_instruction}

Create a detailed, realistic day-by-day study plan for a student.

Subject: {subject}
Topics to cover: {topics}
Exam Date: {exam_date}
Available study hours per day: {hours_per_day} hours

Create a structured study plan with:
📅 Day-by-day schedule (e.g., Day 1, Day 2...)
For each day include:
  - 📖 Topic(s) to study
  - ⏰ Time allocation
  - 🔄 Revision tasks
  - 💡 Study tips for that topic

Also include:
- 🎯 Final week revision strategy
- ✅ Pre-exam day checklist

Make it practical, motivating, and achievable.
"""
    return _chat(prompt)


def general_answer(question: str, chat_history: list, language: str = "english") -> str:
    """Answer a general question without any document context."""
    lang_instruction = "Respond in Malayalam." if language == "malayalam" else "Respond in English."

    history_text = ""
    if chat_history:
        history_text = "\n\nPrevious conversation:\n"
        for msg in chat_history[-6:]:
            history_text += f"User: {msg['user']}\nAssistant: {msg['assistant']}\n\n"

    prompt = f"""You are StudyMate AI, a friendly and knowledgeable study assistant. {lang_instruction}
Answer the student's question helpfully and clearly. You can answer general knowledge questions,
explain concepts, help with studying, or assist with any academic topic.
{history_text}
Student's Question: {question}

Provide a clear, well-structured, and encouraging answer.
"""
    return _chat(prompt)
