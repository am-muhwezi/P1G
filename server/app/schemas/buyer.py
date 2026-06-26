from pydantic import BaseModel
from typing import Optional


class OrderItemCreate(BaseModel):
    listing_id: str
    quantity: int


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    delivery_fee: int = 25000
    payment_method: str = "MTN Mobile Money"
    address: str
    district: str
    notes: Optional[str] = None
