# CLAUDE.md

## Project

**Summary:** Portfolio website for a designer with admin panel for content updates

It has 3 Sites

- Portfolio (angelregner.com)
  - client statically generated with NextJS
  - served through CDN for global speed

- Admin page (admin.angelregner.com)
  - client built with NextJS
  - requires login credentials
  - accepts edits to portfolio content
    - uses MongoDB to persist editable text
    - when edit is published, calls GitHub API to retrigger static generation and deployment of portfolio
  - built with NextJS
  - deployed via container and cloudrun

- API
  - RESTful endpoints for content management
  - authentication and authorization
  - MongoDB integration for data persistence

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
  - Cloud Storage + CDN (static files)
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

---

## Code Style

**Frontend**
- Apply SRP to components (single responsibility principle)
  - When there's a big chunk of 1 coherent set of functionality or compnent within a component or another function, extract it into a separate utility or hook to keep functions and components focused and readable.
- Keep components small and focused
- Use tailwind for styling
- use classnames lib for conditional class handling
- Use Figma MCP when applying design from figma. Always aim for pixel perfect replication of Figma design.

**General**
- Prefer arrow functions over function declarations
- Implicit returns where possible
- No semicolons
- Comment non-obvious lines or blocks of code for clarity

**TypeScript:**
- Strict mode enabled
- Avoid `any` - use `unknown` or proper types
- Prefer `interface` for object shapes, `type` for unions/aliases

**Architecture:**
- Loosely prefer FP over OOP, unless it sacrifices clarity and simplicity
  - Favor immutable data and pure functions
  - Favor function composition
  - Avoid unnecessary classes or deep inheritance hierarchies. Use OOP only when it naturally fits the problem (e.g., modeling real-world entities with behavior)
- Keep components small, single-responsibility

**Development**
- when doing npm install, do it in both docker container then on the host machine

---

## Git Workflow

**Deployment:**
- Staging: PR from `develop` → `staging` (no direct push)

---

## MCP Servers

- Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.
