from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.faq import FAQ
from app.db.models.faq import FAQQuestion
from app.schemas.faq import FAQCreate, FAQUpdate, FAQOut,FAQQuestionAdd,FAQBulkItem, FAQBulkUploadResponse
from app.services.embeddings import get_embedding

router = APIRouter(prefix="/faqs", tags=["Admin FAQs"])


# -------------------- LIST ALL FAQs --------------------
@router.get("/", response_model=list[FAQOut])
def list_faqs(db: Session = Depends(get_db)):
    faqs = db.query(FAQ).order_by(FAQ.id.desc()).all()

    result = []
    for faq in faqs:
        questions = (
            db.query(FAQQuestion)
            .filter(FAQQuestion.faq_id == faq.id)
            .all()
        )

        result.append({
            "id": faq.id,
            "canonical_question": faq.canonical_question,
            "answer_en": faq.answer_en,
            "questions": questions
        })

    return result


# -------------------- CREATE FAQ (POPUP FLOW) --------------------
@router.post("/", response_model=FAQOut)
def create_faq(payload: FAQCreate, db: Session = Depends(get_db)):
    # 1️⃣ Create FAQ (answer-level)
    faq = FAQ(
        canonical_question=payload.canonical_question.strip(),
        answer_en=payload.answer_en.strip()
    )
    db.add(faq)
    db.commit()
    db.refresh(faq)

    # 2️⃣ Combine canonical + variants
    all_questions = {payload.canonical_question.strip()}
    for q in payload.questions or []:
        if q.strip():
            all_questions.add(q.strip())

    # 3️⃣ Insert question variants
    for q in all_questions:
        emb = get_embedding(q)
        db.add(FAQQuestion(
            faq_id=faq.id,
            question_text=q,
            embedding=emb
        ))

    db.commit()

    questions = (
        db.query(FAQQuestion)
        .filter(FAQQuestion.faq_id == faq.id)
        .all()
    )

    return {
        "id": faq.id,
        "canonical_question": faq.canonical_question,
        "answer_en": faq.answer_en,
        "questions": questions
    }


# -------------------- UPDATE FAQ (EDIT POPUP) --------------------
@router.put("/{faq_id}", response_model=FAQOut)
def update_faq(
    faq_id: int,
    payload: FAQUpdate,
    db: Session = Depends(get_db)
):
    faq = db.get(FAQ, faq_id)
    if not faq:
        raise HTTPException(404, "FAQ not found")

    # 1️⃣ Update answer / canonical question
    if payload.canonical_question:
        faq.canonical_question = payload.canonical_question.strip()

    if payload.answer_en:
        faq.answer_en = payload.answer_en.strip()

    # 2️⃣ Update questions (FULL REPLACE STRATEGY)
    if payload.questions is not None:
        # delete old question variants
        db.query(FAQQuestion).filter(
            FAQQuestion.faq_id == faq_id
        ).delete()

        all_questions = set(payload.questions)
        if payload.canonical_question:
            all_questions.add(payload.canonical_question.strip())
        else:
            all_questions.add(faq.canonical_question)

        for q in all_questions:
            if q.strip():
                emb = get_embedding(q.strip())
                db.add(FAQQuestion(
                    faq_id=faq_id,
                    question_text=q.strip(),
                    embedding=emb
                ))

    db.commit()

    questions = (
        db.query(FAQQuestion)
        .filter(FAQQuestion.faq_id == faq.id)
        .all()
    )

    return {
        "id": faq.id,
        "canonical_question": faq.canonical_question,
        "answer_en": faq.answer_en,
        "questions": questions
    }


# -------------------- DELETE FAQ (CASCADE SAFE) --------------------
@router.delete("/{faq_id}")
def delete_faq(faq_id: int, db: Session = Depends(get_db)):
    faq = db.get(FAQ, faq_id)
    if not faq:
        raise HTTPException(404, "FAQ not found")

    db.delete(faq)  # FAQQuestions auto-delete (ON DELETE CASCADE)
    db.commit()

    return {"status": "deleted"}

@router.post("/{faq_id}/questions")
def add_faq_question(
    faq_id: int,
    payload: FAQQuestionAdd,
    db: Session = Depends(get_db)
):
    faq = db.get(FAQ, faq_id)
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    question = payload.question_text.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # 🔒 Optional: prevent exact duplicates for same FAQ
    exists = (
        db.query(FAQQuestion)
        .filter(
            FAQQuestion.faq_id == faq_id,
            FAQQuestion.question_text == question
        )
        .first()
    )
    if exists:
        raise HTTPException(
            status_code=409,
            detail="This question already exists for the FAQ"
        )

    embedding = get_embedding(question)

    db.add(FAQQuestion(
        faq_id=faq_id,
        question_text=question,
        embedding=embedding
    ))
    db.commit()

    return {
        "status": "added",
        "question": question
    }


@router.post("/bulk-upload", response_model=FAQBulkUploadResponse)
def bulk_upload_faqs(
    payload: list[FAQBulkItem],
    db: Session = Depends(get_db),
):
    inserted = 0
    skipped = 0
    errors: list[str] = []

    for idx, item in enumerate(payload):
        try:
            canonical = item.canonical_question.strip()
            answer = item.answer_en.strip()

            if not canonical or not answer:
                skipped += 1
                errors.append(f"Item {idx}: Missing canonical question or answer")
                continue

            # 🔒 Prevent duplicate FAQs (canonical-level)
            exists = db.query(FAQ).filter(
                FAQ.canonical_question == canonical
            ).first()

            if exists:
                skipped += 1
                errors.append(f"Item {idx}: FAQ already exists")
                continue

            # 1️⃣ Create FAQ
            faq = FAQ(
                canonical_question=canonical,
                answer_en=answer
            )
            db.add(faq)
            db.commit()
            db.refresh(faq)

            # 2️⃣ Collect all questions (canonical + variants)
            all_questions = {canonical}
            for q in item.questions or []:
                if q.strip():
                    all_questions.add(q.strip())

            # 3️⃣ Insert question variants
            for q in all_questions:
                emb = get_embedding(q)
                db.add(FAQQuestion(
                    faq_id=faq.id,
                    question_text=q,
                    embedding=emb
                ))

            db.commit()
            inserted += 1

        except Exception as e:
            db.rollback()
            skipped += 1
            errors.append(f"Item {idx}: {str(e)}")

    return {
        "inserted": inserted,
        "skipped": skipped,
        "errors": errors
    }
