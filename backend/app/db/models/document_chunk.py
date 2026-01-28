from sqlalchemy import Column, Text, ForeignKey, DateTime, Integer
from pgvector.sqlalchemy import Vector
from sqlalchemy.sql import func
from app.db.base import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(3072))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
