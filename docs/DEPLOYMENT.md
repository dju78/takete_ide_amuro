# Deployment

**Takete-Ide Amuro deploys to Netlify.** The live site is <https://takete-ide.org>.

> **Note for maintainers:** earlier revisions of this document described a Vercel deployment. That
> was never the production platform and the instructions have been removed. If you find Vercel
> references anywhere else in the repository, they are obsolete — the only remaining trace is
> `.vercel` in `.gitignore`, which is harmless.

## Platform

The site runs on **Netlify's Next.js Runtime**, which Netlify applies automatically when it detects a
Next.js project. Verified against the live deployment:

- responses carry `Server: Netlify`, `X-Powered-By: Next.js` and `Cache-Status: "Next.js"; …`
- `/api/weather/current` returns **503** — its own "not configured" response, not a 404 — proving
  App Router **route handlers execute server-side**

**No `netlify.toml`, adapter or plugin is required or installed.** The runtime already provides route
handlers, server functions, server actions, dynamic routes and environment variables. Do not add
Netlify packages the deployment does not need.

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the schema: `supabase link --project-ref <ref> && supabase db push`, or paste each file in
   `supabase/migrations/` into the SQL editor in numeric order.
3. Run `supabase/seed/seed.sql` for safe taxonomy data.
4. Storage buckets are created by `0010_storage_buckets.sql` — verify in **Storage** that `news`,
   `events`, `gallery`, `projects`, `archive`, `oral-history`, `people`, `families`, `oriki`, `tipu`,
   `documents`, `site` all exist and are public.
5. Copy the Project URL, anon key and service role key from **Settings → API**.

## 2. Environment Variables

Copy `.env.example` to `.env.local` for local development, and set the same names in
**Netlify → Site configuration → Environment variables**, scoped to the appropriate deploy contexts.

Minimum for a functioning site: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.

`NEXT_PUBLIC_SITE_URL` must be the real origin (`https://takete-ide.org`). It builds the Paystack
callback URL, so a wrong value returns contributors to the wrong host after payment.

## 3. Online Contributions (Paystack)

Checkout is a server-side redirect to Paystack's own hosted page, so
`PAYSTACK_SECRET_KEY` is the only key required — there is no publishable key to
set. The payment feature is **inert unless it is set**. With them unset the Support page
shows only Direct Bank Transfer, no checkout is exposed, and nothing errors — so the site is safe to
deploy before payments are approved.

### Required variables

| Variable | Scope | Purpose |
|---|---|---|
| `PAYSTACK_SECRET_KEY` | **Server only** | Initialize and verify transactions; validate webhook signatures |
| `CONTRIBUTION_MIN_AMOUNT` | Optional | Minimum contribution in naira (default 100) |
| `CONTRIBUTION_MAX_AMOUNT` | Optional | Maximum contribution in naira (default 5,000,000) |

Paystack signs webhooks with the **secret key** — there is no separate webhook secret to configure.

The application derives test vs live mode from the key's own prefix, so there is no mode flag to set
or forget. In test mode the Support page displays a visible "Test mode" notice.

### Server endpoints (all Netlify server functions)

| Route | Method | Purpose |
|---|---|---|
| Server action `startContributionAction` | POST | Validates input, records a pending contribution, initializes with Paystack |
| `/support/payment/callback` | GET | Where Paystack returns the payer; verifies server-side, then redirects |
| `/api/paystack/webhook` | POST | Receives Paystack events; HMAC SHA-512 verified, idempotent |

All are standard Node-runtime App Router handlers — nothing Netlify-specific — so the integration
stays portable.

### Going live (not yet done)

1. Keep test keys in place and complete test-mode review.
2. Apply migration `0019_contributions.sql` to the Supabase project.
3. Set live keys in Netlify environment variables.
4. In the Paystack dashboard, set the webhook URL to
   `https://takete-ide.org/api/paystack/webhook`.
5. Confirm which payment channels the merchant account has enabled. The site never hard-codes a
   channel list — Paystack's hosted checkout presents whatever the account supports — so nothing in
   the code needs changing, but the Support page copy should not promise more than the account offers.
6. Make one small live contribution end to end and confirm it appears in **Admin → Contributions**
   with status `successful` and a verification timestamp.

## 4. First Admin

See `docs/ADMIN_GUIDE.md` — create a Supabase Auth user, then promote to `super_admin` via SQL.
Contribution records require the `super_admin` or `treasurer` role, enforced both in the application
and by row-level security.

## 5. Local Development

```bash
npm install
npm run dev
```

## 6. Quality Gates

```bash
npm run lint
npm run typecheck
npm test          # Playwright suite
npm run build
```

## 7. Deploy

Netlify builds automatically from the connected GitHub repository. `npm run build` is the build
command and `.next` the publish output; the Next.js Runtime handles the rest.

## 8. Domain & Admin Routing

The canonical production domain is **`https://takete-ide.org`** with canonical Admin at **`https://takete-ide.org/admin`**.
Any incoming requests to legacy aliases (such as `takete.netlify.app/admin` or `takete.netlify.app/admin/*`) are permanently redirected via HTTP 308 to `https://takete-ide.org/admin/*` while preserving query parameters and strict destination integrity.

## 9. Post-Deploy Checklist

- [ ] Sign in to `/admin` and confirm the first administrator account works
- [ ] Fill in `/admin/settings` (contact email/phone, social links)
- [ ] Confirm `/sitemap.xml` and `/robots.txt` resolve
- [ ] If using AccuWeather, confirm `/weather` shows live data or its fallback
- [ ] Confirm `/support` shows Direct Bank Transfer with the correct account number
- [ ] If Paystack is configured, confirm the mode banner reflects the intended environment
- [ ] Review `/privacy` and `/terms` with the community before treating the site as fully live
