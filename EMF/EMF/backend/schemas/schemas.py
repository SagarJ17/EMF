from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Optional, Any
from datetime import datetime
import re

def sanitize_html(v: Any) -> Any:
    if isinstance(v, str):
        # Strip exact HTML tags to prevent XSS string injection into the Postgres DB
        v = re.sub(r'<[^>]*>', '', v)
    return v

class SecureModel(BaseModel):
    @model_validator(mode='before')
    @classmethod
    def sanitize_strings(cls, data: Any) -> Any:
        if isinstance(data, dict):
            return {k: sanitize_html(v) for k, v in data.items()}
        return data

# ─── Lead Magnet ───────────────────────────────────────────────────────────────

class LeadMagnetCreate(SecureModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    goal: Optional[str] = Field(None, max_length=255)


class LeadMagnetResponse(SecureModel):
    success: bool
    message: str
    diet_plan_url: Optional[str] = None


# ─── Bookings ──────────────────────────────────────────────────────────────────

class BookingCreate(SecureModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")
    email: EmailStr
    goal: Optional[str] = Field(None, max_length=255)
    preferred_time: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)


class BookingResponse(SecureModel):
    success: bool
    message: str
    booking_id: Optional[int] = None


# ─── Contact ───────────────────────────────────────────────────────────────────

class ContactCreate(SecureModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")
    email: Optional[str] = Field(None, max_length=255)
    message: Optional[str] = Field(None, max_length=2000)


class ContactResponse(SecureModel):
    success: bool
    message: str


# ─── BMI ───────────────────────────────────────────────────────────────────────

class BMIRequest(SecureModel):
    height_cm: float = Field(..., gt=50, lt=300)
    weight_kg: float = Field(..., gt=10, lt=500)
    gender: str = Field(..., pattern="^(male|female)$")
    activity_level: str = Field(
        ...,
        pattern="^(sedentary|lightly_active|moderately_active|very_active|extra_active)$",
    )


class BMIResponse(SecureModel):
    bmi_value: float
    category: str
    calorie_estimate: int
    protein_grams: int
    carbs_range: str
    fats_range: str
    recommendations: list[str]


# ─── Reviews ───────────────────────────────────────────────────────────────────

class ReviewOut(SecureModel):
    id: int
    name: str
    rating: int
    comment: str
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


# ─── Videos ────────────────────────────────────────────────────────────────────

class VideoOut(SecureModel):
    id: int
    title: str
    platform: str
    url: str
    thumbnail: Optional[str] = None

    model_config = {"from_attributes": True}
