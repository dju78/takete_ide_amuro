# Database

Schema lives in `supabase/migrations/`, applied in numeric order:

| File | Contents |
|---|---|
| `0001_extensions_enums_profiles.sql` | Roles, content-status/verification enums, `profiles` (extends `auth.users`), RLS helper functions |
| `0002_news_events_gallery.sql` | News, tags, categories, Takete-Ide Day `events` (+media/speeches/awards/fundraising), albums, gallery |
| `0003_development_projects.sql` | `projects` + images/updates/documents/timeline |
| `0004_people_institution_tipu.sql` | `historical_people`, `traditional_rulers`, council, TIPU leadership/branches/projects/announcements/documents |
| `0005_archive_oral_history.sql` | `archive_items`, `archive_sources`, `oral_histories`, `verification_records`, `documents`, `media` |
| `0006_families_oriki.sql` | `families`, `compounds`, `oriki` (+ media/sources/relationships/representatives), `heritage_submissions` review queue |
| `0007_diaspora_forms_submissions.sql` | `diaspora_members`, `contact_messages`, `volunteer_submissions`, `community_profile_nominations` |
| `0008_settings_announcements_audit.sql` | Singleton `site_settings`, `announcements`, `audit_logs` |
| `0009_row_level_security.sql` | RLS enabled + policies on every table above |
| `0010_storage_buckets.sql` | 12 public-read Storage buckets with staff-only write policies |

## Applying Migrations

```bash
# with the Supabase CLI, from the project root:
supabase link --project-ref <your-project-ref>
supabase db push
# then seed safe taxonomy data:
psql "$SUPABASE_DB_URL" -f supabase/seed/seed.sql
```

Or paste each migration file's contents into the Supabase Studio SQL editor, in numeric order.

## RLS Model

- **Public content tables** (news, events, gallery, projects, people, archive, families, oríkì, …):
  anonymous/authenticated visitors can `SELECT` only `published` (or `public`-access-level) rows;
  any row in `profiles` ("staff") can `SELECT`/`INSERT`/`UPDATE`/`DELETE` everything.
- **Submission/inbox tables** (contact, diaspora, volunteer, nominations, heritage submissions):
  anyone can `INSERT`; only staff can `SELECT`/`UPDATE`/`DELETE`. Submitted data is never publicly
  readable, satisfying the brief's privacy requirements for diaspora/volunteer data.
- **System tables** (`profiles`, `audit_logs`, `site_settings`): staff-only, with role checks
  (`current_user_role()`, `is_admin_role()`) for sensitive writes like changing another user's role.

Fine-grained per-role write rules (e.g. "only a historian may set a claim to `verified`") are
enforced in the application layer via `requireStaff(minRole)` rather than in Postgres policies for
v1 — see `docs/SECURITY.md` for the documented hardening path.

## Types

`types/database.ts` intentionally does **not** attempt to hand-author the full Supabase generated
`Database` type for ~45 tables — that's what `supabase gen types typescript` is for, and it needs a
live linked project. Once one exists:

```bash
supabase gen types typescript --project-id <ref> > types/database.ts
```

Until then, the app uses its own hand-written domain types in `types/content.ts`, `types/family.ts`
and `types/weather.ts`, which every `lib/data/*.ts` function maps Supabase rows into. This keeps the
UI fully typed without blocking on codegen against infrastructure that doesn't exist yet.
