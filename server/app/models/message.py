import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    buyer_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    buyer_name = Column(String, nullable=False)
    seller_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    seller_name = Column(String, nullable=False)
    listing_id = Column(String, nullable=True)
    listing_title = Column(String, nullable=True)
    last_message = Column(String, default="")
    last_message_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    buyer_last_read_at = Column(DateTime, nullable=True)
    seller_last_read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    messages = relationship("Message", back_populates="conversation", lazy="selectin", order_by="Message.created_at")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False, index=True)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    sender_role = Column(String, nullable=False)
    body = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    conversation = relationship("Conversation", back_populates="messages")
