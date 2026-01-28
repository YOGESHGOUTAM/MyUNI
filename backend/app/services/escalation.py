from sqlalchemy.orm import Session
from app.db.models.escalation import Escalation

def create_escalation(
    db: Session,
    question: str,
    bot_answer: str | None,
    confidence: float | None,
    session_id: str,
    status:str="open",
    created_at: str=None

):
    escalation = Escalation(
        question=question,
        bot_answer=bot_answer,
        confidence=confidence,
        session_id=session_id,
        status=status,
        created_at=created_at

    )
    db.add(escalation)
    db.commit()
    db.refresh(escalation)
    return escalation
