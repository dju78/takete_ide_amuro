# Deployment

## Prerequisites

- A Supabase project (free tier is sufficient to start)
- A Vercel account
- (Optional) an AccuWeather developer API key
- (Optional) a transactional email provider

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the schema: `supabase link --project-ref <ref> && supabase db push`, or paste each file in
   `supabase/migrations/` into the SQL editor in numeric order.
3. Run `supabase/seed/seed.sql` for safe taxonomy data.
4. Storage buckets are created by `0010_storage_buckets.sql` automatically — verify in
   **Storage** that `news`, `events`, `gallery`, `projects`, `archive`, `oral-history`, `people`,
   `families`, `oriki`, `tipu`, `documents`, `site` all exist and are public.
5. Copy your Project URL, anon key, and service role key from **Settings → API**.

## 2. Environment Variables

Copy `.env.example` to `.env.local` for local dev, and add the same variables in
**Vercel → Project → Settings → Environment Variables** for each environment (Production/Preview).

At minimum for a functioning site: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.

## 3. First Admin

See `docs/ADMIN_GUIDE.md` — create a Supabase Auth user, then promote to `super_admin` via SQL.

## 4. Local Development

```bash
npm install
npm run dev
```

## 5. Quality Gates

```bash
npm run lint
npm run typecheck
npm test          # Playwright smoke suite
npm run build
```

## 6. Deploy to Vercel

```bash
# via the Vercel CLI, from the project root:
npx vercel link
npx vercel env pull .env.local   # optional, to sync envs locally
npx vercel --prod
```

Or connect the GitHub repository in the Vercel dashboard for automatic deploys on push — no
`vercel.json` is required; Next.js is auto-detected.

## 7. Domain

No domain has been purchased yet (e.g. `taketeideamuro.org`). Once one is, point it at the Vercel
project (**Settings → Domains**) and update `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables
to match — this drives canonical URLs, the sitemap, and Open Graph metadata.

## 8. Post-Deploy Checklist

- [ ] Sign in to `/admin` and confirm the first administrator account works
- [ ] Fill in `/admin/settings` (contact email/phone, social links)
- [ ] Confirm `/sitemap.xml` and `/robots.txt` resolve
- [ ] If using AccuWeather, confirm `/weather` shows live data (or the graceful fallback if not yet configured)
- [ ] Review `/privacy` and `/terms` with the community/legal counsel before treating the site as fully live — see `docs/DECISIONS.md`
