-- 0004: Our People profiles, Traditional Institution, TIPU.

create table historical_people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null check (
    category in (
      'traditional_leaders', 'community_leaders', 'public_service', 'academia',
      'education', 'healthcare', 'business', 'entrepreneurship', 'arts_culture',
      'sports', 'diaspora', 'young_achievers'
    )
  ),
  photo_url text,
  biography text,
  achievements text,
  external_links jsonb not null default '[]',
  verification_status verification_status not null default 'unverified',
  status content_status not null default 'draft',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index historical_people_category_idx on historical_people (category);

create trigger historical_people_set_updated_at
  before update on historical_people
  for each row execute function set_updated_at();

-- Traditional Institution: reusable structure for current + past rulers.
-- No ruler rows are seeded — names/dates must come from verified community sources.
create table traditional_rulers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  regnal_title text not null default 'Olude of Takete-Ide Amuro',
  reign_start date,
  reign_end date,
  is_current boolean not null default false,
  biography text,
  photo_url text,
  verification_status verification_status not null default 'unverified',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table traditional_council_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null,
  responsibilities text,
  photo_url text,
  sort_order integer not null default 0
);

-- Takete-Ide Progressive Union
create table tipu_leadership (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  position text not null,
  branch text,
  term_start date,
  term_end date,
  photo_url text,
  sort_order integer not null default 0
);

create table tipu_branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  description text,
  contact_note text
);

create table tipu_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status project_status not null default 'proposed',
  created_at timestamptz not null default now()
);

create table tipu_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  published_at timestamptz,
  status content_status not null default 'draft'
);

create table tipu_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  document_url text not null,
  document_type text,
  published_at date
);
