from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.ask import AskRequest, AskResponse
from app.services.qa_pipeline import answer_question
from app.db.session import get_db
from fastapi import HTTPException
from time import time

REQUEST_WINDOW = 60   # seconds
MAX_REQUESTS = 20     # per minute
request_log = {}

def rate_limit(ip):
    now = time()
    window = request_log.get(ip, [])
    window = [t for t in window if now - t < REQUEST_WINDOW]

    if len(window) >= MAX_REQUESTS:
        raise HTTPException(
            429, detail="Rate limit exceeded. Try again later."
        )

    window.append(now)
    request_log[ip] = window

router = APIRouter(prefix="/api/chat")

@router.post("/send", response_model=AskResponse)
def send(req: AskRequest, db: Session = Depends(get_db)):
    rate_limit(req.client.host)
    return answer_question(
        db=db,
        question=req.question,
        session_id=req.session_id
    )
