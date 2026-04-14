from fastapi import APIRouter, UploadFile, File, HTTPException
from minio import Minio
from minio.error import S3Error
import uuid
import os

router = APIRouter()

# Initialize MinIO Client connecting to the dev container
# We use minio:9000 since docker compose networking resolves 'minio'
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

# Ensure Bucket exists and has public read policy
def ensure_bucket():
    try:
        if not minio_client.bucket_exists(BUCKET_NAME):
            minio_client.make_bucket(BUCKET_NAME)
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": ["*"]},
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{BUCKET_NAME}/*"],
                    }
                ],
            }
            import json
            minio_client.set_bucket_policy(BUCKET_NAME, json.dumps(policy))
    except S3Error as e:
        print(f"MinIO bucket error: {e}")

try:
    ensure_bucket()
except Exception:
    pass

@router.post("/")
async def upload_file(file: UploadFile = File(...), folder: str = ""):
    try:
        # Generate unique filename to prevent overrides
        extension = file.filename.split(".")[-1] if "." in file.filename else ""
        unique_name = f"{uuid.uuid4().hex}.{extension}"
        
        # Apply folder prefix
        object_name = f"{folder.strip('/')}/{unique_name}" if folder else unique_name

        # Determine content type
        content_type = file.content_type if file.content_type else "application/octet-stream"

        # To handle SpooledTemporaryFile correctly for Minio put_object:
        file.file.seek(0, os.SEEK_END)
        size = file.file.tell()
        file.file.seek(0)
        
        minio_client.put_object(
            BUCKET_NAME,
            object_name,
            file.file,
            length=size,
            content_type=content_type
        )
        
        return {"url": f"http://localhost:9000/{BUCKET_NAME}/{object_name}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
