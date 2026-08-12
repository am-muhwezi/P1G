from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.database import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.order import Order, OrderItem
from app.routers.auth import get_current_user
from app.schemas.seller import (
    ListingCreate,
    ListingUpdate,
    ListingResponse,
    OrderResponse,
    DashboardResponse,
    AnalyticsResponse,
    WeeklyDataPoint,
    WeeklyRevenuePoint,
    StatusBreakdown,
)

router = APIRouter(prefix="/api/seller", tags=["seller"])


def _get_listing_or_404(listing_id: str, seller_id: str, db: Session) -> Listing:
    listing = db.query(Listing).filter(Listing.id == listing_id, Listing.seller_id == seller_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.get("/listings", response_model=list[ListingResponse])
def list_listings(
    search: str = "",
    status: str = "",
    sort: str = "desc",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Listing).filter(Listing.seller_id == user.id)
    if status:
        q = q.filter(Listing.status == status)
    if search:
        q = q.filter(Listing.title.ilike(f"%{search}%"))
    order = Listing.created_at.desc() if sort != "asc" else Listing.created_at.asc()
    return q.order_by(order).all()


@router.post("/listings", response_model=ListingResponse, status_code=201)
def create_listing(
    data: ListingCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    listing = Listing(
        seller_id=user.id,
        seller_name=user.farm_name or user.name,
        title=data.title,
        description=data.description,
        category=data.category,
        price=data.price,
        stock=data.stock,
        unit=data.unit,
        district=user.district or "",
        sex=data.sex,
        breed=data.breed,
        age_months=data.age_months,
        age_weeks=data.age_weeks,
        images=data.images or [],
    )
    if data.image:
        listing.image = data.image
    elif data.images:
        listing.image = data.images[0]
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


@router.put("/listings/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: str,
    data: ListingUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    listing = _get_listing_or_404(listing_id, user.id, db)
    patch = data.model_dump(exclude_unset=True)
    for key, val in patch.items():
        setattr(listing, key, val)
    if "images" in patch:
        if patch["images"]:
            if not listing.image:
                listing.image = patch["images"][0]
        elif "image" not in patch:
            listing.image = ""
    db.commit()
    db.refresh(listing)
    return listing


@router.delete("/listings/{listing_id}", status_code=204)
def delete_listing(
    listing_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    listing = _get_listing_or_404(listing_id, user.id, db)
    db.delete(listing)
    db.commit()


@router.get("/orders", response_model=list[OrderResponse])
def list_orders(
    status: str = "",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item_ids = db.query(OrderItem.order_id).filter(OrderItem.seller_id == user.id).distinct().scalar_subquery()
    q = db.query(Order).filter(Order.id.in_(item_ids))
    if status:
        q = q.filter(Order.status == status)
    q = q.order_by(Order.created_at.desc())
    return q.all()


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    valid_statuses = {"pending", "confirmed", "in_transit", "delivered", "cancelled"}
    new_status = body.get("status", "")
    if new_status not in valid_statuses:
        raise HTTPException(status_code=422, detail=f"Invalid status. Must be one of: {', '.join(sorted(valid_statuses))}")
    order.status = new_status
    db.commit()
    db.refresh(order)
    return order


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    listings = db.query(Listing).filter(Listing.seller_id == user.id).all()
    active = [l for l in listings if l.status == "active"]

    item_ids_q = db.query(OrderItem.order_id).filter(OrderItem.seller_id == user.id).distinct().scalar_subquery()
    orders = db.query(Order).filter(Order.id.in_(item_ids_q)).order_by(Order.created_at.desc()).all()

    delivered_or_confirmed = [o for o in orders if o.status in ("delivered", "confirmed")]
    revenue = sum(o.total for o in delivered_or_confirmed)
    total_views = sum(l.views for l in listings)
    pending_orders = len([o for o in orders if o.status == "pending"])

    top = max(listings, key=lambda l: l.views) if listings else None
    total_rating = sum(l.rating for l in listings if l.rating > 0)
    reviewed = len([l for l in listings if l.rating > 0])
    avg_rating = total_rating / reviewed if reviewed > 0 else 0.0

    recent_listings = sorted(listings, key=lambda l: l.created_at, reverse=True)[:5]
    recent_orders = orders[:5]

    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)
    today = now_naive.replace(hour=0, minute=0, second=0, microsecond=0)
    week_agg: dict[str, dict[str, int]] = {}
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        label = d.strftime("%a")
        week_agg[label] = {"orders": 0, "revenue": 0}
    for o in orders:
        if o.created_at >= today - timedelta(days=7):
            label = o.created_at.strftime("%a")
            if label in week_agg:
                week_agg[label]["orders"] += 1
                if o.status in ("delivered", "confirmed"):
                    week_agg[label]["revenue"] += o.total

    weekly_data = [WeeklyDataPoint(label=label, orders=v["orders"], revenue=v["revenue"]) for label, v in week_agg.items()]

    return DashboardResponse(
        totalListings=len(listings),
        activeListings=len(active),
        totalViews=total_views,
        revenue=revenue,
        ordersCount=len(orders),
        pendingOrders=pending_orders,
        topListing=top,
        avgRating=round(avg_rating, 1),
        reviewedListings=reviewed,
        recentListings=recent_listings,
        recentOrders=recent_orders,
        weeklyData=weekly_data,
    )


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    listings = db.query(Listing).filter(Listing.seller_id == user.id).all()

    item_ids_q = db.query(OrderItem.order_id).filter(OrderItem.seller_id == user.id).distinct().scalar_subquery()
    orders = db.query(Order).filter(Order.id.in_(item_ids_q)).all()

    delivered = [o for o in orders if o.status == "delivered"]
    confirmed = [o for o in orders if o.status == "confirmed"]
    pending = [o for o in orders if o.status == "pending"]
    in_transit = [o for o in orders if o.status == "in_transit"]
    cancelled = [o for o in orders if o.status == "cancelled"]

    revenue = sum(o.total for o in delivered + confirmed)
    pending_revenue = sum(o.total for o in pending + in_transit)
    total_views = sum(l.views for l in listings)
    total_orders = len(orders)
    conversion_rate = round((len(delivered) / total_orders) * 100, 1) if total_orders > 0 else 0.0

    total_rating = sum(l.rating for l in listings if l.rating > 0)
    reviewed = len([l for l in listings if l.rating > 0])
    avg_rating = round(total_rating / reviewed, 1) if reviewed > 0 else 0.0

    items_count = db.query(func.sum(OrderItem.quantity)).filter(OrderItem.seller_id == user.id).scalar() or 0
    units_sold = int(items_count)

    top_listings = sorted(listings, key=lambda l: l.views, reverse=True)[:5]

    today = datetime.now(timezone.utc).replace(tzinfo=None).replace(hour=0, minute=0, second=0, microsecond=0)
    week_rev: dict[str, int] = {}
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        week_rev[d.strftime("%a")] = 0
    for o in orders:
        if o.created_at >= today - timedelta(days=7) and o.status in ("delivered", "confirmed"):
            label = o.created_at.strftime("%a")
            if label in week_rev:
                week_rev[label] += o.total

    weekly_revenue = [WeeklyRevenuePoint(label=label, value=val) for label, val in week_rev.items()]

    return AnalyticsResponse(
        revenue=revenue,
        pendingRevenue=pending_revenue,
        totalViews=total_views,
        conversionRate=conversion_rate,
        statusBreakdown=StatusBreakdown(
            pending=len(pending),
            confirmed=len(confirmed),
            in_transit=len(in_transit),
            delivered=len(delivered),
            cancelled=len(cancelled),
        ),
        topListings=top_listings,
        activeListingsCount=len([l for l in listings if l.status == "active"]),
        totalOrders=total_orders,
        avgRating=avg_rating,
        unitsSold=units_sold,
        weeklyRevenue=weekly_revenue,
    )
