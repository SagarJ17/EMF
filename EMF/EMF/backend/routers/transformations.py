from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from database.session import get_db
from models.transformation import Transformation
from pydantic import BaseModel

router = APIRouter()

class TransformationResponse(BaseModel):
    id: int
    name: str
    result: str
    quote: str | None
    before_image: str
    after_image: str
    video: str | None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[TransformationResponse])
async def get_transformations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Transformation).order_by(Transformation.id.asc()))
    transformations = result.scalars().all()
    return transformations

class TransformationCreate(BaseModel):
    name: str
    result: str
    quote: str | None = None
    before_image: str
    after_image: str
    video: str | None = None

@router.post("/", response_model=TransformationResponse)
async def create_transformation(data: TransformationCreate, db: AsyncSession = Depends(get_db)):
    db_item = Transformation(**data.model_dump())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

@router.delete("/{id}")
async def delete_transformation(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Transformation).where(Transformation.id == id))
    item = result.scalar_one_or_none()
    if item is None:
        return {"error": "Not found"}
    await db.delete(item)
    await db.commit()
    return {"status": "deleted"}
