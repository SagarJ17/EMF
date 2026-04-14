from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.session import get_db
from schemas.schemas import ReviewOut
from models.models import Review
from typing import List

router = APIRouter()

SEED_REVIEWS = [
    {
        "name": "Rahul Sharma",
        "rating": 5,
        "comment": "Lost 12kg in 3 months with EMF Fitness! The home training sessions are super effective and the plan is completely personalised. Best investment I made for my health.",
        "image_url": "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face",
    },
    {
        "name": "Priya Mehta",
        "rating": 5,
        "comment": "I was skeptical about home training but the results speak for themselves. Down 8kg, improved posture, and I feel stronger than ever. The accountability check-ins made all the difference!",
        "image_url": "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    },
    {
        "name": "Arjun Nair",
        "rating": 5,
        "comment": "6-pack in 4 months. Sounds crazy but it actually happened. The nutrition plan and workout combo is elite. Flexible timing made it fit perfectly into my work schedule.",
        "image_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
    },
    {
        "name": "Sneha Kapoor",
        "rating": 5,
        "comment": "Post-pregnancy weight loss was my goal and EMF Fitness helped me achieve it safely. Completely customised program, zero generic plans. I feel like myself again!",
        "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    {
        "name": "Vikram Singh",
        "rating": 5,
        "comment": "The online coaching is just as effective as in-person. Video check-ins, form corrections via WhatsApp, and a fully structured plan. Gained 7kg of lean muscle in 5 months.",
        "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
]


@router.get("", response_model=List[ReviewOut])
async def get_reviews(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Review).order_by(Review.id))
    reviews = result.scalars().all()

    if not reviews:
        # Seed sample reviews on first request
        for r in SEED_REVIEWS:
            review = Review(**r)
            db.add(review)
        await db.flush()
        result = await db.execute(select(Review).order_by(Review.id))
        reviews = result.scalars().all()

    return reviews

from pydantic import BaseModel
class ReviewCreate(BaseModel):
    name: str
    rating: int
    comment: str
    image_url: str | None = None

@router.post("", response_model=ReviewOut)
async def create_review(data: ReviewCreate, db: AsyncSession = Depends(get_db)):
    db_item = Review(**data.model_dump())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

@router.delete("/{id}")
async def delete_review(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Review).where(Review.id == id))
    item = result.scalar_one_or_none()
    if not item: return {"error": "Not found"}
    await db.delete(item)
    await db.commit()
    return {"status": "deleted"}
