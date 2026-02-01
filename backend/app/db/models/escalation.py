from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base

class Escalation(Base):
    __tablename__ = "escalations"

    id = Column(Integer, primary_key=True, autoincrement=True)

    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("chat_sessions.id"),
        nullable=False
    )
    question = Column(Text, nullable=False)
    bot_answer = Column(Text)
    admin_answer = Column(Text)
    confidence = Column(Integer)
    status = Column(String, default="open")  # open, answered, closed
    user_feedback = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
