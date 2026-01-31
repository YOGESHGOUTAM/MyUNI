from sqlalchemy.orm import Session
from app.db.models.document import Document
from app.db.models.document_chunk import DocumentChunk
from app.services.embeddings import get_embedding
from app.services.text_extraction import extract_text
from app.services.chunking import chunk_text
from app.services.text_cleaning import clean_text


def ingest_document(file, db: Session):
    filename = file.filename
    source_type = filename.split(".")[-1].lower()

    # 1️⃣ Extract + clean text
    raw_text = extract_text(file)
    text = clean_text(raw_text)

    if not text:
        raise ValueError("Empty document extracted")

    # 2️⃣ Save cleaned text
    document = Document(
        title=filename,
        source_type=source_type,
        final_text=text
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # 3️⃣ Chunk cleaned text
    chunks = chunk_text(text)

    # 4️⃣ Embed + store
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
