# Architecture

## Stack

- **Framework**: Next.js 16 (App Router, React Server Components by default)
- **Language**: TypeScript, strict mode
- **Styling**: Tailwind CSS v4 (CSS-based `@theme`, no `tailwind.config.js`)
- **Database / Auth / Storage**: Supabase (Postgres, Supabase Auth, Supabase Storage)
- **Validation**: Zod, used server-side in every Server Action
- **Deployment target**: Vercel

## Folder Structure

```
app/                    Routes (App Router). Route groups: admin/(dashboard) is the
                        authenticated shell; admin/login sits outside it.
components/
  ui/                   Design-system primitives (Button, Badge, Container, EmptyState…)
  layout/               Header, Footer, MobileNav, Logo, AnnouncementBanner
  cards/                NewsCard, ProjectCard, PersonCard, GalleryCard, ArchiveCard, IconCard
  forms/                Reusable form fields + all public-facing forms
  heritage/             SourcedSection, ResearchDisclaimer, AudioPlayer (Our Story/Families/Oríkì)
  weather/              WeatherCard, EventWeather, HeaderWeatherIndicator, attribution, fallback
  gallery/               Lightbox + filters
  admin/                Admin-only chrome and form components
lib/
  supabase/             Browser / server / middleware Supabase clients
  data/                 Read-only data-access functions per domain (news.ts, projects.ts, …) —
                        every function returns [] / null gracefully if Supabase isn't configured
  actions/              Server Actions (mutations): submissions, admin-news, admin-settings,
                        admin-users, admin-inbox, auth
  weather/               Provider abstraction (WeatherProvider), AccuWeatherProvider, mapper, icons
  site-config.ts        Navigation structure, brand copy
  env.ts                Central "is X configured" flags — nothing else reads process.env directly
  validations.ts        Zod schemas for every public form
  auth.ts               requireStaff() — the one auth gate every admin page/layout calls
types/                  Domain types decoupled from Supabase's generated types (see docs/DATABASE.md)
supabase/
  migrations/           Numbered SQL migrations — schema, RLS, storage buckets
  seed/                 Safe, non-fabricated seed data (taxonomies only)
```

## Data Flow

Public pages are Server Components that call `lib/data/*.ts` functions, which call
`lib/supabase/server.ts`'s `createClient()`. That function returns `null` when
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` aren't set, and every `lib/data/*`
function short-circuits to an empty result in that case — this is *why* the site builds and runs
with zero configuration: every page falls through to its `<EmptyState />`.

Mutations (forms, admin edits) are Server Actions in `lib/actions/*.ts`, using
`useActionState` on the client and Zod validation + Supabase writes on the server. Admin actions
additionally call `requireStaff(minRole)` and `logAudit()`.

## Provider Abstractions

Two things are deliberately decoupled from their current vendor so they can be swapped without
touching the UI:

- **Weather** (`types/weather.ts` → `WeatherProvider` interface, implemented by
  `lib/weather/accuweather-provider.ts`). Swapping providers means writing one new class.
- **Storage**: content tables store plain public URLs from Supabase Storage buckets
  (`supabase/migrations/0010_storage_buckets.sql`). Moving to Cloudinary/S3 later means changing
  where those URLs come from, not the schema or the UI.

## Rendering Strategy

Almost everything is a Server Component fetching directly from Supabase at request time (Next's
data cache + Supabase's own indexing keep this fast for a civic site's traffic profile). The weather
feature explicitly opts into a 30-minute `revalidate` window since AccuWeather API quota matters and
conditions don't change minute-to-minute. Client Components are used only where interaction is
required: the mobile nav, the gallery lightbox, all forms, and admin status-select controls.
