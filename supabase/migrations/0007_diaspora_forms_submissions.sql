-- 0007: Diaspora registrations, contact messages, volunteer & nomination forms.

create table diaspora_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  country text not null,
  city text,
  profession text,
  area_of_expertise text,
  family_compound text,
  contribution_interests text[] not null default '{}',
  consent_given boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'archived')),
  created_at timestamptz not null default now()
);

-- Never exposed publicly — admin/staff read only, enforced via RLS in 0009.
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  consent_given boolean not null default true,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create table volunteer_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  country text,
  skills text[] not null default '{}',
  interest_area text not null check (
    interest_area in (
      'volunteer_skills', 'community_projects', 'diaspora_participation',
      'share_historical_materials', 'oral_history_contribution',
      'community_partnerships', 'youth_engagement'
    )
  ),
  message text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'contacted', 'archived')),
  created_at timestamptz not null default now()
);

create table community_profile_nominations (
  id uuid primary key default gen_random_uuid(),
  nominee_name text not null,
  category text not null,
  biography text,
  achievements text,
  evidence_source text,
  photo_url text,
  submitter_name text not null,
  submitter_email text not null,
  permission_confirmed boolean not null default false,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'in_review', 'accepted', 'declined')
  ),
  reviewed_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
