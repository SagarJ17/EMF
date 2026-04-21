from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta

from database.session import get_db
from models.models import ContactMessage, Booking, UserLead

router = APIRouter()

@router.get("/")
async def get_reports(db: AsyncSession = Depends(get_db)):
    # Fetch only contact messages
    contact_res = await db.execute(select(ContactMessage).order_by(ContactMessage.created_at.desc()))
    contacts = contact_res.scalars().all()

    # Create a unified table list
    unified_data = []

    for item in contacts:
        unified_data.append({
            "id": f"C-{item.id}",
            "type": "Contact",
            "name": item.name,
            "email": item.email or "-",
            "phone": item.phone,
            "details": item.message or "-",
            "created_at": item.created_at.isoformat() if item.created_at else None
        })

    # Group by date for the last 30 days for dot graph
    today = datetime.utcnow().date()
    # Initialize last 30 days
    chart_data_map = {}
    for i in range(29, -1, -1):
        day = (today - timedelta(days=i)).isoformat()
        chart_data_map[day] = {"date": day[-5:], "contacts": 0}

    for item in unified_data:
        if not item["created_at"]: continue
        day_iso = item["created_at"][:10]
        if day_iso in chart_data_map:
            chart_data_map[day_iso]["contacts"] += 1

    chart_data = list(chart_data_map.values())

    return {
        "table": unified_data,
        "chart": chart_data
    }
