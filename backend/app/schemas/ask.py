from pydantic import BaseModel,Field
from uuid import UUID
from typing import Optional
class AskRequest(BaseModel):
    question:str
    session_id:UUID


class AskResponse(BaseModel):
    answer:str
    source:str
    confidence:float
    escalated:bool
    escalation_id:int|None=None