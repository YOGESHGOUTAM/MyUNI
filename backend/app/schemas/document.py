from pydantic import BaseModel
from datetime import datetime

class DocumentUpload(BaseModel):
    title: str

class DocumentOut(BaseModel):
    id:int
    filename:str
    created_at:datetime

    class config:
        from_attributes=True