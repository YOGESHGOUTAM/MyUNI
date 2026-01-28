from sqlalchemy import text
from app.db.session import engine

FAQ_THRESHOLD=0.82

def search_faq(query_embedding:list[float]):
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT id,canonical_question,answer_en,
                embedding <-> (:v)::vector AS dist
                FROM faqs
                ORDER BY dist
                LIMIT 1 """),
            {"v":query_embedding}

        ).fetchone()

    if result and result.dist<=(1-FAQ_THRESHOLD):
        return result
    return None