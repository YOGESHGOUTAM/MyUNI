from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import delete
from app.db.session import get_db
from app.db.models.document import Document
from app.db.models.document_chunk import DocumentChunk
from app.services.ingestion import ingest_document
from app.services.chunking import chunk_text
from app.services.embeddings import get_embedding
from app.services.text_cleaning import clean_text
from app.schemas.document import DocumentUpdateRequest
import uuid

router = APIRouter(prefix="/documents", tags=["Admin Documents"])

MIN_CHARS = 40


# -------------------- Upload --------------------
@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        return ingest_document(file, db)
    except Exception as e:
        print("\n🔥 DOCUMENT UPLOAD ERROR:", e, "\n")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------- List --------------------
@router.get("/")
def list_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.created_at.desc()).all()


# -------------------- Get document text --------------------
@router.get("/{doc_id}")
def get_document(doc_id: uuid.UUID, db: Session = Depends(get_db)):
    doc = db.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": doc.id,
        "title": doc.title,
        "source_type": doc.source_type,
        "final_text": doc.final_text,
        "created_at": doc.created_at
    }


# -------------------- Edit document text + re-embed (TRANSACTION SAFE) --------------------
@router.put("/{doc_id}")
def update_document_text(
    doc_id: uuid.UUID,
    payload: DocumentUpdateRequest,
    db: Session = Depends(get_db)
):
    new_text = clean_text(payload.final_text)

    if not new_text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    doc = db.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        # 1️⃣ Update document text
        doc.final_text = new_text

        # 2️⃣ Delete old chunks
        db.execute(
            delete(DocumentChunk).where(
                DocumentChunk.document_id == doc_id
            )
        )

        # 3️⃣ Re-chunk
        chunks = [
            c for c in chunk_text(new_text)
            if len(c.strip()) >= MIN_CHARS
        ]

        # 4️⃣ Re-embed
        for idx, chunk in enumerate(chunks):
            emb = get_embedding(chunk)
            db.add(DocumentChunk(
                document_id=doc_id,
                chunk_index=idx,
                content=chunk,
                embedding=emb
            ))

        # ✅ SINGLE COMMIT
        db.commit()

        return {
            "status": "updated",
            "chunks": len(chunks)
        }

    except Exception as e:
        db.rollback()
        print("🔥 UPDATE DOCUMENT ERROR:", e)
        raise HTTPException(status_code=500, detail="Failed to update document")


# -------------------- Delete --------------------
@router.delete("/{doc_id}")
def delete_document(doc_id: uuid.UUID, db: Session = Depends(get_db)):
    doc = db.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(doc)
    db.commit()
    return {"status": "deleted"}
