from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True)
    canonical_question = Column(Text, unique=True, nullable=False)
    answer_en = Column(Text, nullable=False)
    embedding = Column(Vector(3072), nullable=False)
