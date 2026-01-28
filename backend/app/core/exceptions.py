from fastapi import Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("campusconnect")

async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": "Something went wrong"
        }
    )
