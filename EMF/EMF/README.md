# EMF Fitness Platform

A high-performance, fully localized Content Management System (CMS) & Personal Training Application built to convert leads and manage client portfolios.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Vanilla CSS & Framer Motion, Zustand (Global State)
- **Backend**: FastAPI (Python 3.11), SQLAlchemy 2 (Async), Alembic (Migrations)
- **Database**: PostgreSQL (Relational Data), MinIO (S3-Compatible Media Object Storage)

---

## 📁 Project Structure

```text
EMF/
├── backend/                   # FastAPI Python Application
│   ├── alembic/               # Database Migration revisions
│   ├── core/                  # Environment variable parsing & configs
│   ├── database/              # SQLAlchemy Async Session maker
│   ├── models/                # PostgreSQL Entity mappings (Settings, Videos)
│   ├── routers/               # API Endpoints (GET/POST logic)
│   ├── main.py                # Server Entrypoint
│   └── requirements.txt       # Python dependencies
│
├── frontend/                  # Next.js Application
│   ├── app/                   # App Router (page.tsx, layout.tsx, globals.css)
│   ├── app/admin/             # Secure CMS Portal Gateway
│   ├── components/            # Reusable UI Blocks (Hero, Navbar, Footer)
│   ├── store/                 # Zustand Global Cache mapping (cmsStore.ts)
│   ├── public/                # Static assets (logo, fonts, placeholder PDFs)
│   ├── next.config.ts         # Remote Pattern configs for MinIO Images
│   └── package.json           # Node environment dependencies
│
├── docker-compose.yml         # Production multi-container pipeline
└── docker-compose.dev.yml     # Local development pipeline (hot-reloads)
```

---

## 🐋 Quick Start (Recommended: Docker)
The fastest way to boot the ecosystem natively without polluting your host machine:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```
> This boots the Frontend, Backend, Postgres, and MinIO storage in isolated synchronized containers.

---

## 💻 Local Setup Guide (Without Docker)
If you prefer running the application natively on your host machine to maintain direct control over debugging environments, follow this guide.

> [!WARNING]
> You must still provide a valid running **PostgreSQL** instance and a local **MinIO server** for the backend to function. We recommend spinning just the databases using docker: `docker compose -f docker-compose.dev.yml up -d postgres minio`.

### 1. Backend Setup (FastAPI)
You need Python 3.11 or greater.

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate.bat
# On macOS/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Run Database Migrations (Requires your .env file to be populated with DATABASE_URL)
alembic upgrade head

# Start the Server Live
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js)
You need Node.js 18 or greater. Open a new terminal.

```bash
cd frontend

# Install Node Modules
npm install

# Start the Development Server
npm run dev
```

### 3. Application Endpoints
Once running, you can access the localized endpoints:
* **Frontend Site**: `http://localhost:3000`
* **Secure Admin CMS**: `http://localhost:3000/admin` *(Unlock Pass: EMF2026)*
* **Backend API Docs**: `http://localhost:8000/docs`
* **MinIO Object Console**: `http://localhost:9001` *(User: minioadmin / Pass: minioadminpassword)*

## Environment Variables (.env)
Be sure both your `/frontend/.env` and `/backend/.env` files define their cross-boundary targets.
- The Frontend must possess: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- The Backend must possess: `DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/emf`
