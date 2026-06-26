from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    phone: str
    role: Literal["buyer", "seller"]
    district: Optional[str] = None
    farm_name: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    status: str = "active"
    token: str

    model_config = {"from_attributes": True}
