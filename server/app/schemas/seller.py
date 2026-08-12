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
    sex: Optional[str] = None
    breed: Optional[str] = None
    age_months: Optional[int] = Field(default=None, alias="ageMonths")
    age_weeks: Optional[int] = Field(default=None, alias="ageWeeks")
    image: str = ""
    images: list[str] = []

    model_config = {"populate_by_name": True}


class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    stock: Optional[int] = None
    unit: Optional[str] = None
    sex: Optional[str] = None
    breed: Optional[str] = None
    age_months: Optional[int] = Field(default=None, alias="ageMonths")
    age_weeks: Optional[int] = Field(default=None, alias="ageWeeks")
    status: Optional[str] = None
    image: Optional[str] = None
    images: Optional[list[str]] = None

    model_config = {"populate_by_name": True}


class ListingResponse(BaseModel):
    id: str
    sellerId: str = Field(validation_alias="seller_id")
    sellerName: str = Field(validation_alias="seller_name")
    sellerVerified: bool = Field(validation_alias="seller_verified")
    title: str
    description: str
    category: str
    price: int
    stock: int
    unit: str
    district: str
    sex: Optional[str] = None
    breed: Optional[str] = None
    ageMonths: Optional[int] = Field(default=None, validation_alias="age_months")
    ageWeeks: Optional[int] = Field(default=None, validation_alias="age_weeks")
    status: str
    views: int
    rating: float
    reviewCount: int = Field(validation_alias="review_count")
    image: str
    images: list[str] = []
    createdAt: datetime = Field(validation_alias="created_at")
    updatedAt: datetime = Field(validation_alias="updated_at")

    @field_validator("images", mode="before")
    @classmethod
    def normalize_images(cls, v):
        return v or []

    model_config = {"from_attributes": True, "populate_by_name": True}


class OrderItemResponse(BaseModel):
    listingId: str = Field(validation_alias="listing_id")
    title: str
    price: int
    quantity: int
    sellerName: str = Field(validation_alias="seller_name")
    unit: str

    model_config = {"from_attributes": True, "populate_by_name": True}


class OrderResponse(BaseModel):
    id: str
    buyerId: str = Field(validation_alias="buyer_id")
    buyerName: str = Field(validation_alias="buyer_name")
    items: list[OrderItemResponse]
    total: int
    deliveryFee: int = Field(validation_alias="delivery_fee")
    status: str
    paymentMethod: str = Field(validation_alias="payment_method")
    address: str
    district: str
    notes: Optional[str] = None
    createdAt: datetime = Field(validation_alias="created_at")
    updatedAt: datetime = Field(validation_alias="updated_at")

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
