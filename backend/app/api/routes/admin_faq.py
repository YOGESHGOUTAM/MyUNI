from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from app.db.session import get_db
from app.db.models.faq import FAQ
from app.schemas.faq import FAQCreate, FAQUpdate, FAQOut
from app.services.embeddings import get_embedding

router = APIRouter(prefix="/faqs", tags=["Admin FAQs"])
@router.get("/", response_model=list[FAQOut])
def list_faqs(db: Session = Depends(get_db)):
    return db.query(FAQ).order_by(FAQ.id.desc()).all()


@router.post("/", response_model=FAQOut)
def create_faq(payload: FAQCreate, db: Session = Depends(get_db)):
    embedding = get_embedding(payload.canonical_question)

    faq = FAQ(
        canonical_question=payload.canonical_question,
        answer_en=payload.answer_en,
        embedding=embedding
    )

    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq


@router.put("/{faq_id}", response_model=FAQOut)
def update_faq(
    faq_id: uuid.UUID,
    payload: FAQUpdate,
    db: Session = Depends(get_db),
):
    faq = db.get(FAQ, faq_id)
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    # 🔒 Check for duplicate question BEFORE update
    if payload.canonical_question:
        existing = (
            db.query(FAQ)
            .filter(
                FAQ.canonical_question == payload.canonical_question,
                FAQ.id != faq_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="FAQ with this question already exists"
            )

        faq.canonical_question = payload.canonical_question
        faq.embedding = get_embedding(payload.canonical_question)

    if payload.answer_en:
        faq.answer_en = payload.answer_en

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Duplicate FAQ detected"
        )

    db.refresh(faq)
    return faq


@router.delete("/{faq_id}")
def delete_faq(faq_id: uuid.UUID, db: Session = Depends(get_db)):
    faq = db.get(FAQ, faq_id)
    if not faq:
        raise HTTPException(404, "FAQ not found")

    db.delete(faq)
    db.commit()
    return {"status": "deleted"}
