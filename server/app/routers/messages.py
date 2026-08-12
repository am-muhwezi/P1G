from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db, SessionLocal
from app.models.user import User
from app.models.listing import Listing
from app.models.message import Conversation, Message
from app.routers.auth import get_current_user
from app.schemas.messages import (
    ConversationResponse,
    ConversationDetailResponse,
    MessageResponse,
    StartConversationRequest,
    ReplyRequest,
)

router = APIRouter(prefix="/api/messages", tags=["messages"])

connections: dict[str, set[WebSocket]] = {}


async def notify_user(user_id: str, payload: dict) -> None:
    for ws in list(connections.get(user_id, [])):
        try:
            await ws.send_json(payload)
        except Exception:
            connections.get(user_id, set()).discard(ws)


def _unread_count(conversation: Conversation, user_id: str) -> int:
    is_buyer = conversation.buyer_id == user_id
    last_read = conversation.buyer_last_read_at if is_buyer else conversation.seller_last_read_at
    count = 0
    for m in conversation.messages:
        if m.sender_id == user_id:
            continue
        if last_read is None or m.created_at > last_read:
            count += 1
    return count


def _get_conversation_or_403(conversation_id: str, user: User, db: Session) -> Conversation:
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if user.id not in (conversation.buyer_id, conversation.seller_id):
        raise HTTPException(status_code=403, detail="Not a participant in this conversation")
    return conversation


@router.websocket("/ws")
async def messages_ws(websocket: WebSocket, token: str = Query(...)):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.token == token).first()
    finally:
        db.close()

    if not user:
        await websocket.close(code=1008)
        return

    await websocket.accept()
    connections.setdefault(user.id, set()).add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        connections.get(user.id, set()).discard(websocket)


@router.post("/start", response_model=ConversationDetailResponse, status_code=201)
async def start_conversation(
    data: StartConversationRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyer accounts can message sellers")

    body = data.body.strip()
    if not body:
        raise HTTPException(status_code=422, detail="Message cannot be empty")

    seller = db.query(User).filter(User.id == data.seller_id, User.role == "seller").first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    conversation = (
        db.query(Conversation)
        .filter(Conversation.buyer_id == user.id, Conversation.seller_id == seller.id)
        .first()
    )
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if not conversation:
        conversation = Conversation(
            buyer_id=user.id,
            buyer_name=user.name,
            seller_id=seller.id,
            seller_name=seller.farm_name or seller.name,
            listing_id=data.listing_id,
            listing_title=None,
            last_message=body,
            last_message_at=now,
        )
        if data.listing_id:
            listing = db.query(Listing).filter(Listing.id == data.listing_id).first()
            if listing:
                conversation.listing_title = listing.title
        db.add(conversation)
        db.flush()
    else:
        conversation.last_message = body
        conversation.last_message_at = now

    message = Message(conversation_id=conversation.id, sender_id=user.id, sender_role=user.role, body=body, created_at=now)
    db.add(message)
    db.commit()
    db.refresh(conversation)

    await notify_user(seller.id, {"type": "new_message", "conversationId": conversation.id})

    conversation.unread_count = 0
    return conversation


@router.get("", response_model=list[ConversationResponse])
def list_conversations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    conversations = (
        db.query(Conversation)
        .filter(or_(Conversation.buyer_id == user.id, Conversation.seller_id == user.id))
        .order_by(Conversation.last_message_at.desc())
        .all()
    )
    for c in conversations:
        c.unread_count = _unread_count(c, user.id)
    return conversations


@router.get("/unread-count")
def unread_count(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    conversations = (
        db.query(Conversation)
        .filter(or_(Conversation.buyer_id == user.id, Conversation.seller_id == user.id))
        .all()
    )
    total = sum(_unread_count(c, user.id) for c in conversations)
    return {"count": total}


@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation(conversation_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    conversation = _get_conversation_or_403(conversation_id, user, db)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if user.id == conversation.buyer_id:
        conversation.buyer_last_read_at = now
    else:
        conversation.seller_last_read_at = now
    db.commit()
    db.refresh(conversation)
    conversation.unread_count = 0
    return conversation


@router.post("/{conversation_id}/reply", response_model=MessageResponse, status_code=201)
async def reply_to_conversation(
    conversation_id: str,
    data: ReplyRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    conversation = _get_conversation_or_403(conversation_id, user, db)
    body = data.body.strip()
    if not body:
        raise HTTPException(status_code=422, detail="Message cannot be empty")

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    message = Message(conversation_id=conversation.id, sender_id=user.id, sender_role=user.role, body=body, created_at=now)
    db.add(message)
    conversation.last_message = body
    conversation.last_message_at = now
    db.commit()
    db.refresh(message)

    other_id = conversation.seller_id if user.id == conversation.buyer_id else conversation.buyer_id
    await notify_user(other_id, {"type": "new_message", "conversationId": conversation.id})

    return message
