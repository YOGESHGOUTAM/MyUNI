from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.escalation import Escalation
from app.db.models.faq import FAQ
from app.db.models.faq import FAQQuestion
from app.services.embeddings import get_embedding

router = APIRouter(prefix="/escalations", tags=["Escalations Learning"])


@router.post("/{escalation_id}/promote/faq")
def promote_escalation_to_faq(escalation_id: int, db: Session = Depends(get_db)):
    """
    Promote a resolved escalation to FAQ.
    Creates a new FAQ with the question and admin answer,
    then updates the escalation status to 'promoted'.
    """
    # 1️⃣ Get escalation
    esc = db.get(Escalation, escalation_id)

    if not esc:
        raise HTTPException(status_code=404, detail="Escalation not found")

    if esc.status != "resolved":
        raise HTTPException(
            status_code=400,
            detail="Escalation must be resolved before promoting to FAQ"
        )

    if not esc.admin_answer:
        raise HTTPException(
            status_code=400,
            detail="Admin answer is missing"
        )

    # 2️⃣ Create FAQ entry
    faq = FAQ(
        canonical_question=esc.question,
        answer_en=esc.admin_answer
    )

    db.add(faq)
    db.flush()  # Get FAQ ID without committing

    # 3️⃣ Create FAQ question variant with embedding
    embedding = get_embedding(esc.question)

    faq_question = FAQQuestion(
        faq_id=faq.id,
        question_text=esc.question,
        embedding=embedding
    )

    db.add(faq_question)

    # 4️⃣ Update escalation status to 'promoted'
    esc.status = "promoted"

    # 5️⃣ Commit all changes
    db.commit()
    db.refresh(faq)

    return {
        "status": "promoted_to_faq",
        "faq_id": faq.id,
        "escalation_status": "promoted"
    }