# 🎓 MyUni — Intelligent University Support System

MyUni is an AI-powered university helpdesk platform that allows students to ask questions about university processes (fees, exams, admissions, results etc.) and automatically get accurate responses using LLM + knowledge base + escalation workflows.

---

## ✨ Key Features

### 🔹 Student Side
- Anonymous login (only name & email)
- Ask questions via chat UI
- View previous chat sessions
- Automatic confidence detection
- Low-confidence → escalates to admin
- Ticket tracking (open → resolved)
- Stored history for future retrieval

### 🔹 Admin Side
- View escalated questions
- Respond directly from dashboard
- Mark resolved/closed
- Improves knowledge base over time

### 🔹 AI Layer
- LLM answer generation
- Vector search on university data
- Confidence scoring

---

## 🧱 Architecture (High-Level)
---

Student UI  →  FastAPI Backend  →  DB (PostgreSQL) ↓ LLM + Vector Search Pipeline ↓ Admin Escalation System

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- Tailwind / ShadCN UI

**Backend**
- FastAPI (Python)
- PostgreSQL + SQLAlchemy
- Alembic (migrations)
- Docker

**ML / AI**
- LLM API (OpenAI)
- pgvector / embeddings

**Deployment**
- Vercel (UI)
- Railway (Backend + DB)
- Docker containerized backend

---

## 🚀 Deployment Plan

| Component | Platform |
|---|---|
| Landing Page | Vercel |
| Student UI | Vercel |
| Admin UI | Vercel |
| Backend API | Railway |
| PostgreSQL | Railway |

---

## 🔒 Environment Variables

Backend requires:DATABASE_URL= OPENAI_API_KEY

---

## 📅 Upcoming Enhancements

- Admin login & roles
- Question clustering (Exam, Fees, Hostel, etc.)
- Multilingual support (Hindi + English)
- Push notifications for resolved queries
- Web search pre-escalation
- LLM self-improvement over time

---

## 👤 Author

Built with ❤️ by **Yogesh Gautam**

**GitHub:** https://github.com/YOGESH-GOUTAM 
**LinkedIn:** https://www.linkedin.com/in/yogesh-goutam-dtu/ 
**Email:** yogeshgoutamm@gmail.com

---

## 📜 License

MIT License