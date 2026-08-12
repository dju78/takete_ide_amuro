# Takete-Ide Amuro

The official digital platform for Takete-Ide Amuro, Mopamuro Local Government Area, Kogi State,
Nigeria — a community information site, cultural and historical archive, Takete-Ide Day archive,
development transparency dashboard, diaspora-engagement platform, and a dedicated Families & Oríkì
heritage-preservation feature.

**Heritage • Unity • Progress**

## Overview

- **Public site**: homepage, Our Story, Heritage, Traditional Institution, Takete-Ide Day (+ yearly
  archive), Development, Our People, News, Gallery, Weather, Diaspora, Digital Archive, Voices of
  Takete-Ide (oral history), TIPU, Families & Oríkì, Get Involved, Contact, legal pages.
- **Admin portal** (`/admin`): role-based CMS covering all of the above.
- **Weather**: live AccuWeather integration for Takete-Ide, with a graceful fallback.
- **Families & Oríkì**: a purpose-built lineage/praise-poetry archive with community submission and
  review workflows.

See `docs/PROJECT_AUDIT.md` for what was supplied and what was built, and `docs/DECISIONS.md` for
every judgement call made along the way.

## Prerequisites

- Node.js 20+
- npm
- A Supabase project (optional for browsing the UI locally — the site runs with empty states if unset)

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in Supabase credentials to see live data
npm run dev
```

Visit `http://localhost:3000`. Every page renders with honest empty states even with zero
environment variables set.

## Environment Variables

See `.env.example` for the full list, each documented as required/optional. Nothing is required for
`npm run build` to succeed.

## Database & Storage Setup

See `docs/DATABASE.md` and `docs/DEPLOYMENT.md`.

## Creating the First Administrator

See `docs/ADMIN_GUIDE.md`.

## Testing

```bash
npm run lint
npm run typecheck
npm test        # Playwright smoke suite
npm run build
```

## Deployment

See `docs/DEPLOYMENT.md` (target: Vercel).

## Documentation Index

| Doc | Covers |
|---|---|
| `docs/PROJECT_AUDIT.md` | What was supplied vs. built |
| `docs/DECISIONS.md` | Every assumption/decision made |
| `docs/ARCHITECTURE.md` | Folder structure, data flow, provider abstractions |
| `docs/DATABASE.md` | Migrations, RLS model, types |
| `docs/ADMIN_GUIDE.md` | Roles, first-admin setup, CRUD scope, extending it |
| `docs/CONTENT_GUIDE.md` | Editorial workflow, writing news, historical content rules |
| `docs/HISTORICAL_VERIFICATION.md` | Verification statuses and how they're enforced |
| `docs/WEATHER_INTEGRATION.md` | Provider, caching, fallback, changing providers |
| `docs/SECURITY.md` | Auth, RLS, validation, secrets, known gaps |
| `docs/DEPLOYMENT.md` | Step-by-step Supabase + Vercel deployment |

## Troubleshooting

- **Every page shows empty states**: Supabase env vars aren't set — check `.env.local`.
- **`/admin` redirects to login immediately after signing in**: your Supabase Auth user has no
  matching `profiles` row with sufficient role — see `docs/ADMIN_GUIDE.md`.
- **Weather section shows "temporarily unavailable"**: `ACCUWEATHER_API_KEY` isn't set, or the
  AccuWeather API call failed — this is expected, graceful behaviour, not a bug (see
  `docs/WEATHER_INTEGRATION.md`).
