from pydantic import BaseModel,Field
from datetime import datetime


class DocumentUpload(BaseModel):
    title: str

class DocumentOut(BaseModel):
    id:int
    filename:str
    created_at:datetime

    class config:
        from_attributes=True



class DocumentUpdateRequest(BaseModel):
    final_text: str = Field(
        ...,
        description="Updated document text (this will regenerate embeddings)",
        min_length=1
    )
