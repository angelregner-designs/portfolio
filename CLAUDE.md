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

**GCP Config:**
- Project ID: `angelregnerportfolio`
- Region: `us-central1`

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

**Local URLs:**
- Portfolio: http://localhost:3000
- Admin:     http://localhost:3002
- API:       http://localhost:3001

---

## Deployed URLs

**Production:**
- Portfolio: https://angelregner.com
- Admin:     https://admin.angelregner.com
- API:       https://api.angelregner.com

**Dev Environment:**
- Portfolio: https://dev.angelregner.com
- Admin:     https://admin.dev.angelregner.com
- API:       https://api.dev.angelregner.com

> Note: Multi-level subdomains use `service.env.domain` pattern (e.g., `admin.dev.angelregner.com`), NOT `service-env.domain` (e.g., NOT `admin-dev.angelregner.com`)

---

## Checking Deployed Versions

**Current version:**
```bash
# Dev
curl -s https://api.dev.angelregner.com/version | jq .

# Prod
curl -s https://api.angelregner.com/version | jq .

# Or check browser console on any frontend site
```

**Deployment history:**
```bash
# Recent deploys to dev
gh run list --workflow=cd-dev.yml --limit 10

# Recent deploys to prod
gh run list --workflow=cd-prod.yml --limit 10
```

**Git history (commits that triggered deploys):**
```bash
git log develop --oneline -15  # dev
git log main --oneline -15     # prod
```

```bash
# Stop containers
docker compose down

# Reset database (wipe data)
docker compose down && docker volume rm angel-portfolio_mongodb_data
```
