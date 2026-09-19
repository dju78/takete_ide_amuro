-- 0026: Structured schools directory, project financial transparency & provenance enhancements.

-- 1. Create schools directory table
create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  school_type text not null check (school_type in ('public', 'community', 'mission', 'private')),
  level text not null check (level in ('nursery_primary', 'primary', 'secondary', 'vocational', 'tertiary')),
  location text not null default 'Takete-Ide',
  year_established integer,
  historical_description text,
  current_head text,
  approximate_enrolment integer,
  facilities text[] not null default '{}',
  community_needs text[] not null default '{}',
  current_projects text[] not null default '{}',
  photographs text[] not null default '{}',
  source_title text,
  source_author text,
  source_date text,
  verified_by text,
  last_verified_at date,
  verification_status verification_status not null default 'unverified',
  status content_status not null default 'published',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists schools_slug_idx on schools (slug);
create index if not exists schools_status_idx on schools (status);

create trigger schools_set_updated_at
  before update on schools
  for each row execute function set_updated_at();

-- 2. Add financial transparency and stage categorization to projects table
alter table projects add column if not exists amount_spent numeric(14, 2);
alter table projects add column if not exists progress_percentage integer check (progress_percentage >= 0 and progress_percentage <= 100);
alter table projects add column if not exists last_financial_update date;
alter table projects add column if not exists expenditure_notes text;
alter table projects add column if not exists source_name text;
alter table projects add column if not exists source_url text;
alter table projects add column if not exists verified_by text;
alter table projects add column if not exists last_verified_at date;

-- Stage indicator on project_images
alter table project_images add column if not exists stage text check (stage in ('before', 'progress', 'completion', 'general')) default 'general';

-- 3. Row level security for schools
alter table schools enable row level security;

create policy "Public read published schools" on schools
  for select
  using (status = 'published');

create policy "Staff manage schools" on schools
  for all
  using (is_takete_staff())
  with check (is_takete_staff());
