import asyncio
import os
import sys

# Ensure backend root is in PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.session import AsyncSessionLocal
from models.models import Review, Video, Setting
from models.transformation import Transformation
from sqlalchemy import select
from minio import Minio
from minio.commonconfig import CopySource

MINIO_URL = os.getenv("MINIO_URL", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadminpassword")
BUCKET_NAME = "emf-media"

minio_client = Minio(
    MINIO_URL,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

def move_object(url: str, folder: str) -> str:
    """Takes a local minio url and moves it to a subfolder"""
    if not url or "localhost:9000/emf-media/" not in url:
        return url
        
    filename = url.split("emf-media/")[-1]
    
    # Already in a folder? Skip.
    if "/" in filename:
        return url

    new_filename = f"{folder}/{filename}"
    new_url = f"http://localhost:9000/emf-media/{new_filename}"

    try:
        # Check if original exists
        minio_client.stat_object(BUCKET_NAME, filename)
        
        print(f"Moving {filename} -> {new_filename}")
        minio_client.copy_object(
            BUCKET_NAME,
            new_filename,
            CopySource(BUCKET_NAME, filename)
        )
        minio_client.remove_object(BUCKET_NAME, filename)
        return new_url
    except Exception as e:
        print(f"Skipping {filename}: {e}")
        return url

async def migrate_data():
    async with AsyncSessionLocal() as db:
        print("Migrating Transformations...")
        t_res = await db.execute(select(Transformation))
        for t in t_res.scalars().all():
            changed = False
            if t.before_image and "/transformations/" not in t.before_image:
                t.before_image = move_object(t.before_image, "transformations")
                changed = True
            if t.after_image and "/transformations/" not in t.after_image:
                t.after_image = move_object(t.after_image, "transformations")
                changed = True
            if t.video and "/transformations/" not in t.video:
                t.video = move_object(t.video, "transformations")
                changed = True
            if changed:
                db.add(t)

        print("Migrating Reviews...")
        r_res = await db.execute(select(Review))
        for r in r_res.scalars().all():
            if r.image_url and "/reviews/" not in r.image_url:
                r.image_url = move_object(r.image_url, "reviews")
                db.add(r)
                
        print("Migrating Settings (PDFs)...")
        s_res = await db.execute(select(Setting).where(Setting.key == "diet_pdf_url"))
        for s in s_res.scalars().all():
            if s.value and "/pdfs/" not in s.value:
                s.value = move_object(s.value, "pdfs")
                db.add(s)

        await db.commit()
        print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(migrate_data())
