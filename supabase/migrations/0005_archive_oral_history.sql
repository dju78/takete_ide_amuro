-- 0005: Digital Archive and Oral History ("Voices of Takete-Ide").

create table archive_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null check (
    source_type in (
      'published_source', 'government_record', 'church_record', 'school_record',
      'community_document', 'newspaper', 'oral_testimony', 'family_archive',
      'photograph', 'video', 'audio', 'other'
    )
  ),
  notes text
);

create table archive_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  item_date date,
  is_approximate_date boolean not null default false,
  category text not null check (
    category in (
      'photograph', 'programme', 'church_record', 'school_record', 'document',
      'constitution', 'meeting_minutes', 'oral_history', 'map', 'newspaper_report',
      'video', 'audio', 'biography', 'publication'
    )
  ),
  source_id uuid references archive_sources (id) on delete set null,
  contributor text,
  rights_notes text,
  verification_status verification_status not null default 'unverified',
  tags text[] not null default '{}',
  file_url text,
  thumbnail_url text,
  access_level access_level not null default 'public',
  status content_status not null default 'draft',
  family_id uuid,
  event_id uuid references events (id) on delete set null,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index archive_items_category_idx on archive_items (category);
create index archive_items_tags_idx on archive_items using gin (tags);

create trigger archive_items_set_updated_at
  before update on archive_items
  for each row execute function set_updated_at();

create table oral_histories (
  id uuid primary key default gen_random_uuid(),
  interviewee text not null,
  interviewer text,
  interview_date date,
  photo_url text,
  audio_url text,
  video_url text,
  transcript text,
  summary text,
  topics text[] not null default '{}',
  family_id uuid,
  verification_notes text,
  consent_confirmed boolean not null default false,
  verification_status verification_status not null default 'oral_history',
  status content_status not null default 'draft',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index oral_histories_topics_idx on oral_histories using gin (topics);

create trigger oral_histories_set_updated_at
  before update on oral_histories
  for each row execute function set_updated_at();

-- General source-management capability for any historical claim on the site (spec §28).
create table verification_records (
  id uuid primary key default gen_random_uuid(),
  claim text not null,
  subject_type text not null,
  subject_id uuid,
  source text,
  source_type text,
  contributor text,
  claim_date date,
  verification_status verification_status not null default 'unverified',
  reviewer_id uuid references profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index verification_records_subject_idx on verification_records (subject_type, subject_id);

-- General document library (constitutions, reports, programmes not tied to one section).
create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  document_type text,
  document_date date,
  source text,
  file_url text not null,
  file_size_bytes bigint,
  verification_status verification_status not null default 'unverified',
  created_at timestamptz not null default now()
);

-- Generic media library used by the admin media manager.
create table media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  media_type text not null check (media_type in ('image', 'video', 'audio', 'document')),
  alt_text text,
  caption text,
  uploaded_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
