import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import BetaLead
from app.schemas import BetaLeadCreate, BetaLeadResponse

router = APIRouter(prefix="/api", tags=["api"])

_HANDLE_RE = re.compile(r"^[a-zA-Z0-9._]{1,64}$")


@router.get("/health")
def health() -> dict[str, str]:
    from app.config import settings

    return {"status": "ok", "mode": settings.mode}


@router.get("/feed")
def get_feed() -> dict:
    """Placeholder until the main feed is rebuilt."""
    return {"posts": [], "next_cursor": None}


@router.get("/stories")
def get_stories() -> dict:
    """Placeholder until stories are rebuilt."""
    return {"stories": []}


@router.post("/beta-leads", response_model=BetaLeadResponse, status_code=201)
def create_beta_lead(payload: BetaLeadCreate, db: Session = Depends(get_db)) -> BetaLead:
    email = payload.email.strip().lower()
    username = payload.username.strip().lstrip("@").lower()

    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=400, detail="Invalid email address")
    if not _HANDLE_RE.match(username):
        raise HTTPException(
            status_code=400,
            detail="Username may only contain letters, numbers, dots, and underscores",
        )

    lead = BetaLead(email=email, username=username, completed=False)
    db.add(lead)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="That email or username is already on the waitlist",
        ) from exc

    db.refresh(lead)
    return lead
