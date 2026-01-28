from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from app.services.escalation import Escalation
from app.db.models.chat import ChatMessage
from uuid import UUID

from app.db.session import get_db
from app.services.escalation import create_escalation

router=APIRouter(prefix="/api/escalation",tags=["Manual Escalation"])
@router.post("/manual/{session_id}")
def manual_escalation(
    session_id: UUID,
    db: Session = Depends(get_db)
):
    last_user = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id, ChatMessage.role == "user")
        .order_by(ChatMessage.created_at.desc())
        .first()
    )

    last_bot = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id, ChatMessage.role == "bot")
        .order_by(ChatMessage.created_at.desc())
        .first()
    )

    esc = Escalation(
        session_id=session_id,
        question=last_user.content if last_user else "User asked something",
        bot_answer=last_bot.content if last_bot else None,
        confidence=0.0,
        status="pending"
    )

    db.add(esc)
    db.commit()
    db.refresh(esc)

    return {"status": "escalated", "id": esc.id}
