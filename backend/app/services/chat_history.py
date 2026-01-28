from sqlalchemy.orm import Session
from app.db.models.chat import ChatMessage

def get_recent_messages(
    db: Session,
    session_id,
    limit: int = 5
):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(limit)
        .all()
    )

    return list(reversed(messages))
