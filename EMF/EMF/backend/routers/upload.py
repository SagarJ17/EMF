from fastapi import APIRouter, UploadFile, File, HTTPException
from minio import Minio
from minio.error import S3Error
import uuid
import os
import tempfile
import ffmpeg
from PIL import Image
from io import BytesIO

router = APIRouter()

# Initialize MinIO Client connecting to the dev container
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
        content_type = file.content_type if file.content_type else "application/octet-stream"
        file.file.seek(0)
        
        # Determine payload
        if content_type.startswith("image/"):
            img = Image.open(file.file)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.thumbnail((1280, 1280)) # Resize to max 1280px via Aspect Ratio
            
            out_io = BytesIO()
            img.save(out_io, format="WEBP", quality=80)
            out_io.seek(0)
            
            size = out_io.getbuffer().nbytes
            file_obj = out_io
            unique_name = f"{uuid.uuid4().hex}.webp"
            content_type = "image/webp"

        elif content_type.startswith("video/"):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_in, \
                 tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_out:
                
                content = file.file.read()
                temp_in.write(content)
                temp_in.flush()
                temp_in.close()

                # Compress and scale to 720p height
                try:
                    (
                        ffmpeg
                        .input(temp_in.name)
                        .output(temp_out.name, vcodec='libx264', crf=28, preset='fast', vf='scale=-2:720')
                        .overwrite_output()
                        .run(quiet=True)
                    )
                    
                    with open(temp_out.name, 'rb') as f:
                        final_data = f.read()
                        
                    out_io = BytesIO(final_data)
                    size = len(final_data)
                    file_obj = out_io
                    unique_name = f"{uuid.uuid4().hex}.mp4"
                    content_type = "video/mp4"
                finally:
                    if os.path.exists(temp_in.name): os.unlink(temp_in.name)
                    if os.path.exists(temp_out.name): os.unlink(temp_out.name)

        else:
            # Fallback EXCLUSIVELY for PDFs
            extension = file.filename.split(".")[-1].lower() if "." in file.filename else ""
            if extension != "pdf":
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {extension}")
            
            file.file.seek(0, os.SEEK_END)
            size = file.file.tell()
            if size > 15 * 1024 * 1024:
                raise HTTPException(status_code=413, detail="PDF File too large (max 15MB)")
            file.file.seek(0)
            file_obj = file.file
            unique_name = f"{uuid.uuid4().hex}.pdf"

        # Apply folder prefix
        object_name = f"{folder.strip('/')}/{unique_name}" if folder else unique_name

        minio_client.put_object(
            BUCKET_NAME,
            object_name,
            file_obj,
            length=size,
            content_type=content_type
        )
        
        return {"url": f"http://localhost:9000/{BUCKET_NAME}/{object_name}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
