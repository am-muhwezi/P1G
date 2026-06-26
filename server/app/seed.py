import uuid
from datetime import datetime, timedelta, timezone
import bcrypt
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.listing import Listing
from app.models.order import Order, OrderItem
from app.models.settings import PlatformSettings


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _token() -> str:
    return str(uuid.uuid4())


def _ago(days: int) -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=days)


TEST_USERS = [
    {"email": "admin@p1gmarket.ug", "password": "admin123", "name": "Admin User", "phone": "0700 000 000", "role": "admin", "district": "Kampala"},
    {"email": "buyer@p1gmarket.ug", "password": "buyer123", "name": "John Buyer", "phone": "0772 345 678", "role": "buyer", "district": "Kampala"},
    {"email": "seller@p1gmarket.ug", "password": "seller123", "name": "Mukasa Farms", "phone": "0755 123 456", "role": "seller", "district": "Masaka", "farm_name": "Mukasa Pig Farm"},
    {"email": "seller2@p1gmarket.ug", "password": "seller123", "name": "Mukono Quality Meats", "phone": "0778 901 234", "role": "seller", "district": "Mukono", "farm_name": "Mukono Meats"},
    {"email": "buyer2@p1gmarket.ug", "password": "buyer123", "name": "Sarah Nakato", "phone": "0789 012 345", "role": "buyer", "district": "Mbarara"},
]

TEST_LISTINGS = [
    {"seller_idx": 2, "title": "Large White Boar - 80kg", "description": "A massive, healthy Large White Boar. Perfect for breeding or slaughter.", "category": "live_pigs", "price": 1200000, "stock": 2, "unit": "pig", "district": "Masaka", "status": "active", "views": 342, "rating": 4.5, "review_count": 28, "seller_verified": True, "created_days_ago": 5},
    {"seller_idx": 3, "title": "Premium Pork Belly - 5kg", "description": "Premium thick-cut pork belly with exquisite marbling.", "category": "pork", "price": 85000, "stock": 15, "unit": "kg", "district": "Mukono", "status": "active", "views": 521, "rating": 4.8, "review_count": 42, "seller_verified": True, "created_days_ago": 4},
    {"seller_idx": 2, "title": "Duroc Piglets - Set of 5", "description": "Healthy reddish-brown Duroc piglets from a modern nursery.", "category": "live_pigs", "price": 600000, "stock": 3, "unit": "set", "district": "Mpigi", "status": "active", "views": 189, "rating": 4.3, "review_count": 15, "seller_verified": True, "created_days_ago": 8},
    {"seller_idx": 2, "title": "Purebred Duroc Gilt", "description": "Pedigree Duroc gilt with deep mahogany coat. Strong and well-bred.", "category": "live_pigs", "price": 1200000, "stock": 1, "unit": "pig", "district": "Masaka", "status": "active", "views": 276, "rating": 4.6, "review_count": 22, "seller_verified": True, "created_days_ago": 10},
    {"seller_idx": 2, "title": "Large White Sow - Proven Breeder", "description": "Proven breeder with excellent mothering ability and calm temperament.", "category": "live_pigs", "price": 950000, "stock": 2, "unit": "pig", "district": "Mbarara", "status": "active", "views": 198, "rating": 4.2, "review_count": 19, "seller_verified": True, "created_days_ago": 6},
    {"seller_idx": 3, "title": "Camborough Line 24", "description": "Athletic and well-proportioned Camborough breed. High FCR.", "category": "live_pigs", "price": 1100000, "stock": 1, "unit": "pig", "district": "Luweero", "status": "active", "views": 156, "rating": 4.1, "review_count": 11, "seller_verified": True, "created_days_ago": 7},
    {"seller_idx": 2, "title": "Premium Landrace Sow", "description": "Superior breeding stock with exceptional genetic lineage. Peak health.", "category": "live_pigs", "price": 1450000, "stock": 1, "unit": "pig", "district": "Luweero", "status": "active", "views": 412, "rating": 4.9, "review_count": 35, "seller_verified": True, "created_days_ago": 5},
    {"seller_idx": 3, "title": "Organic Feed - Maize Blend 50kg", "description": "High-energy organic maize feed blend. Perfect for finishing pigs.", "category": "feed", "price": 95000, "stock": 40, "unit": "bag", "district": "Mukono", "status": "active", "views": 87, "rating": 4.0, "review_count": 8, "seller_verified": True, "created_days_ago": 11},
    {"seller_idx": 2, "title": "Weaner Piglets - Large White Cross", "description": "Ready-to-feed weaners, 8 weeks old. Vaccinated and dewormed.", "category": "live_pigs", "price": 350000, "stock": 10, "unit": "pig", "district": "Masaka", "status": "pending", "views": 45, "rating": 0.0, "review_count": 0, "seller_verified": False, "created_days_ago": 3},
    {"seller_idx": 3, "title": "Anthelmintic Dewormer - 100ml", "description": "Broad-spectrum dewormer for pigs. Safe for all ages.", "category": "medicines", "price": 45000, "stock": 30, "unit": "bottle", "district": "Mukono", "status": "active", "views": 64, "rating": 4.3, "review_count": 7, "seller_verified": True, "created_days_ago": 9},
]

TEST_ORDERS = [
    {"buyer_idx": 1, "listing_idx": 0, "qty": 1, "status": "confirmed", "payment": "MTN Mobile Money", "address": "Plot 15, Kampala Road", "district": "Kampala", "delivery_fee": 50000, "days_ago": 4},
    {"buyer_idx": 1, "listing_idx": 2, "qty": 1, "status": "in_transit", "payment": "Airtel Money", "address": "Plot 15, Kampala Road", "district": "Kampala", "delivery_fee": 30000, "days_ago": 6},
    {"buyer_idx": 1, "listing_idx": 1, "qty": 2, "status": "delivered", "payment": "Cash on Delivery", "address": "Plot 15, Kampala Road", "district": "Kampala", "delivery_fee": 15000, "days_ago": 8},
    {"buyer_idx": 1, "listing_idx": 6, "qty": 1, "status": "pending", "payment": "Bank Transfer", "address": "Plot 15, Kampala Road", "district": "Kampala", "delivery_fee": 60000, "days_ago": 3},
    {"buyer_idx": 1, "listing_idx": 7, "qty": 5, "status": "cancelled", "payment": "MTN Mobile Money", "address": "Plot 15, Kampala Road", "district": "Kampala", "delivery_fee": 25000, "days_ago": 9},
    {"buyer_idx": 4, "listing_idx": 4, "qty": 1, "status": "delivered", "payment": "MTN Mobile Money", "address": "Boma Road, Mbarara", "district": "Mbarara", "delivery_fee": 35000, "days_ago": 5},
    {"buyer_idx": 4, "listing_idx": 0, "qty": 1, "status": "in_transit", "payment": "Airtel Money", "address": "Boma Road, Mbarara", "district": "Mbarara", "delivery_fee": 55000, "days_ago": 2},
    {"buyer_idx": 4, "listing_idx": 9, "qty": 3, "status": "pending", "payment": "Cash on Delivery", "address": "Boma Road, Mbarara", "district": "Mbarara", "delivery_fee": 10000, "days_ago": 1},
]


def seed_all(db: Session):
    created_users = {}

    existing = db.query(User).count()
    if existing > 0:
        print("  Database already has users, skipping seed")
        return

    for u in TEST_USERS:
        user = User(
            email=u["email"],
            password_hash=_hash(u["password"]),
            name=u["name"],
            phone=u["phone"],
            role=u["role"],
            district=u.get("district", ""),
            farm_name=u.get("farm_name"),
            token=_token(),
            created_at=_ago(30),
        )
        db.add(user)
        db.flush()
        created_users[u["email"]] = user
        print(f"  Created {u['role']}: {u['email']} / {u['password']}")

    for i, l in enumerate(TEST_LISTINGS):
        seller = created_users[TEST_USERS[l["seller_idx"]]["email"]]
        listing = Listing(
            seller_id=seller.id,
            seller_name=seller.name,
            title=l["title"],
            description=l["description"],
            category=l["category"],
            price=l["price"],
            stock=l["stock"],
            unit=l["unit"],
            district=l["district"],
            status=l["status"],
            views=l["views"],
            rating=l["rating"],
            review_count=l["review_count"],
            seller_verified=l["seller_verified"],
            created_at=_ago(l["created_days_ago"]),
            updated_at=_ago(l["created_days_ago"]),
        )
        db.add(listing)
        db.flush()

    for o in TEST_ORDERS:
        buyer = created_users[TEST_USERS[o["buyer_idx"]]["email"]]
        listing = db.query(Listing).order_by(Listing.created_at.desc()).offset(o["listing_idx"]).first()
        if not listing:
            continue
        seller = db.query(User).filter(User.id == listing.seller_id).first()
        total = listing.price * o["qty"] + o["delivery_fee"]
        order = Order(
            buyer_id=buyer.id,
            buyer_name=buyer.name,
            total=total,
            delivery_fee=o["delivery_fee"],
            status=o["status"],
            payment_method=o["payment"],
            address=o["address"],
            district=o["district"],
            created_at=_ago(o["days_ago"]),
            updated_at=_ago(o["days_ago"]),
        )
        db.add(order)
        db.flush()
        item = OrderItem(
            order_id=order.id,
            listing_id=listing.id,
            seller_id=seller.id,
            seller_name=seller.name,
            title=listing.title,
            price=listing.price,
            quantity=o["qty"],
            unit=listing.unit,
        )
        db.add(item)

    settings = PlatformSettings(id="default")
    db.add(settings)

    db.commit()
    print(f"  Seeded {len(TEST_USERS)} users, {len(TEST_LISTINGS)} listings, {len(TEST_ORDERS)} orders")

seed_admin = seed_all
seed_settings = seed_all
