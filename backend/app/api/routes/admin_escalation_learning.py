from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.escalation import Escalation
from app.db.models.faq import FAQ
from app.services.embeddings import get_embedding

router=APIRouter(prefix="/escalations",tags=["Escalations Learning"])
@router.post("/{escalation_id}/promote/faq")

def promote_faq_to(escalation_id:int,db:Session=Depends(get_db)):
    esc=db.get(Escalation,escalation_id)

    if not esc or esc.status!="resolved":
        raise HTTPException(status_code=400,
                            detail="Escalation must be resolved first")

    if not esc.admin_answer:
        raise HTTPException(status_code=400,
                            detail="Admin answer missing")

    embedding=get_embedding(esc.question)

    faq=FAQ(
        canonical_question=esc.question,
        answer_en=esc.admin_answer,
        embedding=embedding
    )

    db.add(faq)
    db.commit()
    db.refresh(faq)

    return {
        "status":"promoted_to_faq",
        "faq_id":faq.id
    }