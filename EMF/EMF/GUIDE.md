# Platform Modification & User Guide

Welcome to the internal guide for EMF Fitness. This document explains how you can quickly modify the application text, swap colors, and manage the infrastructure!

## 1. Using the Admin CMS (No-Code Changes)
The vast majority of the site's text is now dynamically piped through your database. Instead of touching code, simply go to:
**`http://localhost:3000/admin` (Password: `EMF2026`)**

- **Media & Reviews**: Use this tab to post videos. The system natively parses Youtube links and extracts the cover thumbnails directly.
- **Transformations**: Upload Before and After images. Next.js handles scaling them identically (`object-fit: contain`).
- **Site Settings**: Upload your Diet PDFs here, update your Instagram Handle, alter the Founder's name, or modify the stat counters that appear underneath the Hero!

## 2. Changing Colors & Aesthetics (Code Changes)
The platform was built primarily utilizing an agnostic CSS configuration to enforce site-wide uniformity.

**Global CSS Variables:**
Open `frontend/app/globals.css`.
Here you will find native tokens specifying the "Orange" pop color and the background logic.

```css
/* Globals.css */
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #e8450a; /* The deep EMF Orange */
}
```
If you wish to change the entire site from Orange to Deep Blue, simply modify `#e8450a` into your desired hex color throughout `globals.css` and perform a basic Search & Replace in your IDE.

## 3. Changing Structure (Components)
* **Navbar & Footer**: Located in `frontend/components/Navbar.tsx` & `Footer.tsx`.
* **Lead Magnet**: Located in `frontend/components/LeadMagnet.tsx`. This maps to the MinIO Database link you define in the Admin CMS.
* **Services Provided**: Located in `frontend/components/Services.tsx`. The icons and text load from the `Settings` Postgres database asynchronously cleanly preventing layout shifts via `Zustand`.

## 4. Troubleshooting
If the Next.js cache ever breaks locally or a package fails to install after you add an import:
```bash
docker compose -f docker-compose.dev.yml up -d --renew-anon-volumes frontend
```
This physically destroys the Next TurboPack cache forcing a pristine recompile.
