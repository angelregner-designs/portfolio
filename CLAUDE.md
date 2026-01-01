# CLAUDE.md

## Project

**Summary:** Portfolio website for a designer with admin panel for content updates

It has 3 Sites

- Portfolio (angelregner.com)
  - NextJS client
  - served via cloud run with CDN front
  - intended for global audience

- Admin page (admin.angelregner.com)
  - NextJS client
  - client built with NextJS
  - requires login credentials
  - accepts edits to portfolio content
    - uses MongoDB to persist editable text
  - served via cloud run with CDN front

- API
  - Express server
  - MongoDB integration for data persistence
  - RESTful endpoints for content management
  - authentication and authorization
  - served via cloud run with CDN front

**Tech Stack:**
- Fullstack
  - TypeScript
  - Node.js
- Frontend
  - React
  - Tailwind CSS
  - Google Analytics 4
- Backend:
  - Express
  - Passport.js
  - Prisma for strongly typed Database structure
- Database
  - MongoDB
- DevOps
  - Docker
  - GitHub Actions
  - Terraform
- Infrastructure:
  - Cloud Run (container hosting)
  - MongoDB Atlas
  - Cloud Storage (photos)
  - Artifact Registry (Docker images)
  - Secret Manager (credentials)

---

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start containers
docker compose up --build

# 3. Seed database (first time only)
docker compose exec api npm run seed
```

**Default accounts:** `dev` / `admin` (password: see `DEFAULT_PASSWORD` in `.env`)

**URLs:**
- Portfolio: http://localhost:3000
- Admin: http://localhost:3002
- API: http://localhost:3001

```bash
# Stop containers
docker compose down

# Reset database (wipe data)
docker compose down && docker volume rm angel-portfolio_mongodb_data
```
