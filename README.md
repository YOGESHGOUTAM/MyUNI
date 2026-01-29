# 🎓 MyUni — Intelligent University Support System
![FastAPI](https://img.shields.io/badge/FastAPI-Production-green)
![Docker](https://img.shields.io/badge/Containerized-Docker-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

> Production-oriented AI helpdesk engineered with reliability, confidence control, and human-in-the-loop safeguards.

MyUni is an AI-powered university support platform that delivers accurate answers to student queries while preventing hallucinations through a structured knowledge hierarchy and escalation workflow.

🟢 **Status: Live & Production-Deployed**

> Running with real infrastructure on Railway + Vercel.

Unlike typical chatbot demos, MyUni prioritizes deterministic retrieval before generation, ensuring institutional-grade trust.

---

## 🚀 Live Applications

* **🌐 Landing Page:** [https://myuniweb.vercel.app/](https://myuniweb.vercel.app/)
* **🎓 Student Portal:** [https://myunistudent.vercel.app/](https://myunistudent.vercel.app/)
* **🛠 Admin Dashboard:** [https://myuniadmin.vercel.app/](https://myuniadmin.vercel.app/)

---

## 🟢 Try MyUni Instantly (Recommended)

You can explore the fully deployed production system without any setup:

| Portal | Link |
| --- | --- |
| **🌐 Landing Page** | [https://myuniweb.vercel.app/](https://myuniweb.vercel.app/) |
| **🎓 Student Portal** | [https://myunistudent.vercel.app/](https://myunistudent.vercel.app/) |
| **🛠 Admin Dashboard** | [https://myuniadmin.vercel.app/](https://myuniadmin.vercel.app/) |

**Student Login:**
Simply enter any email and optional name — a user record is created automatically.

> Designed for frictionless evaluation.

---

## ✨ Core Capabilities

### 🎓 Student Experience

* Minimal login (name + email)
* Conversational AI interface
* Persistent chat sessions
* Retrieval-backed responses
* Confidence-aware answer routing
* Automatic human escalation
* Ticket lifecycle tracking
* Admin replies visible inside chats

### 🛠 Admin Operations

* Dedicated escalation dashboard
* Respond to unresolved queries
* Resolution workflow management
* Structured dataset generation for AI improvement

---

## 🧠 Intelligent Answer Pipeline (Confidence-Based)

MyUni follows a hierarchical knowledge resolution strategy designed for maximum correctness.

1. **1️⃣ FAQ Match (Highest Confidence)**
* Exact / canonical answers
* Zero hallucination risk
* Lowest latency


2. **2️⃣ Semantic Document Retrieval**
* pgvector similarity search
* University documents
* Retrieval-Augmented Generation


3. **3️⃣ LLM Generation Layer**
* Context-aware response synthesis
* Confidence scoring applied


4. **4️⃣ Human Escalation**
* Routed to admin dashboard
* Expert response returned to student



---

## ✅ Why This Matters

Most AI systems incorrectly use this flow:
`User → LLM → Hope for correctness`

**MyUni instead uses:**
`Deterministic → Retrieval → Generative → Human`

This architecture is considered a production best practice for institutional AI systems.

**Benefits:**

* ✔ drastically reduced hallucinations
* ✔ lower API cost
* ✔ faster responses
* ✔ explainable answers
* ✔ safer automation

---

## 🧱 High-Level Architecture

```text
                ┌──────────────┐
                │   Student UI │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │   FastAPI    │
                └──────┬───────┘
                       ↓
        ┌────────────────────────────┐
        │ Retrieval Pipeline         │
        │ FAQ → pgvector → LLM       │
        └──────────┬─────────────────┘
                   ↓
           Confidence Engine
            ↓            ↓
         Return       Escalate
         Answer       to Admin

```

---

## 🛠 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React (Vite), TailwindCSS, Component-driven UI |
| **Backend** | FastAPI, SQLAlchemy ORM, Alembic migrations, Dockerized runtime |
| **Database** | PostgreSQL, pgvector for semantic retrieval |
| **AI Layer** | OpenAI API, Embedding similarity search, Confidence scoring pipeline |

---

## 🧠 System Design Philosophy

MyUni was built with a production-first mindset, optimizing for correctness over novelty.

### ✅ Retrieval Before Generation

LLMs are powerful — but not authoritative. Therefore MyUni enforces:

> Never generate when verified knowledge exists.

This dramatically improves institutional trust.

### ✅ Human-in-the-Loop AI

Confidence scoring ensures uncertain answers never reach students unchecked.
`LLM → Confidence Check → Escalate if Needed`

### ✅ PostgreSQL + pgvector Strategy

Instead of prematurely adopting a dedicated vector DB, MyUni embeds vectors inside Postgres for transactional consistency and simplified infrastructure.

---

## ⚖️ Engineering Tradeoffs

* **Why Not Fine-Tuning?** RAG allows instant knowledge updates without retraining.
* **Why Not LangChain?** Direct pipeline control ensures predictable latency.
* **Why Not MongoDB?** University workflows are relational by nature.

---

## 📈 Scalability Roadmap

* **Phase 1 — Current:** FastAPI, PostgreSQL, pgvector
* **Phase 2 — Growth:** Redis caching, background workers, async ingestion
* **Phase 3 — High Scale:** read replicas, dedicated vector DB, Kubernetes

---


## 💻 Running Locally

If you prefer to run MyUni on your own infrastructure:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOGESH-GOUTAM/myuni.git
cd myuni

```

### 2️⃣ Configure Environment Variables

Create a `.env` file inside the backend directory:

## 🔒 Environment Variables

```env
DATABASE_URL=your_database_url
EMBEDDING_API_URL=https://api.openai.com/v1/embeddings
EMBEDDING_API_KEY=your_openai_key
EMBEDDING_MODEL=text-embedding-3-large
LLM_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_API_KEY=your_openai_key
LLM_MODEL=gpt-4o-mini

```


### 3️⃣ Start With Docker (Recommended)

```bash
docker compose up --build

```

The backend, database, and dependencies will start automatically.

### 4️⃣ Launch Frontends

```bash
cd student-ui
npm install
npm run dev

```

*Repeat for admin and landing if running locally.*

---

## 📚 API Documentation

FastAPI automatically exposes interactive Swagger docs:
`/docs`

**Example:**
`https://your-backend-url/docs`

---

## 🔥 What Makes MyUni Different?

MyUni is not a demo chatbot. It is engineered using production AI design patterns:

1. Retrieval before generation
2. Confidence-gated responses
3. Human-in-the-loop escalation
4. Containerized deployment
5. Modular backend architecture

---

## 📅 Upcoming Enhancements

* 🔐 Admin authentication & RBAC
* 🧠 Query clustering (exams, hostel, fees, etc.)
* 🌍 Multilingual support
* 🔔 Push notifications for resolved queries
* 🌐 Web search before escalation
* 📊 Self-improving knowledge loop

---

## 👨‍💻 Author

Built with ❤️ by **Yogesh Gautam**

* **GitHub:** [https://github.com/YOGESH-GOUTAM](https://github.com/YOGESH-GOUTAM)
* **LinkedIn:** [https://www.linkedin.com/in/yogesh-goutam-dtu/](https://www.linkedin.com/in/yogesh-goutam-dtu/)
* **Email:** [Email me](mailto:yogeshgoutamm@gmail.com)

---

## 📜 License

MIT License

---

⭐ **If you find this project valuable, consider starring the repo!**
