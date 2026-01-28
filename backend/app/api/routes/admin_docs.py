from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.document import Document
from app.services.ingestion import ingest_document
import uuid
router = APIRouter(prefix="/documents", tags=["Admin Documents"])

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        result = ingest_document(file, db)
        return result

    except Exception as e:
        print("\n🔥 DOCUMENT UPLOAD ERROR:", e, "\n")   # DEBUG LOG
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def list_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.created_at.desc()).all()

@router.delete("/{doc_id}")
def delete_document(doc_id: uuid.UUID, db: Session = Depends(get_db)):
    doc = db.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(doc)
    db.commit()
    return {"status": "deleted"}
