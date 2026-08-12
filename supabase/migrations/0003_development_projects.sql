-- 0003: Community development projects.

create type project_status as enum (
  'proposed',
  'planning',
  'fundraising',
  'in_progress',
  'completed',
  'on_hold'
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (
    category in (
      'roads_access', 'education', 'healthcare', 'water', 'electricity',
      'civic_infrastructure', 'ict_digital', 'youth_development'
    )
  ),
  description text,
  objective text,
  status project_status not null default 'proposed',
  location text,
  start_date date,
  expected_completion date,
  budget numeric(14, 2),
  amount_raised numeric(14, 2),
  funding_target numeric(14, 2),
  currency text not null default 'NGN',
  funding_source text,
  responsible_organisation text,
  verification_status verification_status not null default 'unverified',
  status_history_note text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_status_idx on projects (status);
create index projects_category_idx on projects (category);

create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer not null default 0
);

create table project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  title text not null,
  body text,
  update_date date not null default current_date,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  title text not null,
  document_url text not null,
  document_type text,
  file_size_bytes bigint
);

-- Transparency timeline (spec §65): announced -> planning -> consultation -> fundraising -> commenced -> update -> completed
create table project_timeline_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  milestone text not null,
  event_date date,
  notes text,
  sort_order integer not null default 0
);
