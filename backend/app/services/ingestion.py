from sqlalchemy.orm import Session
from app.db.models.document import Document
from app.db.models.document_chunk import DocumentChunk
from app.services.embeddings import get_embedding
from app.services.text_extraction import extract_text
from app.services.chunking import chunk_text

def ingest_document(file, db: Session):
    filename = file.filename
    source_type = filename.split(".")[-1].lower()

    text = extract_text(file)
    if not text.strip():
        raise ValueError("Empty document extracted")

    document = Document(title=filename, source_type=source_type)
    db.add(document)
    db.commit()
    db.refresh(document)

    chunks = chunk_text(text)

    for idx, chunk in enumerate(chunks):
        if chunk.strip():
            emb = get_embedding(chunk)
            db.add(DocumentChunk(
                document_id=document.id,
                chunk_index=idx,
                content=chunk,
                embedding=emb
            ))

    db.commit()

    return {
        "id": document.id,
        "title": filename,
        "chunks": len(chunks)
    }
