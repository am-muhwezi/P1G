import hashlib
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.listing_view import ListingView
from app.models.order import Order, OrderItem
from app.routers.auth import get_current_user
from app.schemas.seller import ListingResponse, OrderResponse
from app.schemas.buyer import OrderCreate

router = APIRouter(prefix="/api", tags=["buyer"])

VIEW_DEDUP_WINDOW = timedelta(minutes=30)


def _viewer_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    return hashlib.sha256(ip.encode()).hexdigest()


@router.get("/listings", response_model=list[ListingResponse])
def list_listings(
    category: str = "",
    district: str = "",
    search: str = "",
    sort: str = "-created_at",
    db: Session = Depends(get_db),
):
    q = db.query(Listing).filter(Listing.status == "active")
    if category:
        q = q.filter(Listing.category == category)
    if district:
        q = q.filter(Listing.district == district)
    if search:
        q = q.filter(Listing.title.ilike(f"%{search}%"))
    if sort == "price":
        q = q.order_by(Listing.price.asc())
    elif sort == "-price":
        q = q.order_by(Listing.price.desc())
    elif sort == "created_at":
        q = q.order_by(Listing.created_at.asc())
    else:
        q = q.order_by(Listing.created_at.desc())
    return q.all()


@router.get("/listings/by-ids", response_model=list[ListingResponse])
def get_listings_by_ids(ids: str = "", db: Session = Depends(get_db)):
    id_list = [i for i in ids.split(",") if i]
    if not id_list:
        return []
    return db.query(Listing).filter(Listing.id.in_(id_list)).all()


@router.get("/listings/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: str, request: Request, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    viewer_key = _viewer_key(request)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    should_count = False
    try:
        db.add(ListingView(listing_id=listing_id, viewer_key=viewer_key, last_viewed_at=now))
        db.flush()
        should_count = True
    except IntegrityError:
        db.rollback()
        existing = (
            db.query(ListingView)
            .filter(ListingView.listing_id == listing_id, ListingView.viewer_key == viewer_key)
            .first()
        )
        if existing and now - existing.last_viewed_at > VIEW_DEDUP_WINDOW:
            existing.last_viewed_at = now
            should_count = True

    if should_count:
        db.query(Listing).filter(Listing.id == listing_id).update({"views": Listing.views + 1})

    db.commit()
    db.refresh(listing)
    return listing


@router.post("/orders", response_model=OrderResponse, status_code=201)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyer accounts can place orders")

    if not data.items:
        raise HTTPException(status_code=422, detail="Order must have at least one item")

    order_items: list[OrderItem] = []
    total = 0
    for item_data in data.items:
        listing = db.query(Listing).filter(Listing.id == item_data.listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail=f"Listing {item_data.listing_id} not found")
        if listing.status != "active":
            raise HTTPException(status_code=400, detail=f"Listing '{listing.title}' is not available")
        if listing.stock < item_data.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for '{listing.title}'")

        listing.stock -= item_data.quantity
        if listing.stock <= 0:
            listing.status = "sold_out"
        subtotal = listing.price * item_data.quantity
        total += subtotal

        order_items.append(
            OrderItem(
                listing_id=listing.id,
                seller_id=listing.seller_id,
                seller_name=listing.seller_name,
                title=listing.title,
                price=listing.price,
                quantity=item_data.quantity,
                unit=listing.unit,
            )
        )

    order = Order(
        buyer_id=user.id,
        buyer_name=user.name,
        items=order_items,
        total=total,
        delivery_fee=data.delivery_fee,
        payment_method=data.payment_method,
        address=data.address,
        district=data.district,
        notes=data.notes or "",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/orders", response_model=list[OrderResponse])
def list_orders(
    status: str = "",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Order).filter(Order.buyer_id == user.id)
    if status:
        q = q.filter(Order.status == status)
    q = q.order_by(Order.created_at.desc())
    return q.all()


@router.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.buyer_id != user.id:
        raise HTTPException(status_code=403, detail="Not your order")
    return order


@router.put("/orders/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.buyer_id != user.id:
        raise HTTPException(status_code=403, detail="Not your order")
    if order.status not in ("pending",):
        raise HTTPException(status_code=400, detail="Only pending orders can be cancelled")
    order.status = "cancelled"
    for item in order.items:
        listing = db.query(Listing).filter(Listing.id == item.listing_id).first()
        if listing:
            listing.stock += item.quantity
            if listing.status == "sold_out" and listing.stock > 0:
                listing.status = "active"
    db.commit()
    db.refresh(order)
    return order
