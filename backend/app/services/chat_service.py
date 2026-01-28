from sqlalchemy.orm import Session
from app.db.models.chat import ChatMessage, ChatSession


def get_or_create_session(db: Session, session_id: str) -> ChatSession:
    session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id)
        .order_by(ChatSession.created_at.desc())
        .first()
    )

    if not session:
        session = ChatSession(id=session_id)
        db.add(session)
        db.commit()
        db.refresh(session)

    return session


def save_message(db: Session, session_id: int, role: str, content: str):
    msg = ChatMessage(
        session_id=session_id,
        role=role,
        content=content
    )
    db.add(msg)
    db.commit()


def get_recent_messages(db: Session, session_id: int, limit: int = 5):
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(limit)
        .all()[::-1]
    )
