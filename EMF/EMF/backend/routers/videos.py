from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.session import get_db
from schemas.schemas import VideoOut
from models.models import Video
from typing import List

router = APIRouter()

SEED_VIDEOS = [
    {
        "title": "Full Body Home Workout — No Equipment",
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=oAPCPjnU1wA",
        "thumbnail": "https://img.youtube.com/vi/oAPCPjnU1wA/hqdefault.jpg",
    },
    {
        "title": "Fat Loss HIIT Workout — 20 Minutes",
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=ml6cT4AZdqI",
        "thumbnail": "https://img.youtube.com/vi/ml6cT4AZdqI/hqdefault.jpg",
    },
    {
        "title": "Core Strength Training at Home",
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=DHD1-2P94XI",
        "thumbnail": "https://img.youtube.com/vi/DHD1-2P94XI/hqdefault.jpg",
    },
    {
        "title": "Mobility & Flexibility Routine",
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=g_tea8ZNk5A",
        "thumbnail": "https://img.youtube.com/vi/g_tea8ZNk5A/hqdefault.jpg",
    },
    {
        "title": "Beginner Strength Program Week 1",
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=2pLT-olgUJs",
        "thumbnail": "https://img.youtube.com/vi/2pLT-olgUJs/hqdefault.jpg",
    },
    {
        "title": "5-Minute Morning Activation",
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=VHyGqsPOUHs",
        "thumbnail": "https://img.youtube.com/vi/VHyGqsPOUHs/hqdefault.jpg",
    },
]


@router.get("", response_model=List[VideoOut])
async def get_videos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Video).order_by(Video.id))
    videos = result.scalars().all()

    if not videos:
        for v in SEED_VIDEOS:
            video = Video(**v)
            db.add(video)
        await db.flush()
        result = await db.execute(select(Video).order_by(Video.id))
        videos = result.scalars().all()

    return videos

from pydantic import BaseModel
class VideoCreate(BaseModel):
    title: str
    platform: str
    url: str
    thumbnail: str | None = None

@router.post("", response_model=VideoOut)
async def create_video(data: VideoCreate, db: AsyncSession = Depends(get_db)):
    db_item = Video(**data.model_dump())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

@router.delete("/{id}")
async def delete_video(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Video).where(Video.id == id))
    item = result.scalar_one_or_none()
    if not item: return {"error": "Not found"}
    await db.delete(item)
    await db.commit()
    return {"status": "deleted"}
