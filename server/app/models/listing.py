import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from app.database import Base


class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    seller_id = Column(String, nullable=False, index=True)
    seller_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, default="")
    category = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    stock = Column(Integer, nullable=False, default=1)
    unit = Column(String, nullable=False)
    district = Column(String, default="")
    status = Column(String, default="active")
    views = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    seller_verified = Column(Boolean, default=False)
    image = Column(String, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
