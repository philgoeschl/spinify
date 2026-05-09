# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Spinify is a mobile-first vinyl record collection tracker built with Next.js 16 / TypeScript, deployed on Vercel or via Docker Compose.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript, `src/` layout)
- **Auth**: NextAuth.js v5 (credentials provider, JWT sessions)
- **Database**: PostgreSQL 16 via Prisma 7 ORM + `@prisma/adapter-pg`
- **UI**: shadcn/ui + TailwindCSS v4 + lucide-react
- **Data fetching**: SWR (client), direct Prisma (server components)
- **Forms**: react-hook-form + Zod v4
- **Tests**: Vitest + @testing-library/react

## Commands

```bash
npm install                          # Install dependencies
npm run dev                          # Start development server (port 3000)
npm run build                        # Production build
npm run lint                         # Run ESLint
npm run test                         # Run unit tests
npm run test:watch                   # Watch mode tests

npx prisma migrate dev --name <name> # Create and apply migration
npx prisma db seed                   # Seed with 20 sample vinyls
npx prisma studio                    # Open DB browser (requires DB connection)
npx prisma generate                  # Regenerate client after schema changes
```

## Docker

```bash
# Development (hot reload, seeded DB)
docker compose -f docker-compose.dev.yml up --build

# Production
docker compose up --build
```

Dev quickstart: app at http://localhost:3000, login with `test@spinify.dev` / `password123`

## Environment Variables

Required in `.env` (see `.env.example`):
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret (generate: `openssl rand -base64 32`)
- `AUTH_URL` — App URL (e.g. `http://localhost:3000`)

## Key Directories

```
src/
├── app/
│   ├── (auth)/         # login, register pages
│   ├── (app)/          # authenticated pages (dashboard, collection, vinyl detail, import)
│   └── api/            # API routes (vinyls, auth, dashboard, play-logs)
├── components/
│   ├── vinyl/          # VinylCard, VinylSlider, VinylForm, PlayButton, VinylDisc
│   ├── layout/         # Navbar (desktop), BottomNav (mobile), Providers
│   └── shared/         # EmptyState, LoadingSkeleton
├── hooks/              # useVinyls (SWR + localStorage cache), useDashboard
├── lib/                # db.ts, auth.ts, hash.ts, suggestion.ts, vinyl-cache.ts
├── schemas/            # Zod schemas for vinyl and auth
└── types/              # Shared TypeScript interfaces
prisma/
├── schema.prisma       # User, Vinyl, PlayLog models
└── seed.ts             # 20 sample vinyls + test user
```

## Architecture Notes

- **Prisma v7**: Uses new `provider = "prisma-client"` generator with output to `src/generated/prisma/`. Import as `@/generated/prisma/client`. Requires `@prisma/adapter-pg` driver adapter.
- **Auth split**: `auth.config.ts` is edge-safe (no Prisma, used in middleware). `auth.ts` adds the Credentials provider with Prisma.
- **LocalStorage cache**: `useVinyls` sends the cached SHA-256 hash as `?hash=` query param. Server returns `{ unchanged: true }` if nothing changed.
- **Suggestion algorithm**: `src/lib/suggestion.ts` — deterministic daily picks using djb2 hash seed + mulberry32 PRNG + Fisher-Yates shuffle. Same user + date always returns the same vinyls.
- **CSV import**: `POST /api/vinyls/import` merges by artist+album+year (case-insensitive). Only adds missing play dates — never overrides existing data. Fully idempotent.
- **Zod v4**: Use `.issues` not `.errors` on `ZodError`. `invalid_type_error` is not a valid field — use `.number()` without it.
