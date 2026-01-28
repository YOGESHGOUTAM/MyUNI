from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List,Optional

class ChatMessageResponse(BaseModel):
    role: str
    content: str
    created_at: datetime

    class Config:
        orm_mode = True

class AdminResolution(BaseModel):
    question:str
    answer:str
    resolved_at:datetime

class ChatHistoryResponse(BaseModel):
    session_id: UUID
    messages: List[ChatMessageResponse]
    admin_resolution:Optional[AdminResolution]=None
