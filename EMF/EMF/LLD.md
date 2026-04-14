# EMF Fitness: Low-Level Design (LLD)

## 1. Database Schema (PostgreSQL)

The Relational Schema isolates the entities mapped via SQLAlchemy ORMs.

```mermaid
erDiagram
    users_leads {
        int id PK
        string name
        string email
        string goal
        datetime created_at
    }
    bookings {
        int id PK
        string name
        string phone
        string email
        string preferred_time
    }
    reviews {
        int id PK
        string name
        int rating
        text comment
        string image_url
    }
    videos {
        int id PK
        string title
        string platform
        string url
        string thumbnail
    }
    settings {
        int id PK
        string key "UNIQUE INDEX"
        text value
    }
    transformations {
        int id PK
        string name
        string result
        string before_image
        string after_image
        string video
    }
```

## 2. Admin Media Processing Workflow

When an Administrator uploads a transformation photo through the CMS, a dual-pipeline strategy resolves the object storage securely.

```mermaid
sequenceDiagram
    participant Admin
    participant NextJS
    participant UploadRouter
    participant MinIO
    participant DBRouter
    participant Postgres

    Note over Admin, Postgres: File Transformation Upload Event
    Admin->>NextJS: Selects 'Before' Photo & Clicks Post
    NextJS->>UploadRouter: POST /upload (FormData)
    UploadRouter->>MinIO: File buffer streamed directly (put_object)
    MinIO-->>UploadRouter: Success (uuid mapping)
    UploadRouter-->>NextJS: Returns "http://localhost:9000/emf-media/UUID.jpg"
    NextJS->>DBRouter: POST /transformations (JSON Body with MinIO Image URL)
    DBRouter->>Postgres: INSERT INTO transformations
    Postgres-->>DBRouter: Commits mapping
    DBRouter-->>NextJS: Returns 200 OK
    NextJS-->>Admin: Updates UI Matrix
```

## 3. Frontend Component Topologies

### Global Store
* `store/cmsStore.ts`: Leverages `Zustand`. Holds the `settings` Record object. Orchestrates data deduplication.

### Core Architecture Components
1. **CMSLoader.tsx**: An invisible component attached into `page.tsx` solely to trigger the global hook async execution natively outside of Server Components constraint.
2. **Transformations.tsx**: Intercepts `objectFit` parameters allowing NextJS Native Image engines to dynamically restrict box-sizing natively mapping to `100vw`.
3. **admin/page.tsx**: Refactored strictly into a massive ternary-operator based Tabbed UI interface protecting API execution behind the `EMF2026` React State memory boundary.

### Native APIs Exposed
* `GET /transformations`: Resolves array of Transformation entries.
* `POST /transformations`: Secure object generation.
* `GET /settings`: Yields exact layout KV strings natively digested by the frontend store.
* `POST /settings`: Aggressive loop upsert mechanism for global application layouts.
