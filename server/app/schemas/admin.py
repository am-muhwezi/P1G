from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime


class AdminUserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    role: str
    district: Optional[str] = None
    farmName: Optional[str] = Field(default=None, alias="farm_name")
    status: str = "active"
    suspendedAt: Optional[datetime] = Field(default=None, alias="suspended_at")
    createdAt: datetime = Field(alias="created_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class AdminUserStatusUpdate(BaseModel):
    status: Literal["active", "suspended"]


class AdminUserUpdate(BaseModel):
    role: Optional[str] = None
    district: Optional[str] = None
    farm_name: Optional[str] = None


class AdminListingStatusUpdate(BaseModel):
    status: Literal["active", "pending", "rejected"]


class AdminListingResponse(BaseModel):
    id: str
    sellerId: str = Field(alias="seller_id")
    sellerName: str = Field(alias="seller_name")
    sellerVerified: bool = Field(alias="seller_verified")
    title: str
    description: str
    category: str
    price: int
    stock: int
    unit: str
    district: str
    status: str
    views: int
    rating: float
    reviewCount: int = Field(alias="review_count")
    image: str
    images: list[str] = []
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")

    @field_validator("images", mode="before")
    @classmethod
    def normalize_images(cls, v):
        return v or []

    model_config = {"from_attributes": True, "populate_by_name": True}


class AdminListingDetailResponse(AdminListingResponse):
    sellerStatus: str = ""
    sellerEmail: str = ""

    model_config = {"from_attributes": True, "populate_by_name": True}


class AdminOrderItemResponse(BaseModel):
    listingId: str = Field(alias="listing_id")
    title: str
    price: int
    quantity: int
    sellerName: str = Field(alias="seller_name")
    unit: str

    model_config = {"from_attributes": True, "populate_by_name": True}


class AdminOrderResponse(BaseModel):
    id: str
    buyerId: str = Field(alias="buyer_id")
    buyerName: str = Field(alias="buyer_name")
    items: list[AdminOrderItemResponse]
    total: int
    deliveryFee: int = Field(alias="delivery_fee")
    status: str
    paymentMethod: str = Field(alias="payment_method")
    address: str
    district: str
    notes: Optional[str] = None
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class AdminSettingsResponse(BaseModel):
    siteName: str = Field(alias="site_name")
    contactEmail: str = Field(alias="contact_email")
    commissionRate: int = Field(alias="commission_rate")
    maintenanceMode: bool = Field(alias="maintenance_mode")

    model_config = {"from_attributes": True, "populate_by_name": True}


class AdminSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    contact_email: Optional[str] = None
    commission_rate: Optional[int] = None
    maintenance_mode: Optional[bool] = None


class AdminDashboardResponse(BaseModel):
    totalUsers: int
    buyersCount: int
    sellersCount: int
    totalListings: int
    activeListings: int
    pendingListings: int
    totalOrders: int
    pendingOrders: int
    deliveredOrders: int
    revenue: int
    todaySignups: int
    todayOrders: int
    recentOrders: list[AdminOrderResponse]
    recentListings: list[AdminListingResponse]


class AdminAnalyticsResponse(BaseModel):
    revenue: int
    pendingRevenue: int
    totalOrders: int
    ordersBreakdown: dict[str, int]
    totalUsers: int
    buyerCount: int
    sellerCount: int
    totalListings: int
    activeListings: int
    weeklyRevenue: list[dict]
    conversionRate: float


class AdminUserDetailResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    role: str
    district: Optional[str] = None
    farmName: Optional[str] = Field(default=None, alias="farm_name")
    status: str = "active"
    suspendedAt: Optional[datetime] = Field(default=None, alias="suspended_at")
    createdAt: datetime = Field(alias="created_at")
    listingsCount: int = 0
    ordersCount: int = 0
    revenue: int = 0

    model_config = {"from_attributes": True, "populate_by_name": True}


class AdminWaitlistStats(BaseModel):
    total: int
    buyers: int
    sellers: int
    today: int


class AdminWaitlistEntryResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    interest: str
    createdAt: datetime = Field(alias="created_at")

    model_config = {"from_attributes": True, "populate_by_name": True}
