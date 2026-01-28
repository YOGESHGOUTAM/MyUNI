from sqlalchemy import text
from app.db.session import engine


def retrieve_faqs(query_embedding, k=3):
    if not query_embedding:
        return []

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT
                    canonical_question,
                    answer_en,
                    embedding <-> (:qvec)::vector AS distance
                FROM faqs
                ORDER BY distance
                LIMIT :k
            """),
            {"qvec": query_embedding, "k": k}
        ).mappings().all()

    # 🔥 NORMALIZE OUTPUT FOR QA PIPELINE
    faqs = []
    for row in result:
        faqs.append({
            "question": row["canonical_question"],
            "answer": row["answer_en"],
            "distance": float(row["distance"])
        })

    return faqs
