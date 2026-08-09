from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime


class ListingCreate(BaseModel):
    title: str
    description: str = ""
    category: str
    price: int
    stock: int = 1
    unit: str
    district: str = ""
    image: str = ""
    images: list[str] = []


class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    stock: Optional[int] = None
    unit: Optional[str] = None
    district: Optional[str] = None
    status: Optional[str] = None
    image: Optional[str] = None
    images: Optional[list[str]] = None


class ListingResponse(BaseModel):
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


class OrderItemResponse(BaseModel):
    listingId: str = Field(alias="listing_id")
    title: str
    price: int
    quantity: int
    sellerName: str = Field(alias="seller_name")
    unit: str

    model_config = {"from_attributes": True, "populate_by_name": True}


class OrderResponse(BaseModel):
    id: str
    buyerId: str = Field(alias="buyer_id")
    buyerName: str = Field(alias="buyer_name")
    items: list[OrderItemResponse]
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


class WeeklyDataPoint(BaseModel):
    label: str
    orders: int
    revenue: int


class WeeklyRevenuePoint(BaseModel):
    label: str
    value: int


class DashboardResponse(BaseModel):
    totalListings: int
    activeListings: int
    totalViews: int
    revenue: int
    ordersCount: int
    pendingOrders: int
    topListing: Optional[ListingResponse] = None
    avgRating: float
    reviewedListings: int
    recentListings: list[ListingResponse]
    recentOrders: list[OrderResponse]
    weeklyData: list[WeeklyDataPoint]


class StatusBreakdown(BaseModel):
    pending: int
    confirmed: int
    in_transit: int
    delivered: int
    cancelled: int


class AnalyticsResponse(BaseModel):
    revenue: int
    pendingRevenue: int
    totalViews: int
    conversionRate: float
    statusBreakdown: StatusBreakdown
    topListings: list[ListingResponse]
    activeListingsCount: int
    totalOrders: int
    avgRating: float
    unitsSold: int
    weeklyRevenue: list[WeeklyRevenuePoint]
