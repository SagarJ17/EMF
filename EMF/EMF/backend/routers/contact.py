from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db
from schemas.schemas import ContactCreate, ContactResponse
from models.models import ContactMessage
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


@router.post("", response_model=ContactResponse)
@limiter.limit("5/minute")
async def create_contact(
    request: Request,
    payload: ContactCreate,
    db: AsyncSession = Depends(get_db),
):
    msg = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        phone=payload.phone,
        message=payload.message.strip(),
    )
    db.add(msg)
    await db.flush()

    return ContactResponse(
        success=True,
        message="Message received! We'll get back to you within 24 hours.",
    )
