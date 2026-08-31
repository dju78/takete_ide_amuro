-- 0013: The TIPU branch network.
--
-- `tipu_branches` started as a flat name/region/description list. The branch
-- network page needs considerably more per branch — a photograph (or a branded
-- placeholder in its absence), grouping, activity, and whether the branch has
-- earned a dedicated page yet — and all of it has to be editable without a
-- deploy, because the whole point is that a placeholder can be swapped for a
-- real photograph the day one arrives.
--
-- The documented branch list ships in lib/media/tipu-branches.ts so the network
-- renders correctly with no database at all. Rows here are matched to that
-- baseline by `slug` and merged over it; a row with a slug the baseline doesn't
-- know about is simply an additional branch an administrator created.

alter table tipu_branches add column if not exists slug text;
alter table tipu_branches add column if not exists country text;
alter table tipu_branches add column if not exists branch_group text
  check (branch_group in ('home', 'nigeria', 'diaspora'));
alter table tipu_branches add column if not exists acronym text;
alter table tipu_branches add column if not exists image_url text;
alter table tipu_branches add column if not exists image_alt text;
-- Free text rather than a date: the community records "August 2026" as often as
-- an exact day, and inventing a day to satisfy a date column would be a lie.
alter table tipu_branches add column if not exists established_label text;
alter table tipu_branches add column if not exists is_active boolean not null default true;
alter table tipu_branches add column if not exists is_featured boolean not null default false;
alter table tipu_branches add column if not exists has_dedicated_page boolean not null default false;
alter table tipu_branches add column if not exists dedicated_page_href text;
alter table tipu_branches add column if not exists sort_order integer not null default 0;
alter table tipu_branches add column if not exists created_at timestamptz not null default now();
alter table tipu_branches add column if not exists updated_at timestamptz not null default now();

-- Plain (not partial) unique index so `on conflict (slug)` upserts work from the
-- admin actions. Postgres allows many NULLs in a unique index, so branch rows
-- created before this migration — which have no slug — are unaffected.
create unique index if not exists tipu_branches_slug_key on tipu_branches (slug);

drop trigger if exists tipu_branches_set_updated_at on tipu_branches;
create trigger tipu_branches_set_updated_at
  before update on tipu_branches
  for each row execute function set_updated_at();

-- Branch news and events. One table with a `kind` discriminator rather than two
-- near-identical ones: a branch card shows the most recent 'news' as its latest
-- activity and the next future 'event' as its upcoming event.
create table if not exists tipu_branch_updates (
  id uuid primary key default gen_random_uuid(),
  branch_slug text not null,
  kind text not null check (kind in ('news', 'event')),
  title text not null,
  body text,
  -- For 'event' this is when it happens; for 'news' when it happened.
  occurs_on date,
  status content_status not null default 'published',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists tipu_branch_updates_branch_idx
  on tipu_branch_updates (branch_slug, kind, occurs_on desc);

alter table tipu_branch_updates enable row level security;

create policy "Public can view published tipu_branch_updates"
  on tipu_branch_updates for select using (status = 'published' or is_staff());

create policy "Staff manage tipu_branch_updates"
  on tipu_branch_updates for all using (is_staff()) with check (is_staff());
