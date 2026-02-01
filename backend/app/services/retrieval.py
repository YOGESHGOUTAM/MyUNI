from sqlalchemy import text
from app.db.session import engine


def retrieve_faqs(query_embedding, k=3):
    if not query_embedding:
        return []

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT
                    fq.question_text AS matched_question,
                    f.canonical_question,
                    f.answer_en,
                    fq.embedding <-> (:qvec)::vector AS distance
                FROM faq_questions fq
                JOIN faqs f ON f.id = fq.faq_id
                ORDER BY distance
                LIMIT :k
            """),
            {"qvec": query_embedding, "k": k}
        ).mappings().all()

    # 🔥 Normalize output for QA pipeline
    faqs = []
    for row in result:
        faqs.append({
            "question": row["canonical_question"],      # main FAQ question
            "matched_variant": row["matched_question"], # what actually matched
            "answer": row["answer_en"],
            "distance": float(row["distance"]),
        })

    return faqs
