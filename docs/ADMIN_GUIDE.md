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

- **News** (`/admin/news`) — the reference implementation. Create, edit, delete, and move through
  the full editorial workflow (`draft → pending_review → verified → published → archived`).
- **Website Settings** (`/admin/settings`) — site identity, contact details, social links, footer
  text, and the Weather section controls from the weather feature (§20 of that spec): enable/disable,
  location label, forecast URL, homepage/header visibility. The AccuWeather API key itself is never
  editable here — it's an environment secret only.
- **Users & Roles** (`/admin/users`, Super Admin only).

## What's Inbox/Review-Only Today

`/admin/messages`, `/admin/diaspora`, `/admin/volunteers`, `/admin/heritage-submissions` — staff can
read every submission and change its status (e.g. `pending → accepted`), but turning an accepted
Heritage Submission into a published Family or Oríkì record is currently a manual step via Supabase
Studio (create the row, copy the submitted text across, set `publication_permission`).

## What's Read-Only Today

`/admin/events`, `/admin/gallery`, `/admin/projects`, `/admin/archive`, `/admin/oral-history`,
`/admin/traditional-institution`, `/admin/families`, `/admin/people`, `/admin/media` list existing
rows with their status/verification badges. Creating and editing rows in these sections currently
happens in **Supabase Studio's table editor** directly against the tables named on each page.

### Extending a read-only section to full CRUD

Follow the News pattern — it's identical for every table:

1. Copy `lib/actions/admin-news.ts` → `lib/actions/admin-<table>.ts`; adjust the Zod schema and the
   `.from("news_articles")` calls to your table.
2. Copy `components/admin/NewsForm.tsx` → a form for your fields.
3. Add `app/admin/(dashboard)/<section>/new/page.tsx` and `.../[id]/edit/page.tsx`.
4. Add "New" / "Edit" links to the existing list page.

## Audit Log

Every create/update/delete/role-change from the actions above writes a row to `audit_logs` via
`logAudit()` (`lib/data/admin.ts`), visible at `/admin/audit-log`.
