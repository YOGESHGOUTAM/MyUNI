from sqlalchemy.orm import Session
from app.db.models.chat import  ChatSession
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
