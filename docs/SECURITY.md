# Security

## Authentication & Authorization

- Supabase Auth (email/password) gates `/admin/*`. `middleware.ts` refreshes the session cookie on
  every request; `lib/auth.ts#requireStaff()` is the single gate every admin page/layout calls,
  redirecting unauthenticated or under-privileged visitors.
- The service-role key (`SUPABASE_SERVICE_ROLE_KEY`) is read only in `lib/supabase/server.ts` and
  never sent to the client. No component under `components/` imports it.

## Row Level Security

Enabled on every table (`supabase/migrations/0009_row_level_security.sql`). Public/staff read
boundaries and public-insert-only submission tables are enforced in Postgres, not just the app layer
— even a leaked anon key can't read private diaspora/contact submissions.

**Documented gap**: per-role *write* granularity (e.g. "only historian can set `verified`") is
currently enforced via `requireStaff(minRole)` in Server Actions, not Postgres policies. Hardening
path: add a `set_verification_status()` Postgres function restricted by role, called instead of a
direct `UPDATE`, for any table carrying a `verification_status` column.

## Input Validation

Every public form is validated with Zod on the server (`lib/validations.ts`,
`lib/actions/submissions.ts`) regardless of client-side HTML5 validation — the server is the source
of truth. Admin mutations (`lib/actions/admin-*.ts`) validate with their own Zod schemas.

## File Uploads

v1 admin forms accept Storage URLs (populated after uploading via Supabase Studio) rather than
handling multipart upload themselves. Storage bucket policies (`0010_storage_buckets.sql`) restrict
writes to authenticated staff and reject anonymous uploads at the Postgres/Storage level. When an
in-app upload widget is added, it must enforce MIME-type and file-size checks before calling
Storage — do not trust the browser-reported MIME type alone.

## Secrets

- Never committed: see `.gitignore` (`.env*.local`) and `.env.example` (documents required vars,
  contains no values).
- `SUPABASE_SERVICE_ROLE_KEY` and `ACCUWEATHER_API_KEY` are server-only; `lib/env.ts` is the single
  place that reads `process.env`, making it easy to audit what's exposed via `NEXT_PUBLIC_*`.

## Error Handling

Weather and Supabase calls fail closed to graceful UI states (`WeatherUnavailable`, `EmptyState`)
rather than throwing to a 500 page or leaking stack traces. Server-side errors are logged via
`console.error` with a `[weather]`/context prefix for log-search-ability; nothing sensitive is
included in client-visible error messages.

## Rate Limiting & Anti-Spam

Not yet implemented at the application layer (no queue/edge middleware configured in this
environment). Recommended before production traffic: Vercel's built-in Attack Challenge Mode or a
lightweight IP-based rate limit on the public form Server Actions (`lib/actions/submissions.ts`).
