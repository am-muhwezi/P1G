from pydantic import BaseModel, EmailStr
from datetime import datetime


class WaitlistCreate(BaseModel):
    name: str
    email: str  # not EmailStr — allows test accounts easily
    phone: str
    interest: str  # "buyer" | "seller" | "both"


class WaitlistResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    interest: str
    created_at: datetime

    model_config = {"from_attributes": True}


class WaitlistStats(BaseModel):
    total: int
    buyers: int
    sellers: int
    today: int
