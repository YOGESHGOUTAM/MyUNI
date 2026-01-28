from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.escalation import Escalation
from app.schemas.chat import AdminResolution
from app.db.models.chat import ChatMessage
router = APIRouter(prefix="/escalations",tags=[" Admin Escalations"])

@router.get("/")
def list_escalations(
        status:str | None = None,
        db:Session=Depends(get_db)
):
    query = db.query(Escalation)

    if status:
        query=query.filter(Escalation.status==status)


    return query.order_by(Escalation.created_at.desc()).all()

@router.get("/{escalation_id}")
def get_escalation(escalation_id:int,db:Session=Depends(get_db)):
    esc=db.get(Escalation,escalation_id)
    if not esc:
        raise HTTPException(status_code=404,detail="Escalation not found")
    return esc


from datetime import datetime
@router.post("/{escalation_id}/reply")
def reply_escalation(escalation_id: int, payload: AdminResolution, db: Session = Depends(get_db)):
    esc = db.get(Escalation, escalation_id)
    if not esc:
        raise HTTPException(404, "Not found")

    esc.answer = payload.answer
    esc.status = "resolved"
    esc.resolved_at = datetime.now()

    # NEW — push message into chat
    if esc.session_id:
        msg = ChatMessage(
            session_id=esc.session_id,
            role="admin",
            content=payload.answer
        )
        db.add(msg)

    db.commit()
    return {"status": "resolved"}
