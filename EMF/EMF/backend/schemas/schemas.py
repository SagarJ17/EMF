from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ─── Lead Magnet ───────────────────────────────────────────────────────────────

class LeadMagnetCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    goal: Optional[str] = Field(None, max_length=255)


class LeadMagnetResponse(BaseModel):
    success: bool
    message: str
    diet_plan_url: Optional[str] = None


# ─── Bookings ──────────────────────────────────────────────────────────────────

class BookingCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20)
    email: EmailStr
    goal: Optional[str] = Field(None, max_length=255)
    preferred_time: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)


class BookingResponse(BaseModel):
    success: bool
    message: str
    booking_id: Optional[int] = None


# ─── Contact ───────────────────────────────────────────────────────────────────

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    message: str = Field(..., min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    success: bool
    message: str


# ─── BMI ───────────────────────────────────────────────────────────────────────

class BMIRequest(BaseModel):
    height_cm: float = Field(..., gt=50, lt=300)
    weight_kg: float = Field(..., gt=10, lt=500)
    gender: str = Field(..., pattern="^(male|female)$")
    activity_level: str = Field(
        ...,
        pattern="^(sedentary|lightly_active|moderately_active|very_active|extra_active)$",
    )


class BMIResponse(BaseModel):
    bmi_value: float
    category: str
    calorie_estimate: int
    protein_grams: int
    carbs_range: str
    fats_range: str
    recommendations: list[str]


# ─── Reviews ───────────────────────────────────────────────────────────────────

class ReviewOut(BaseModel):
    id: int
    name: str
    rating: int
    comment: str
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


# ─── Videos ────────────────────────────────────────────────────────────────────

class VideoOut(BaseModel):
    id: int
    title: str
    platform: str
    url: str
    thumbnail: Optional[str] = None

    model_config = {"from_attributes": True}
