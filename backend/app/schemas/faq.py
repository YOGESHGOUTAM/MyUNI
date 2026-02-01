from pydantic import BaseModel, Field
from typing import List, Optional

# ---------- CREATE ----------
class FAQCreate(BaseModel):
    canonical_question: str = Field(..., min_length=5)
    answer_en: str = Field(..., min_length=1)
    questions: Optional[List[str]] = Field(
        default=[],
        description="Other ways users may ask the same question"
    )


# ---------- UPDATE ----------
class FAQUpdate(BaseModel):
    canonical_question: Optional[str]
    answer_en: Optional[str]
    questions: Optional[List[str]]


# ---------- RESPONSE ----------
class FAQQuestionOut(BaseModel):
    id: int
    question_text: str

    class Config:
        from_attributes = True


class FAQOut(BaseModel):
    id: int
    canonical_question: str
    answer_en: str
    questions: List[FAQQuestionOut]

    class Config:
        from_attributes = True


class FAQQuestionAdd(BaseModel):
    question_text: str = Field(..., min_length=5)

class FAQBulkItem(BaseModel):
    canonical_question: str = Field(..., min_length=5)
    answer_en: str = Field(..., min_length=1)
    questions: Optional[List[str]] = []

class FAQBulkUploadResponse(BaseModel):
    inserted: int
    skipped: int
    errors: List[str]