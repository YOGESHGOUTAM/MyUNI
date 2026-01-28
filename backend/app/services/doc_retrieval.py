from sqlalchemy import text
from app.db.session import engine

def retrieve_documents(query_embedding, k=3):
    if not query_embedding:
        return []

    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT document_chunks.document_id,
                       document_chunks.content,
                       document_chunks.chunk_index,
                       document_chunks.embedding <-> (:qvec)::vector AS distance
                FROM document_chunks
                ORDER BY distance
                LIMIT :k
            """),
            {"qvec": query_embedding, "k": k}
        )

        return result.mappings().all()
