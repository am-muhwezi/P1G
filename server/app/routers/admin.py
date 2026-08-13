import csv
import io
import uuid
from datetime import datetime, timedelta, timezone
import bcrypt
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.order import Order, OrderItem
from app.models.waitlist import WaitlistEntry
from app.models.settings import PlatformSettings
from app.routers.auth import get_current_user
from app.schemas.admin import (
    AdminDashboardResponse,
    AdminAnalyticsResponse,
    AdminUserResponse,
    AdminUserDetailResponse,
    AdminUserUpdate,
    AdminUserStatusUpdate,
    AdminListingResponse,
    AdminListingDetailResponse,
    AdminListingStatusUpdate,
    AdminOrderResponse,
    AdminOrderItemResponse,
    AdminSettingsResponse,
    AdminSettingsUpdate,
    AdminWaitlistStats,
    AdminWaitlistEntryResponse,
)

class CreateAdminRequest(BaseModel):
    email: str
    password: str
    name: str
    phone: str = ""


router = APIRouter(prefix="/api/admin", tags=["admin"])


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def _get_settings(db: Session) -> PlatformSettings:
    settings = db.query(PlatformSettings).filter(PlatformSettings.id == "default").first()
    if not settings:
        settings = PlatformSettings(id="default")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.post("/users", response_model=AdminUserResponse, status_code=201)
def create_admin(
    data: CreateAdminRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(
        email=data.email,
        password_hash=bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode(),
        name=data.name,
        phone=data.phone,
        role="admin",
        district="",
        token=str(uuid.uuid4()),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/dashboard", response_model=AdminDashboardResponse)
def dashboard(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    total_users = db.query(func.count(User.id)).scalar() or 0
    buyers_count = db.query(func.count(User.id)).filter(User.role == "buyer").scalar() or 0
    sellers_count = db.query(func.count(User.id)).filter(User.role == "seller").scalar() or 0

    total_listings = db.query(func.count(Listing.id)).scalar() or 0
    active_listings = db.query(func.count(Listing.id)).filter(Listing.status == "active").scalar() or 0
    pending_listings = db.query(func.count(Listing.id)).filter(Listing.status == "pending").scalar() or 0

    total_orders = db.query(func.count(Order.id)).scalar() or 0
    pending_orders = db.query(func.count(Order.id)).filter(Order.status == "pending").scalar() or 0
    delivered_orders = db.query(func.count(Order.id)).filter(Order.status == "delivered").scalar() or 0

    revenue = db.query(func.sum(Order.total)).filter(Order.status.in_(["delivered", "confirmed"])).scalar() or 0

    today_start = datetime.now(timezone.utc).replace(tzinfo=None).replace(hour=0, minute=0, second=0, microsecond=0)
    today_signups = db.query(func.count(User.id)).filter(User.created_at >= today_start).scalar() or 0
    today_orders = db.query(func.count(Order.id)).filter(Order.created_at >= today_start).scalar() or 0

    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    recent_listings = db.query(Listing).order_by(Listing.created_at.desc()).limit(5).all()

    return AdminDashboardResponse(
        totalUsers=total_users,
        buyersCount=buyers_count,
        sellersCount=sellers_count,
        totalListings=total_listings,
        activeListings=active_listings,
        pendingListings=pending_listings,
        totalOrders=total_orders,
        pendingOrders=pending_orders,
        deliveredOrders=delivered_orders,
        revenue=int(revenue),
        todaySignups=today_signups,
        todayOrders=today_orders,
        recentOrders=recent_orders,
        recentListings=recent_listings,
    )


@router.get("/analytics", response_model=AdminAnalyticsResponse)
def analytics(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    total_users = db.query(func.count(User.id)).scalar() or 0
    buyer_count = db.query(func.count(User.id)).filter(User.role == "buyer").scalar() or 0
    seller_count = db.query(func.count(User.id)).filter(User.role == "seller").scalar() or 0

    total_listings = db.query(func.count(Listing.id)).scalar() or 0
    active_listings = db.query(func.count(Listing.id)).filter(Listing.status == "active").scalar() or 0

    total_orders = db.query(func.count(Order.id)).scalar() or 0

    revenue = db.query(func.sum(Order.total)).filter(Order.status.in_(["delivered", "confirmed"])).scalar() or 0
    pending_revenue = db.query(func.sum(Order.total)).filter(Order.status.in_(["pending", "in_transit"])).scalar() or 0

    orders_breakdown = {}
    for s in ("pending", "confirmed", "in_transit", "delivered", "cancelled"):
        orders_breakdown[s] = db.query(func.count(Order.id)).filter(Order.status == s).scalar() or 0

    delivered_count = orders_breakdown.get("delivered", 0)
    conversion_rate = round((delivered_count / total_orders * 100) if total_orders > 0 else 0, 1)

    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)
    weekly_revenue = []
    for i in range(6, -1, -1):
        day_start = (now_naive - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        day_rev = db.query(func.sum(Order.total)).filter(
            Order.status.in_(["delivered", "confirmed"]),
            Order.updated_at >= day_start,
            Order.updated_at < day_end,
        ).scalar() or 0
        weekly_revenue.append({"date": day_start.strftime("%Y-%m-%d"), "revenue": int(day_rev)})

    return AdminAnalyticsResponse(
        revenue=int(revenue),
        pendingRevenue=int(pending_revenue),
        totalOrders=total_orders,
        ordersBreakdown=orders_breakdown,
        totalUsers=total_users,
        buyerCount=buyer_count,
        sellerCount=seller_count,
        totalListings=total_listings,
        activeListings=active_listings,
        weeklyRevenue=weekly_revenue,
        conversionRate=conversion_rate,
    )


@router.get("/users", response_model=list[AdminUserResponse])
def list_users(
    search: str = "",
    role: str = "",
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    if search:
        pattern = f"%{search}%"
        q = q.filter(
            User.name.ilike(pattern) | User.email.ilike(pattern)
        )
    return q.order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}", response_model=AdminUserResponse)
def update_user(
    user_id: str,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    patch = data.model_dump(exclude_unset=True)
    for key, val in patch.items():
        setattr(user, key, val)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    order_count = db.query(func.count(Order.id)).filter(Order.buyer_id == user_id).scalar() or 0
    sold_items_count = db.query(func.count(OrderItem.id)).filter(OrderItem.seller_id == user_id).scalar() or 0
    if order_count or sold_items_count:
        parts = []
        if order_count:
            parts.append(f"{order_count} order(s) placed")
        if sold_items_count:
            parts.append(f"{sold_items_count} item(s) sold")
        raise HTTPException(
            status_code=409,
            detail=f"Cannot delete {user.name}: they have {' and '.join(parts)} on record. Suspend the account instead to preserve order history.",
        )

    db.query(Listing).filter(Listing.seller_id == user_id).delete(synchronize_session=False)
    db.delete(user)
    db.commit()


@router.get("/users/{user_id}", response_model=AdminUserDetailResponse)
def user_detail(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    listings_count = db.query(func.count(Listing.id)).filter(Listing.seller_id == user_id).scalar() or 0
    orders_count = db.query(func.count(Order.id)).filter(Order.buyer_id == user_id).scalar() or 0

    revenue = db.query(func.sum(Order.total)).filter(
        Order.buyer_id == user_id,
        Order.status.in_(["delivered", "confirmed"]),
    ).scalar() or 0

    resp = AdminUserDetailResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        role=user.role,
        district=user.district,
        farm_name=user.farm_name,
        status=user.status,
        suspended_at=user.suspended_at,
        created_at=user.created_at,
        listingsCount=listings_count,
        ordersCount=orders_count,
        revenue=int(revenue),
    )
    return resp


@router.get("/users/{user_id}/listings", response_model=list[AdminListingResponse])
def user_listings(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    listings = db.query(Listing).filter(Listing.seller_id == user_id).order_by(Listing.created_at.desc()).all()
    return listings


@router.patch("/users/{user_id}/status", response_model=AdminUserResponse)
def update_user_status(
    user_id: str,
    data: AdminUserStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = data.status
    user.suspended_at = datetime.now(timezone.utc).replace(tzinfo=None) if data.status == "suspended" else None
    db.commit()
    db.refresh(user)
    return user


@router.get("/listings", response_model=list[AdminListingResponse])
def list_listings(
    search: str = "",
    status: str = "",
    category: str = "",
    sort: str = "desc",
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    q = db.query(Listing)
    if status:
        q = q.filter(Listing.status == status)
    if category:
        q = q.filter(Listing.category == category)
    if search:
        pattern = f"%{search}%"
        q = q.filter(
            Listing.title.ilike(pattern) | Listing.seller_name.ilike(pattern)
        )
    order = Listing.created_at.desc() if sort != "asc" else Listing.created_at.asc()
    return q.order_by(order).all()


@router.get("/listings/{listing_id}", response_model=AdminListingDetailResponse)
def listing_detail(
    listing_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    seller = db.query(User).filter(User.id == listing.seller_id).first()
    detail = AdminListingDetailResponse(
        id=listing.id,
        seller_id=listing.seller_id,
        seller_name=listing.seller_name,
        seller_verified=listing.seller_verified,
        title=listing.title,
        description=listing.description,
        category=listing.category,
        price=listing.price,
        stock=listing.stock,
        unit=listing.unit,
        district=listing.district,
        status=listing.status,
        views=listing.views,
        rating=listing.rating,
        review_count=listing.review_count,
        image=listing.image,
        images=listing.images or [],
        created_at=listing.created_at,
        updated_at=listing.updated_at,
        sellerStatus=seller.status if seller else "",
        sellerEmail=seller.email if seller else "",
    )
    return detail


@router.patch("/listings/{listing_id}/status", response_model=AdminListingResponse)
def update_listing_status(
    listing_id: str,
    data: AdminListingStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    listing.status = data.status
    db.commit()
    db.refresh(listing)
    return listing


@router.delete("/listings/{listing_id}", status_code=204)
def delete_listing(
    listing_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    order_items_count = db.query(func.count(OrderItem.id)).filter(OrderItem.listing_id == listing_id).scalar() or 0
    if order_items_count:
        raise HTTPException(
            status_code=409,
            detail=f"Cannot delete '{listing.title}': it has {order_items_count} order(s) on record. Reject or deactivate it instead to preserve order history.",
        )

    db.delete(listing)
    db.commit()


@router.get("/orders", response_model=list[AdminOrderResponse])
def list_orders(
    status: str = "",
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    q = db.query(Order)
    if status:
        q = q.filter(Order.status == status)
    return q.order_by(Order.created_at.desc()).all()


@router.get("/waitlist", response_model=list[AdminWaitlistEntryResponse])
def list_waitlist(
    interest: str = "",
    search: str = "",
    sort: str = "desc",
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    q = db.query(WaitlistEntry)
    if interest:
        q = q.filter(WaitlistEntry.interest == interest)
    if search:
        pattern = f"%{search}%"
        q = q.filter(
            WaitlistEntry.name.ilike(pattern)
            | WaitlistEntry.email.ilike(pattern)
            | WaitlistEntry.phone.ilike(pattern)
        )
    order = WaitlistEntry.created_at.desc() if sort != "asc" else WaitlistEntry.created_at.asc()
    return q.order_by(order).all()


@router.get("/waitlist/stats", response_model=AdminWaitlistStats)
def waitlist_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    today_start = datetime.now(timezone.utc).replace(tzinfo=None).replace(hour=0, minute=0, second=0, microsecond=0)
    total = db.query(func.count(WaitlistEntry.id)).scalar() or 0
    buyers = db.query(func.count(WaitlistEntry.id)).filter(
        WaitlistEntry.interest.in_(["buyer", "both"])
    ).scalar() or 0
    sellers = db.query(func.count(WaitlistEntry.id)).filter(
        WaitlistEntry.interest.in_(["seller", "both"])
    ).scalar() or 0
    today = db.query(func.count(WaitlistEntry.id)).filter(
        WaitlistEntry.created_at >= today_start
    ).scalar() or 0
    return AdminWaitlistStats(total=total, buyers=buyers, sellers=sellers, today=today)


@router.get("/waitlist/export")
def export_waitlist_csv(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    entries = db.query(WaitlistEntry).order_by(WaitlistEntry.created_at.desc()).all()
    out = io.StringIO()
    w = csv.writer(out)
    w.writerow(["Name", "Email", "Phone", "Interest", "Date Joined"])
    for e in entries:
        w.writerow([e.name, e.email, e.phone, e.interest, e.created_at.isoformat()])

    out.seek(0)
    filename = f"p1g-waitlist-{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.csv"
    return StreamingResponse(
        iter([out.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/settings", response_model=AdminSettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return _get_settings(db)


@router.put("/settings", response_model=AdminSettingsResponse)
def update_settings(
    data: AdminSettingsUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    settings = _get_settings(db)
    patch = data.model_dump(exclude_unset=True)
    for key, val in patch.items():
        setattr(settings, key, val)
    db.commit()
    db.refresh(settings)
    return settings
