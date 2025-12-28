# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**What:** Portfolio website for a designer with admin panel for content updates

**Tech Stack:**
- Frontend: Next.js, React, Tailwind CSS, TypeScript
- Backend: Apollo GraphQL, Node.js, TypeScript
- Database: PostgreSQL
- Infrastructure: 
  - Cloud Run (container hosting)
  - Cloud SQL (managed PostgreSQL)
  - Cloud Storage + CDN (static files)
  - Cloud Load Balancing (routing)
  - Artifact Registry (Docker images)
  - Secret Manager (credentials)
- DevOps: Docker, Terraform, GitHub Actions

---

## Quick Start

### Environment Setup

### Development

```bash
# Start in Docker
docker compose up

# Rebuild container
docker compose up --build

# Stop
docker compose down
```

---

## Code Style

**General:**
- Prefer arrow functions over function declarations
- Implicit returns where possible
- No semicolons
- Comment non-obvious lines or blocks of code for clarity

**TypeScript:**
- Strict mode enabled
- Avoid `any` - use `unknown` or proper types
- Prefer `interface` for object shapes, `type` for unions/aliases

**React/Next.js:**
- Tailwind for styling (utility classes)
- Components by page section: `components/sections/`
- Reusable UI: `components/ui/`

**Architecture:**
- Loosely prefer FP over OOP, unless it sacrifices clarity and simplicity
  - Favor immutable data and pure functions
  - Favor function composition
  - Avoid unnecessary classes or deep inheritance hierarchies. Use OOP only when it naturally fits the problem (e.g., modeling real-world entities with behavior)
- Keep components small, single-responsibility

---

## Design Implementation

When implementing from designs/mockups:
1. Study design and pay attention to details: typography, colors, spacing, layout, shadows, borders etc
2. Strive for pixel-perfect quality

---

## Git Workflow

**Deployment:**
- Staging: PR from `develop` → `staging` (no direct push)

---

## Project Structure
```
frontend/
  src/
    app/            # Next.js App Router pages
    components/
      sections/     # Hero, Portfolio, About, etc
      ui/           # Button, Card, etc
```
