import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from app.database import Base


class ListingView(Base):
    __tablename__ = "listing_views"
    __table_args__ = (UniqueConstraint("listing_id", "viewer_key", name="uq_listing_viewer"),)

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    listing_id = Column(String, ForeignKey("listings.id"), nullable=False, index=True)
    viewer_key = Column(String, nullable=False)
    last_viewed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None), nullable=False)
