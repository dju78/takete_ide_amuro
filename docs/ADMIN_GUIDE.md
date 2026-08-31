# Admin Guide

## Creating the First Administrator

No admin account is seeded. After deploying with Supabase configured:

1. Have the intended first administrator sign up — easiest path is temporarily adding a public
   sign-up form, or creating the user directly in **Supabase Studio → Authentication → Users → Add User**.
2. A `profiles` row is created automatically (role defaults to `editor`) via the `handle_new_user`
   trigger.
3. Promote them to `super_admin` by running this in the Supabase SQL editor:

   ```sql
   update profiles set role = 'super_admin' where id = '<their-auth-user-uuid>';
   ```
4. Sign in at `/admin/login`.

## Roles

| Role | Typical use |
|---|---|
| `super_admin` | Full access, including Users & Roles |
| `administrator` | General content management, Website Settings |
| `editor` | Create/edit content (default for new sign-ups) |
| `historian` | Historical Archive / Families & Oríkì verification |
| `project_manager` | Development Projects |
| `media_manager` | Gallery / Media Library |

Every admin page/layout calls `requireStaff(minRole)` (`lib/auth.ts`) — unauthenticated visitors are
redirected to `/admin/login`; under-privileged staff are redirected back to `/admin`.

## What Has Full CRUD Today

Every content entity in the schema has full create/edit/delete in `/admin`:

- **News** (`/admin/news`) — the reference implementation. Full editorial workflow
  (`draft → pending_review → verified → published → archived`).
- **Website Settings** (`/admin/settings`) — site identity, contact details, social links, footer
  text, and the Weather section controls (enable/disable, location label, forecast URL,
  homepage/header visibility). The AccuWeather API key itself is never editable here — environment
  secret only.
- **Users & Roles** (`/admin/users`, Super Admin only).
- **Takete-Ide Day Events** (`/admin/events`) — creating a new year is entirely admin-driven; each
  event's edit page also supports adding/removing photo and video attachments.
- **Gallery** (`/admin/gallery`) — add photographs (with a real Storage upload, not a pasted URL) and
  quick-add albums.
- **Development Projects** (`/admin/projects`) — full project fields, plus adding progress updates
  from the project's edit page.
- **Digital Archive** (`/admin/archive`).
- **Oral Histories** (`/admin/oral-history`) — the form refuses to save without the consent checkbox
  ticked.
- **Traditional Institution** (`/admin/traditional-institution`) — rulers (full CRUD) plus a
  quick-add for Traditional Council members.
- **Families & Oríkì** (`/admin/families`, `/admin/oriki`) — Oríkì captures original text,
  transliteration, English interpretation, audio/video upload, family/compound link, performer,
  source, and **explicit consent, tracked separately from publish permission**.
- **Our People** (`/admin/people`).
- **TIPU** (`/admin/tipu`) — leadership, branches, announcements and documents.

Every form that accepts a photo, audio, video or document uses
`components/admin/FileUploadField.tsx`, which uploads directly to the relevant Supabase Storage
bucket from the browser (RLS restricts writes to authenticated staff — see
`supabase/migrations/0010_storage_buckets.sql`) and writes the resulting public URL into the form.
No admin workflow requires pasting a Storage URL by hand.

## TIPU Branches (`/admin/tipu/branches`)

The full branch network — every branch the community has documented, whether or not it has a
photograph. Requires the `administrator` role. Administrators can:

- add a branch, or edit any existing branch's name, display name, monogram, group and description
- set the location as city / state / country separately — fill only the parts the record supports
- set **status** (active / forming / inactive) and **verification** (verified / community record /
  pending verification). These answer different questions: status is whether the branch operates,
  verification is how well the community record attests it.
- record an internal **source note** (which union communication documents the branch, and any
  ambiguity to resolve) — never rendered publicly — and an optional public status note
- **upload or replace the branch photograph** — this removes the branded placeholder immediately, with
  no deploy. Alt text becomes required as soon as a photograph is attached.
- record an established date (free text — leave blank unless it is verified)
- set active/inactive, feature a branch in the homepage strip, and set sort order
- enable a dedicated branch page once there is enough content to fill one, and set its address
- add branch news and events: the card shows the latest published news item as "latest activity" and
  the next future event as "upcoming event"

**Reset** on a branch that ships with the site restores the details it was published with — it does
not delete the branch. Only branches added here can be removed outright, so a documented branch cannot
be lost by accident.

Never upload stock photography or a generated image of a city in place of a branch photograph. A
branch with no photograph is properly served by the placeholder; a fake one misleads. See
`docs/TIPU_BRANCH_NETWORK.md`.

## Community Media (`/admin/community-media`)

Photographs and video imported from the TIPU community archive. The **files** are part of the website
build and cannot be swapped from the admin area — to replace a file, drop the new one into `public/`
and redeploy. Everything else about each item is editable here and takes effect immediately:

- title, description/caption and alt text
- category (shares the same list as the Gallery), event grouping and branch
- event date (exact day) or event period (e.g. "August 2026"), and location
- **Published** — untick to remove an item from the gallery and every story page at once
- **Featured** — controls membership of the homepage photo strip
- **Verification status** and a note explaining what is still unconfirmed. Only
  `pending-verification` is visible to the public, as a short caveat under the item.
- **Verified names** — leave blank unless the community has confirmed who is pictured *and* agreed
  to publication. Nothing in the import identifies anybody.

**Reset** on a row discards your edits to that item and restores the metadata it was imported with;
it never deletes the media. Requires the `media_manager` role or above.

Background on what was imported, what was excluded and why is in `docs/COMMUNITY_MEDIA_IMPORT.md`.

## What's Inbox/Review-Only Today

`/admin/messages`, `/admin/diaspora`, `/admin/volunteers`, `/admin/heritage-submissions` — staff can
read every submission and change its status (e.g. `pending → accepted`), but turning an accepted
Heritage Submission into a published Family or Oríkì record means opening `/admin/families/new` (or
`/admin/oriki/new`) and creating the record from the submission's content — a deliberate manual
review step, not a missing feature, since nothing should auto-publish from an unreviewed submission.

## What's Deliberately Still Studio-Managed

Two things, both sub-resources of an entity that already has full top-level CRUD, and both
low-frequency data entry:

- **Event speeches / awards / fundraising rows** — the parent Event and its photo/video media have
  full CRUD; these three sub-tables (`event_speeches`, `event_awards`, `event_fundraising`) are
  edited directly in Supabase Studio.
- **TIPU project pipeline** (`tipu_projects`) — TIPU leadership/branches/announcements/documents all
  have full CRUD; the project list is Studio-managed.

### Extending either to full CRUD

Follow the News (or Oríkì, for a more complex example) pattern — it's identical for every table:

1. Copy `lib/actions/admin-news.ts` → `lib/actions/admin-<table>.ts`; adjust the Zod schema and the
   `.from("news_articles")` calls to your table.
2. Copy `components/admin/NewsForm.tsx` → a form for your fields; use
   `components/admin/FileUploadField.tsx` for any media field.
3. Add `app/admin/(dashboard)/<section>/new/page.tsx` and `.../[id]/edit/page.tsx`.
4. Add "New" / "Edit" links to the existing list page.

## Audit Log

Every create/update/delete/role-change from the actions above writes a row to `audit_logs` via
`logAudit()` (`lib/data/admin.ts`), visible at `/admin/audit-log`.
