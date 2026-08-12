-- 0006: Families, compounds, lineage, and Oríkì digital archive.
-- No family names, compounds or Oríkì are seeded — see docs/HISTORICAL_VERIFICATION.md.

create type family_verification_status as enum (
  'draft',
  'family_submitted',
  'oral_history',
  'documentary_evidence',
  'community_reviewed',
  'verified',
  'disputed'
);

create table compounds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  alternative_name text,
  slug text not null unique,
  description text,
  photo_url text,
  approximate_location text, -- deliberately coarse; never a precise residential address
  verification_status family_verification_status not null default 'draft',
  status content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  alternative_names text[] not null default '{}',
  compound_id uuid references compounds (id) on delete set null,
  summary text,
  history text,
  known_ancestral_accounts text,
  migration_settlement_history text,
  values_and_traditions text,
  notable_contributions text,
  verification_status family_verification_status not null default 'draft',
  status content_status not null default 'draft',
  representative_id uuid references profiles (id) on delete set null,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index families_compound_idx on families (compound_id);

create trigger families_set_updated_at
  before update on families
  for each row execute function set_updated_at();

create table family_relationships (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  related_family_id uuid not null references families (id) on delete cascade,
  relationship_type text not null check (
    relationship_type in ('parent_lineage', 'branch', 'related_family', 'historical_association')
  ),
  notes text,
  verification_status family_verification_status not null default 'draft',
  constraint family_relationships_no_self check (family_id <> related_family_id)
);

create table family_media (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  media_type text not null check (media_type in ('photo', 'document', 'audio', 'video')),
  url text not null,
  caption text,
  approximate_date text,
  people_shown text,
  event_context text,
  photographer text,
  publication_permission boolean not null default false,
  created_at timestamptz not null default now()
);

create table family_sources (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  source_type text not null,
  description text,
  contributor text
);

create table family_representatives (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  full_name text not null,
  relationship_to_family text,
  contact_email text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table oriki (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families (id) on delete set null,
  title text not null,
  slug text not null unique,
  compound_id uuid references compounds (id) on delete set null,
  language text not null default 'Yoruba',
  original_text text not null,
  transliteration text,
  english_interpretation text,
  cultural_notes text,
  performer text,
  recording_date date,
  source text,
  contributor text,
  copyright_notes text,
  verification_status family_verification_status not null default 'draft',
  publication_permission boolean not null default false,
  status content_status not null default 'draft',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index oriki_family_idx on oriki (family_id);

create trigger oriki_set_updated_at
  before update on oriki
  for each row execute function set_updated_at();

create table oriki_media (
  id uuid primary key default gen_random_uuid(),
  oriki_id uuid not null references oriki (id) on delete cascade,
  media_type text not null check (media_type in ('audio', 'video')),
  url text not null,
  transcript text
);

create table oriki_sources (
  id uuid primary key default gen_random_uuid(),
  oriki_id uuid not null references oriki (id) on delete cascade,
  source_type text not null,
  description text,
  contributor text
);

-- Community submission review queues (spec §17-19, §33, §48-49) — nothing here publishes automatically.
create table heritage_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null check (
    submission_type in ('family_history', 'oriki', 'historical_material', 'oral_history', 'profile_nomination', 'photo_identification')
  ),
  family_name text,
  compound text,
  submitter_name text not null,
  submitter_relationship text,
  submitter_email text not null,
  submitter_phone text,
  payload jsonb not null default '{}',
  file_urls text[] not null default '{}',
  permission_to_archive boolean not null default false,
  permission_to_publish boolean not null default false,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'in_review', 'accepted', 'needs_more_info', 'declined')
  ),
  reviewed_by uuid references profiles (id) on delete set null,
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger heritage_submissions_set_updated_at
  before update on heritage_submissions
  for each row execute function set_updated_at();

alter table archive_items
  add constraint archive_items_family_fk foreign key (family_id) references families (id) on delete set null;

alter table oral_histories
  add constraint oral_histories_family_fk foreign key (family_id) references families (id) on delete set null;
