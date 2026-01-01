# CLAUDE.md

## Project

**Summary:** Portfolio website for a designer with admin panel for content updates

It has 3 Sites

- Portfolio (angelregner.com)
  - NextJS client
  - served via cloud run with CDN front

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

---

## Code Style

**Frontend**
- Apply SRP to components (single responsibility principle)
  - When there's a big chunk of 1 coherent set of functionality or compnent within a component or another function, extract it into a separate utility or hook to keep functions and components focused and readable.
- Keep components small and focused
- Use tailwind for styling. Use CSS variables and theming according to Figma design.
- use classnames lib for conditional class handling
- Use Figma MCP when applying design from figma. Always aim for pixel perfect replication of Figma design.
- Always put the main component/function first, put anything else (functions, hooks, components, etc.) after if possible
- Move SVG elements to their own components

**Animations**
- Use Framer Motion for complex animations beyond simple transition from A to B
- When using framer motion, add descriptive comment about what we are trying to achieve

**General**
- Prefer arrow functions over function declarations
- Implicit returns where possible
- No semicolons
- Comment non-obvious lines or blocks of code for clarity

**TypeScript:**
- Strict mode enabled
- Avoid `any` - use `unknown` or proper types
- Prefer `type` for object shapes, unions, aliases
- When writing objects to be passed to library functions and components, use type annotation from that library if any

**Architecture:**
- Loosely prefer FP over OOP, unless it sacrifices clarity and simplicity
  - Favor immutable data and pure functions
  - Favor function composition
  - Avoid unnecessary classes or deep inheritance hierarchies. Use OOP only when it naturally fits the problem (e.g., modeling real-world entities with behavior)
- Keep components small, single-responsibility

**Packages**
- when doing npm install
  - ALWAYS do it in corresponding both docker container IF running
  - ALWAYS do it in host machine
  - ALWAYS do it in storybook container IF installed to portfolio app
  - ALWAYS restart windsurf's typescript server

**Storybook**
- do not define title property, let storybook infer

**Infrastructure**
- Use terraform with modules for infrastructure as code
- Use gcp for infrastructure
- Add descriptive comments to terraform code that is best for developers with little to no knowledge of terraform but is looking to learn terraform

**Database**
- ALWAYS ask for permission before resetting the database

---

## Git Workflow

**Deployment:**
- Staging: PR from `develop` → `staging` (no direct push)

---

## MCP Servers

- Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.
