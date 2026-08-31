-- 0001: Extensions, shared enums, roles, profiles, and app memberships.

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- Takete-scoped role enum (scoped to prevent collisions in a shared Supabase database).
create type takete_role as enum (
  'super_admin',
  'administrator',
  'editor',
  'historian',
  'project_manager',
  'media_manager'
);

-- Editorial workflow for general content (news, projects, gallery, docs...).
create type content_status as enum (
  'draft',
  'pending_review',
  'verified',
  'published',
  'archived'
);

-- Historical-claim verification, used across Our Story, Heritage, Families, Oríkì.
create type verification_status as enum (
  'unverified',
  'oral_history',
  'community_tradition',
  'documentary_evidence',
  'verified',
  'disputed'
);

create type access_level as enum ('public', 'community', 'admin_only');

-- Neutral universal user identity table (no global application role).
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'Neutral user identity table extending auth.users.';

-- Application-scoped membership and role assignment table.
create table app_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  app_key text not null default 'takete',
  role takete_role not null default 'editor',
  status text not null default 'active' check (status in ('active', 'suspended', 'invited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_memberships_user_app_uniq unique (user_id, app_key)
);

comment on table app_memberships is 'Application-scoped membership and permissions (e.g. app_key = takete).';

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger app_memberships_set_updated_at
  before update on app_memberships
  for each row execute function set_updated_at();

-- Auto-create a neutral profile whenever a new auth user signs up.
-- Does NOT automatically grant Takete membership or permissions.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Takete-scoped auth helper functions:
create or replace function current_takete_role()
returns takete_role language sql stable security definer set search_path = public as $$
  select role from app_memberships
  where user_id = auth.uid()
    and app_key = 'takete'
    and status = 'active'
  limit 1;
$$;

create or replace function is_takete_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('super_admin', 'administrator')
     from app_memberships
     where user_id = auth.uid()
       and app_key = 'takete'
       and status = 'active'),
    false
  );
$$;

create or replace function is_takete_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from app_memberships
    where user_id = auth.uid()
      and app_key = 'takete'
      and status = 'active'
  );
$$;

create or replace function is_takete_financial_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('super_admin', 'treasurer')
     from app_memberships
     where user_id = auth.uid()
       and app_key = 'takete'
       and status = 'active'),
    false
  );
$$;

alter table profiles enable row level security;

create policy "Profiles are viewable by Takete staff" on profiles
  for select using (is_takete_staff());

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Super admins manage all profiles" on profiles
  for all using (current_takete_role() = 'super_admin');

alter table app_memberships enable row level security;

create policy "Staff view their own membership or staff list" on app_memberships
  for select using (is_takete_staff() or user_id = auth.uid());

create policy "Super admins manage all memberships" on app_memberships
  for all using (current_takete_role() = 'super_admin');
