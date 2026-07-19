from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.api import router

# Public waitlist builds hide interactive docs so endpoints aren't browsable.
docs_url = None if settings.is_waitlist else "/docs"
redoc_url = None if settings.is_waitlist else "/redoc"
openapi_url = None if settings.is_waitlist else "/openapi.json"

app = FastAPI(
    title="Adventure List API",
    description="Backend for Adventure List",
    version="0.1.0",
    docs_url=docs_url,
    redoc_url=redoc_url,
    openapi_url=openapi_url,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root() -> dict[str, str]:
    payload = {"message": "Adventure List API", "mode": settings.mode}
    if settings.is_full:
        payload["docs"] = "/docs"
    return payload
