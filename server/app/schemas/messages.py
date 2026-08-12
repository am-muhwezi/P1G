from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MessageResponse(BaseModel):
    id: str
    senderId: str = Field(validation_alias="sender_id")
    senderRole: str = Field(validation_alias="sender_role")
    body: str
    createdAt: datetime = Field(validation_alias="created_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class ConversationResponse(BaseModel):
    id: str
    buyerId: str = Field(validation_alias="buyer_id")
    buyerName: str = Field(validation_alias="buyer_name")
    sellerId: str = Field(validation_alias="seller_id")
    sellerName: str = Field(validation_alias="seller_name")
    listingId: Optional[str] = Field(default=None, validation_alias="listing_id")
    listingTitle: Optional[str] = Field(default=None, validation_alias="listing_title")
    lastMessage: str = Field(validation_alias="last_message")
    lastMessageAt: datetime = Field(validation_alias="last_message_at")
    unreadCount: int = Field(default=0, validation_alias="unread_count")
    createdAt: datetime = Field(validation_alias="created_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class ConversationDetailResponse(ConversationResponse):
    messages: list[MessageResponse] = []

    model_config = {"from_attributes": True, "populate_by_name": True}


class StartConversationRequest(BaseModel):
    seller_id: str
    listing_id: Optional[str] = None
    body: str


class ReplyRequest(BaseModel):
    body: str
