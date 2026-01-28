from sqlalchemy.orm import Session
from fastapi import Depends
from app.db.session import get_db
from app.db.models.user import User

def get_current_user(db:Session=Depends(get_db))->User:
    user=db.query(User).first()

    if not user:
        user=User(email="test@campusconnect.ai",name="Test User")
        db.add(user)
        db.commit()
        db.refresh(user)

    return user