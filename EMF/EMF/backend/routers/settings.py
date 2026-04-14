from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.dialects.postgresql import insert
import json
from typing import Dict

from database.session import get_db
from models.models import Setting

router = APIRouter()

@router.get("/", response_model=Dict[str, str])
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Setting))
    settings = result.scalars().all()
    # Map back to a clean dictionary
    return {s.key: s.value for s in settings}

@router.post("/")
async def update_settings(payload: Dict[str, str], db: AsyncSession = Depends(get_db)):
    # Upsert each key/value pair
    for key, val in payload.items():
        # Check if exists
        result = await db.execute(select(Setting).where(Setting.key == key))
        setting = result.scalar_one_or_none()
        
        if setting:
            setting.value = val
        else:
            db.add(Setting(key=key, value=val))
            
    await db.commit()
    return {"status": "updated"}
