from app.services.chat_store import save_message
from app.services.escalation import create_escalation
from app.services.chat_history import get_recent_messages
from app.services.language import detect_language
from app.services.embeddings import get_embedding
from app.services.retrieval import retrieve_faqs
from app.services.doc_retrieval import retrieve_documents
from app.services.prompt import build_prompt
from app.services.llm import generate_answer


FAQ_THRESHOLD = 0.85
DOC_THRESHOLD = 0.95   # more relaxed since PDFs vary


def answer_question(db, question: str, session_id: str | None = None):
    # ✍️ Save user message
    save_message(db, session_id, "user", question)

    lang = detect_language(question)
    query_emb = get_embedding(question)

    # ------------------ 1. FAQ MATCH ------------------
    faqs = retrieve_faqs(query_emb)
    if faqs:
        best = faqs[0]
        if best["distance"] <= FAQ_THRESHOLD:
            answer = best["answer"]
            save_message(db, session_id, "assistant", answer)
            return {
                "source": "faq",
                "answer": answer,
                "confidence": 1 - best["distance"],
                "escalated": False
            }

    # ------------------ 2. DOCUMENT MATCH ------------------
    docs = retrieve_documents(query_emb)
    doc_context = None

    if docs and docs[0]["distance"] <= DOC_THRESHOLD:
        # take top 3 chunks
        doc_context = docs[:3]

        # build prompt with documents
        chat_history = get_recent_messages(db, session_id)

        prompt = build_prompt(
            question=question,
            chat_history=chat_history,
            faq=None,
            doc_context=doc_context,
            lang=lang
        )

        answer = generate_answer(prompt)
        save_message(db, session_id, "assistant", answer)

        return {
            "source": "documents+llm",
            "answer": answer,
            "confidence": 1 - docs[0]["distance"],
            "escalated": False
        }

    # ------------------ 3. NO MATCH → ESCALATE ------------------
    escalation = create_escalation(
        db=db,
        question=question,
        bot_answer=None,
        confidence=0.0,
        session_id=session_id,
    )

    final_answer = (
        "I’m not fully sure about this yet. "
        "Your question has been forwarded to the university administration. "
        "You will get a verified response soon."
    )

    save_message(db, session_id, "assistant", final_answer)

    return {
        "source": "escalation",
        "answer": final_answer,
        "confidence": 0.0,
        "escalated": True,
        "escalation_id": escalation.id
    }
