from sqlalchemy.orm import declarative_base
Base = declarative_base()
from app.db.models import user,chat
# 👇 IMPORT ALL MODELS HERE

# 👇 IMPORT ALL MODELS HERE

from app.db.models.escalation import Escalation  # 🔥 REQUIRED
