import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    buyer_id = Column(String, ForeignKey("users.id"), nullable=False)
    buyer_name = Column(String, nullable=False)
    total = Column(Integer, nullable=False)
    delivery_fee = Column(Integer, default=0)
    status = Column(String, default="pending")
    payment_method = Column(String, default="")
    address = Column(String, default="")
    district = Column(String, default="")
    notes = Column(String, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    items = relationship("OrderItem", back_populates="order", lazy="selectin")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    listing_id = Column(String, ForeignKey("listings.id"), nullable=False)
    seller_id = Column(String, ForeignKey("users.id"), nullable=False)
    seller_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit = Column(String, default="")

    order = relationship("Order", back_populates="items")
