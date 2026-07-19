from datetime import datetime

from pydantic import BaseModel, Field


class BetaLeadCreate(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    username: str = Field(min_length=1, max_length=64)


class BetaLeadUpdate(BaseModel):
    completed: bool


class BetaLeadResponse(BaseModel):
    id: int
    email: str
    username: str
    completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}
