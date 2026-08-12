# Decisions Log

This document records every professional judgement call made while building this site where the
brief left a choice open, per the "do not stop to ask questions" instruction. Each entry states the
decision and the reasoning.

## Technology & Architecture

- **Stack**: Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Supabase
  (Postgres + Auth + Storage), npm, deployed to Vercel. This matches the brief's preferred stack and
  is the strongest current option for a content-heavy, SEO-sensitive, form-driven civic site.
- **Package name**: `taketeide-amuro` — `create-next-app` rejects the literal folder name "Takete
  Ide" (capitals, spaces are invalid npm package names).
- **Content editor**: Markdown (rendered via `react-markdown` + `remark-gfm`) rather than a rich
  WYSIWYG/raw-HTML editor for news bodies. This satisfies "avoid insecure raw HTML" directly — no
  HTML sanitizer is needed because HTML is never stored or rendered from user input.
- **Provider abstraction for Storage**: buckets are created in `supabase/migrations/0010_storage_buckets.sql`
  and referenced by URL from content tables. A `lib/storage.ts` abstraction (to formalise
  swapping to Cloudinary/S3 later) is a documented next step — v1 stores/returns public Storage
  URLs directly, since no second storage provider is configured today.
- **Analytics**: architecture left as environment-variable placeholders only
  (`NEXT_PUBLIC_ANALYTICS_PROVIDER` / `_ID`, commented out in `.env.example`). Nothing is wired to a
  provider, so no cookie consent banner is shown — see "Cookies" below.
- **Cookie consent**: no banner is implemented. The brief explicitly warns against a "fake cookie
  banner that does nothing" — since no non-essential cookies are set (only the Supabase auth
  session, which is strictly necessary), a banner would have nothing to gate. `/cookies` explains
  this and documents the trigger for adding a real, technology-controlling banner once analytics are
  enabled.

## Brand & Design

- **Site logo**: a custom abstract purple/gold mark (`components/layout/Logo.tsx`), not the supplied
  TIPU emblem. The brief explicitly says not to use the TIPU emblem as the whole-site logo unless
  documentation authorises it — it wasn't, so TIPU's emblem is used only on `/tipu`.
- **Two mottos preserved distinctly**: the site-wide tagline is "Heritage • Unity • Progress" (per
  the brief's positioning), while TIPU's own motto "Faith, Unity and Progress" (read directly off the
  supplied emblem image) is used only within the `/tipu` page, since TIPU ≠ the whole community.
- **Typography**: Playfair Display (serif, heritage headings) + Inter (sans, body/UI), loaded via
  `next/font/google` for zero layout shift and no external font requests.
- **Navigation**: primary bar (Home, Our Story, Heritage, Takete-Ide Day, Development, News, Gallery,
  Weather) + a "More" dropdown (Our People, Families & Oríkì, Diaspora, Digital Archive, Voices of
  Takete-Ide, TIPU, Get Involved, Contact) — the weather addendum itself suggested a dropdown to
  avoid overcrowding once Weather was added to a 12-route nav.
- **Homepage Section 10 ("Development CTA")**: merged into the global Footer's CTA band rather than
  rendered twice — the footer (Section 11) sits immediately below Section 10 on every page including
  the homepage, and the brief's copy for both is effectively identical ("Join the Journey…" / "Get
  Involved"). Rendering it twice back-to-back would read as a mistake, not a feature.
- **Social icons**: Facebook/Instagram render in a visibly disabled "coming soon" state — no real
  URLs were supplied, and the brief forbids inventing them. WhatsApp/Email icons route to `/contact`.

## Content & Historical Accuracy

- **Source material**: the supplied "Master Pack" and screenshots contain AI-search-engine-style
  summaries (citing Wikipedia, Facebook, YouTube news channels, "Kogi Reports") rather than primary
  community or church records. Per rule 71 ("never invent facts") and the historical verification
  system required in the brief, every claim drawn from this material is presented on `/our-story`
  with an explicit verification badge (`community_tradition`, `oral_history`, or `unverified`) and a
  source note — never asserted as settled fact.
- **No rulers, no dates for the Olude, no TIPU founding history**: none of the supplied material
  named specific rulers or gave verifiable reign dates, so `/heritage/traditional-institution` and
  `/tipu` ship with populated architecture and explicit empty states rather than invented names.
- **Real supplied photography used directly**: the ceremony/chieftaincy photo, community photo, TIPU
  emblem and Takete-Ide Day 2024/2025 graphics are used as-is in the hero, heritage and TIPU sections
  — no stock photography was substituted, per the brief's image-handling priority order.
- **Seed data**: `supabase/seed/seed.sql` seeds only taxonomies (news categories, tags, gallery album
  shells) — zero fabricated people, rulers, events, projects, families or Oríkì.

## Admin Portal Scope

Given the number of content types (~20 entities), full bespoke create/edit UI for every one was not
achievable to production quality within this build alongside everything else requested. The scope
was deliberately split:

- **Full CRUD in-app**: News articles (flagship example demonstrating the full editorial workflow —
  draft → pending review → verified → published → archived), Website Settings (including the Weather
  admin controls from the weather addendum §20), and Users & Roles.
- **Inbox/review UI in-app** (read + status transition): Contact Messages, Diaspora Submissions,
  Volunteer Submissions, Community Profile Nominations, Heritage Submissions.
- **Read-only list views in-app, manage via Supabase Studio for now**: Takete-Ide Day Events, Gallery,
  Development Projects, Historical Archive, Oral Histories, Traditional Institution, Families &
  Oríkì, Community Profiles (Our People), Documents & Media Library.

`docs/ADMIN_GUIDE.md` documents this split explicitly and shows how to extend any read-only section
into full CRUD using `lib/actions/admin-news.ts` and `components/admin/NewsForm.tsx` as the template
— the pattern is identical for every table.

- **Role enforcement**: RLS enforces the public/staff read boundary and public-insert-only on
  submission tables correctly. Fine-grained per-role *write* restrictions (e.g. "only a historian may
  set `verified`") are enforced in the admin application layer (`requireStaff(minRole)`) rather than
  in Postgres policies for v1 — documented as a hardening follow-up in `docs/SECURITY.md`.
- **First administrator**: no account is seeded. `docs/ADMIN_GUIDE.md` documents the exact SQL to
  promote the first Supabase Auth user to `super_admin` after sign-up.

## Weather

- **AccuWeather icons**: rendered via AccuWeather's documented public icon CDN pattern
  (`developer.accuweather.com/sites/default/files/{icon}-s.png`) rather than bundling their icon set
  locally — avoids licensing the icon assets while keeping the required "Weather data provided by
  AccuWeather" attribution and link on every weather surface.
- **Caching**: current conditions and forecast are fetched server-side with a 30-minute
  `next: { revalidate }` window — real-time-per-request calls aren't necessary for a daily-cadence
  civic weather feature and would needlessly burn API quota.

## Testing & Domain

- **Testing depth**: `npm run lint`, `npm run typecheck` and `npm run build` are treated as the hard
  gate for "done." A focused Playwright smoke suite covers homepage render, primary navigation, the
  contact form's client validation, and the admin login gate being enforced — not the full exhaustive
  matrix listed in the brief's QA section, which would require a staffed QA pass against a live
  Supabase project this environment doesn't have. This is stated plainly rather than claimed as full
  coverage, per the brief's own instruction not to declare completion with known gaps unstated.
- **Domain**: no domain has been purchased. `NEXT_PUBLIC_SITE_URL` defaults to
  `https://taketeideamuro.org` as a placeholder and is fully overridable via environment variable at
  deploy time.
