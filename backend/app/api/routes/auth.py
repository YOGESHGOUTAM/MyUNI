from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    name: str | None = None

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    name = data.name.strip().lower() if data.name else None

    user = db.query(User).filter(User.email == email).first()

    # If existing -> return same user_id (DO NOT create new)
    if user:
        return {
            "user_id": str(user.id),
            "email": user.email,
            "name": user.name
        }

    # Else create new
    user = User(email=email, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "user_id": str(user.id),
        "email": user.email,
        "name": user.name
    }
