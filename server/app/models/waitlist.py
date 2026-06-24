import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime
from app.database import Base


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=False)
    interest = Column(String, nullable=False)  # "buyer" | "seller" | "both"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
