from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from app.db.session import get_db
from app.db.models.chat import ChatSession
from app.db.models.chat import ChatMessage
from app.db.models.escalation import Escalation
from app.schemas.chat import ChatHistoryResponse, ChatMessageResponse

router = APIRouter(prefix="/chat", tags=["Chat Sessions"])

# 1. List user's chat sessions
@router.get("/sessions")
def list_sessions(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == user_id)
        .order_by(ChatSession.created_at.desc())
        .all()
    )

    result = []
    for s in sessions:
        first_msg = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == s.id, ChatMessage.role == "user")
            .order_by(ChatMessage.created_at.asc())
            .first()
        )

        result.append({
            "session_id": s.id,
            "first_question": first_msg.content if first_msg else None,
            "created_at": s.created_at
        })

    return {"sessions": result}



# 2. Create a new chat session
@router.post("/new")
def create_new_session(payload: dict, db: Session = Depends(get_db)):
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")

    session = ChatSession(
        user_id=user_id,
        created_at=datetime.now()
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {"session_id": str(session.id)}



# 3. Get full chat history (for reopen)
@router.get("/{session_id}", response_model=dict)
def get_history(
    session_id: UUID,
    db: Session = Depends(get_db)
):
    msgs = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    out = []
    for m in msgs:
        out.append({
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at
        })

    escalation = (
        db.query(Escalation)
        .filter(Escalation.session_id == session_id)
        .order_by(Escalation.created_at.desc())
        .first()
    )

    escalation_status = escalation.status if escalation else None

    out.sort(key=lambda x: x["created_at"].timestamp())

    return {
        "session_id": session_id,
        "messages": out,
        "escalation_status": escalation_status
    }
