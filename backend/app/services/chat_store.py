from sqlalchemy.orm import Session
from uuid import UUID
from app.db.models.chat import ChatMessage

def save_message(
        db:Session,
        session_id:UUID,
        role:str,
        content:str
):
    msg=ChatMessage(
        session_id=session_id,
        role=role,
        content=content
    )
    db.add(msg)
    db.commit()