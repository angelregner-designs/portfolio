# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**What:** Portfolio website for a designer with easy content updates via admin panel

---

**Tech Stack:**

**Frontend:**
- React
- Deployed to Cloud Storage + Cloud CDN

**Backend:**
- Apollo GraphQL Server (TypeScript, Node.js)
- Dockerized, deployed to Cloud Run

**Database:**
- PostgreSQL (Cloud SQL)

**Infrastructure (GCP):**
- Cloud Run (container hosting)
- Cloud SQL (managed PostgreSQL)
- Cloud Storage + CDN (static files)
- Cloud Load Balancing (routing)
- Artifact Registry (Docker images)
- Secret Manager (credentials)

**DevOps:**
- Terraform (IaC)
- GitHub Actions (CI/CD)
- Docker (containerization)

**Analytics:**
- Google Analytics 4 (free)

**Repository:**
- Public GitHub repo (secrets in environment variables)

---

**Estimated Cost:** ~$10-20/month on GCP

---

## Development Commands

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Development server (without Docker)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Lint and fix
npm run lint:fix

# Format
npm run format
```

### Docker Development (preferred)

```bash
# Start frontend in Docker
docker compose up

# Rebuild container
docker compose up --build

# Stop
docker compose down
```

## Code Style

- Prefer arrow functions over function declarations
- Prefer implicit returns: `() => x` over `() => { return x }`
- No semicolons
- Style with Tailwind CSS (utility classes)
- Componentize by page sections (Hero, Portfolio, About, etc)
- Extract reusable UI (Button, Card, etc) to `src/components/ui/`

## Design Implementation

- **Always match designs exactly** - fonts, spacing, sizing, colors, layout
- When given design images, study them carefully before coding
- Use pixel-accurate spacing and sizing where possible
- Match typography exactly (font family, weight, size, line-height, letter-spacing)

## Architecture

```
frontend/
  src/
    app/            # App Router pages
    components/
      sections/     # Page sections (Hero, Portfolio, About, etc)
      ui/           # Reusable UI components (Button, Card, etc)
```
