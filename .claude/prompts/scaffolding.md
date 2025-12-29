Create a multi phase steps to create scaffolding for this app for local environment.

Requirements:
- portfolio
    - display title from the API
    - do not implement any static site generation for local
- admin
    - edit portfolio page title
- API
    - `GET /portfolio-page`
    - `POST /portfolio-page`, requires authentication
    - `GET /user` returns autheticated user data
    - `POST /login`
    - `POST /logout`
    - use Prisma for strong typing
    - use Passport.js for authentication
    - simplify `type PortfolioPage = { title: string }` for scaffolding - just focus on the basic structure
- run entire application stack locally with docker compose, including mongodb
- hot-reloading for all services
