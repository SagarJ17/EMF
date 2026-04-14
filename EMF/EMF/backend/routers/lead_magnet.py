from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db
from schemas.schemas import LeadMagnetCreate, LeadMagnetResponse
from models.models import UserLead
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


@router.post("", response_model=LeadMagnetResponse)
@limiter.limit("5/minute")
async def create_lead(
    request: Request,
    payload: LeadMagnetCreate,
    db: AsyncSession = Depends(get_db),
):
    lead = UserLead(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        goal=payload.goal,
    )
    db.add(lead)
    await db.flush()
    await db.refresh(lead)

    return LeadMagnetResponse(
        success=True,
        message=f"Thanks {payload.name.split()[0]}! 🎉 Your free diet plan is ready. Check your WhatsApp or email shortly.",
        diet_plan_url=None,
    )
