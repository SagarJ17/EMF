from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db
from schemas.schemas import BookingCreate, BookingResponse
from models.models import Booking
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


@router.post("", response_model=BookingResponse)
@limiter.limit("5/minute")
async def create_booking(
    request: Request,
    payload: BookingCreate,
    db: AsyncSession = Depends(get_db),
):
    booking = Booking(
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        email=payload.email.lower().strip(),
        goal=payload.goal,
        preferred_time=payload.preferred_time,
        location=payload.location,
    )
    db.add(booking)
    await db.flush()
    await db.refresh(booking)

    return BookingResponse(
        success=True,
        message=f"Booking confirmed! We'll contact you within 24 hours to confirm your free session, {payload.name.split()[0]}. 💪",
        booking_id=booking.id,
    )
