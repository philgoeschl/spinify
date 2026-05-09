# Spinify

A mobile-first vinyl record collection tracker. Log your records, track plays, and get daily listening suggestions.

## Features

- **Collection management** — add, edit, and browse your vinyl records
- **Play logging** — track every listen with timestamps
- **Daily suggestions** — deterministic daily picks from your collection
- **CSV import** — bulk-import records; idempotent merge by artist + album + year
- **User auth** — credentials-based login with JWT sessions
- **Admin panel** — user management for admins

## Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Auth**: NextAuth.js v5 — credentials provider, JWT sessions
- **Database**: PostgreSQL 16 via Prisma 7 + `@prisma/adapter-pg`
- **UI**: shadcn/ui + TailwindCSS v4 + lucide-react
- **Forms**: react-hook-form + Zod v4
- **Data fetching**: SWR (client) + direct Prisma (server components)
- **Tests**: Vitest + @testing-library/react

## Dev Setup

### Option A — Docker (recommended)

```bash
docker compose -f docker-compose.dev.yml up --build
```

App runs at http://localhost:3000 with hot reload and a pre-seeded database.

Login: `test@spinify.dev` / `password123`

### Option B — Local

**Prerequisites**: Node.js 20+, PostgreSQL 16

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy and fill in environment variables:
   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `DATABASE_URL` | PostgreSQL connection string |
   | `AUTH_SECRET` | NextAuth secret — generate: `openssl rand -base64 32` |
   | `AUTH_URL` | App URL, e.g. `http://localhost:3000` |

3. Run migrations and seed:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

App at http://localhost:3000 — login with `test@spinify.dev` / `password123`

## Commands

```bash
npm run dev           # Dev server (port 3000)
npm run build         # Production build
npm run lint          # ESLint
npm run test          # Unit tests
npm run test:watch    # Watch mode

npx prisma migrate dev --name <name>  # Create and apply migration
npx prisma db seed                    # Seed 20 sample vinyls + test user
npx prisma studio                     # DB browser
npx prisma generate                   # Regenerate client after schema changes
```

## Production (Docker)

```bash
cp .env.example .env  # fill in DATABASE_URL, AUTH_SECRET, AUTH_URL, POSTGRES_PASSWORD
docker compose up --build
```

## License

MIT
