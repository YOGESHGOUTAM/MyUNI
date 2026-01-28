from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# -------------------------------------------------
# App
# -------------------------------------------------
app = FastAPI(title="CampusConnect API")

# -------------------------------------------------
# CORS (Vite + React)
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Logging
# -------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("campusconnect")

# -------------------------------------------------
# Lifecycle events
# -------------------------------------------------
@app.on_event("startup")
def startup_event():
    logger.info("CampusConnect API starting up")

@app.on_event("shutdown")
def shutdown_event():
    logger.info("CampusConnect API shutting down")

# -------------------------------------------------
# Exception handling
# -------------------------------------------------
from app.core.exceptions import global_exception_handler
app.add_exception_handler(Exception, global_exception_handler)

# -------------------------------------------------
# Routers
# -------------------------------------------------
from app.api.routes.ask import router as chat_router
from app.api.routes.admin_faq import router as admin_faq_router
from app.api.routes.admin_docs import router as admin_docs_router
from app.api.routes.admin_escalations import router as admin_escalations_router
from app.api.routes.admin_escalation_learning import router as admin_escalation_learning_router
from app.api.routes.chat_session import router as chat_sessions_router
from app.api.routes.manual_escalation import router as manual_escalation_router
from app.api.routes.auth import router as auth_router

app.include_router(chat_sessions_router, prefix="/api")

# Public APIs
app.include_router(chat_router)

# Admin APIs
app.include_router(admin_faq_router, prefix="/admin")
app.include_router(admin_docs_router, prefix="/admin")
app.include_router(admin_escalations_router, prefix="/admin")
app.include_router(admin_escalation_learning_router, prefix="/admin")

# Manual escalation APIs
app.include_router(manual_escalation_router)

app.include_router(auth_router)

logger.info("All routers registered successfully")

# -------------------------------------------------
# Health check
# -------------------------------------------------
@app.get("/")
def root():
    return {"status": "CampusConnect API running"}
