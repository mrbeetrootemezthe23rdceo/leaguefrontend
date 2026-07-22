# League Analytics Platform

A League of Legends analytics platform: a Python crawler (WSL) ingests match data from Riot's API into a Supabase Postgres database. The frontend is Next.js + shadcn/ui (React 19, TypeScript), querying Postgres directly via raw `pg` Pool calls — no ORM. Business logic is separated out into tested modules, with Vitest covering pure logic and mocked-Pool queries. GitHub Actions runs the test suite on every push/PR to `main`. Deployed on Vercel.

## Live demo https://leaguefrontend.vercel.app/

Sister project(ingestion pipeline): https://github.com/mrbeetrootemezthe23rdceo/leaguepipeline

## Tech stack

- **Frontend**: Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind
- **Backend/data access**: raw `pg` Pool queries (no ORM)
- **Database**: PostgreSQL (Supabase)
- **Data ingestion**: Python crawler (WSL), Riot API
- **Testing**: Vitest (pure logic + mocked-Pool queries)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Architecture

```
Riot API → Python crawler (WSL) → Supabase Postgres ← raw pg Pool ← Next.js app → Vercel
```

Business logic lives outside route handlers and components, in tested modules:

- `src/lib/transforms.ts` — pure data-shaping functions (e.g. `shapeMatchesByMonth`, `findMostActiveMonth`)
- `src/lib/queries/leaderboard.ts` — SQL query functions (e.g. `fetchLeaderboard`), tested against a mocked Pool

**Why raw `pg` instead of an ORM?** I wanted full visibility into the SQL actually hitting the database, rather than trusting an abstraction layer to write it for me. The trade-off is more boilerplate and no compile-time query safety — a fair one for a portfolio project meant to demonstrate SQL fluency directly.

## Getting started

### Prerequisites

- Node.js (version)
- Python (version) — for the crawler
- A Supabase project (or any Postgres instance)
- A Riot Games API key

### Environment variables

Create a `.env.local` in the frontend root:

```
DATABASE_URL=<your-supabase-connection-string>
```

Create a `.env` for the crawler:

```
RIOT_API_KEY=<your-riot-api-key>
DATABASE_URL=<your-supabase-connection-string>
```

### Running the frontend

```bash
npm install
npm run dev
```

### Running the crawler

```bash
# from the crawler directory
pip install -r requirements.txt
python crawler.py
```

## Testing

```bash
npm run test
```

Currently covers pure logic (`transforms.ts`) and query functions against a mocked Pool. Component rendering tests and a real Postgres integration test in CI are deferred — see Roadmap.

## Roadmap / known limitations

- [ ] Real Postgres integration test in CI (currently mocked-Pool only)
- [ ] Component rendering tests (blocked on a Babel/Rolldown peer-dependency conflict between `@testing-library/react` and shadcn's dependency tree)
