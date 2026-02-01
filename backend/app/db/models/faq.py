from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True)
    canonical_question = Column(Text, unique=True, nullable=False)
    answer_en = Column(Text, nullable=False)


class FAQQuestion(Base):
    __tablename__ = "faq_questions"

    id = Column(Integer, primary_key=True)
    faq_id = Column(Integer, ForeignKey("faqs.id", ondelete="CASCADE"))
    question_text = Column(Text, nullable=True)
    embedding = Column(Vector(3072), nullable=False)

