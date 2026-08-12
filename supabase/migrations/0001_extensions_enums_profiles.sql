-- 0001: Extensions, shared enums, roles, and user profiles.

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- Roles are additive to Supabase Auth users via a profile row.
create type user_role as enum (
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

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role user_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'Extends auth.users with a display name, avatar and site role.';

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

-- Auto-create a profile (default role: editor) whenever a new auth user signs up.
-- The very first administrator must be promoted manually — see docs/ADMIN_GUIDE.md.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create or replace function current_user_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_admin_role()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('super_admin', 'administrator') from profiles where id = auth.uid()),
    false
  );
$$;

create or replace function is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid());
$$;

alter table profiles enable row level security;

create policy "Profiles are viewable by staff" on profiles
  for select using (is_staff());

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Super admins manage all profiles" on profiles
  for all using (current_user_role() = 'super_admin');
