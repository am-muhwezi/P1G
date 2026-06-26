from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime
from app.database import Base


class PlatformSettings(Base):
    __tablename__ = "platform_settings"

    id = Column(String, primary_key=True, default="default")
    site_name = Column(String, default="P1G katale")
    contact_email = Column(String, default="")
    commission_rate = Column(Integer, default=5)
    maintenance_mode = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
