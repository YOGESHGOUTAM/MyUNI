from pydantic import BaseModel
import uuid
class FAQCreate(BaseModel):
    canonical_question: str
    answer_en: str

class FAQUpdate(BaseModel):
    canonical_question: str | None = None
    answer_en: str | None = None

class FAQOut(BaseModel):
    id: uuid.UUID
    canonical_question: str
    answer_en: str

    class Config:
        from_attributes = True
