-- 0027: Fix projects & child tables RLS publication guard.
--
-- This migration introduces an explicit `publication_status` column on the projects
-- table, separating editorial publication status ('draft', 'pending_review', 'verified', 'published', 'archived')
-- from physical project progress status ('proposed', 'planning', 'in_progress', 'completed', etc.)
-- and historical claim verification status ('unverified', 'community_submitted', 'verified', 'disputed').
--
-- Row Level Security (RLS) policies:
-- 1. Public / anonymous visitors can only select projects that are genuinely published
--    (publication_status = 'published' and verification_status != 'disputed').
-- 2. Newly created / unapproved submissions default safely to 'draft' and are invisible to the public.
-- 3. Staff members (is_takete_staff()) retain complete visibility (SELECT) and
--    full management access (INSERT, UPDATE, DELETE) across all project records.
-- 4. Child tables (project_images, project_updates, project_documents, project_timeline_events)
--    inherit the parent project's publication visibility.

-- 1. Add publication_status column to projects table
alter table projects
  add column if not exists publication_status content_status not null default 'draft';

create index if not exists projects_publication_status_idx on projects (publication_status);

-- 2. Backfill existing verified historical projects to 'published' while keeping unverified/disputed as 'draft'
update projects
  set publication_status = 'published'
  where publication_status = 'draft'
    and verification_status in ('verified', 'documentary_evidence', 'community_tradition', 'oral_history');

-- 3. Correct projects table RLS
alter table projects enable row level security;

drop policy if exists "Public can view published projects" on projects;
drop policy if exists "Staff can view all projects" on projects;
drop policy if exists "Staff can insert projects" on projects;
drop policy if exists "Staff can update projects" on projects;
drop policy if exists "Staff can delete projects" on projects;
drop policy if exists "Staff manage projects" on projects;

create policy "Public can view published projects" on projects
  for select
  using (
    (publication_status = 'published' and verification_status != 'disputed')
    or is_takete_staff()
  );

create policy "Staff manage projects" on projects
  for all
  using (is_takete_staff())
  with check (is_takete_staff());

-- 4. Correct project_images table RLS
alter table project_images enable row level security;
drop policy if exists "Public can view published project_images" on project_images;
drop policy if exists "Staff manage project_images" on project_images;

create policy "Public can view published project_images" on project_images
  for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_images.project_id
        and (
          (projects.publication_status = 'published' and projects.verification_status != 'disputed')
          or is_takete_staff()
        )
    )
  );

create policy "Staff manage project_images" on project_images
  for all
  using (is_takete_staff())
  with check (is_takete_staff());

-- 5. Correct project_updates table RLS
alter table project_updates enable row level security;
drop policy if exists "Public can view published project_updates" on project_updates;
drop policy if exists "Staff manage project_updates" on project_updates;

create policy "Public can view published project_updates" on project_updates
  for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_updates.project_id
        and (
          (projects.publication_status = 'published' and projects.verification_status != 'disputed')
          or is_takete_staff()
        )
    )
  );

create policy "Staff manage project_updates" on project_updates
  for all
  using (is_takete_staff())
  with check (is_takete_staff());

-- 6. Correct project_documents table RLS
alter table project_documents enable row level security;
drop policy if exists "Public can view published project_documents" on project_documents;
drop policy if exists "Staff manage project_documents" on project_documents;

create policy "Public can view published project_documents" on project_documents
  for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_documents.project_id
        and (
          (projects.publication_status = 'published' and projects.verification_status != 'disputed')
          or is_takete_staff()
        )
    )
  );

create policy "Staff manage project_documents" on project_documents
  for all
  using (is_takete_staff())
  with check (is_takete_staff());

-- 7. Correct project_timeline_events table RLS
alter table project_timeline_events enable row level security;
drop policy if exists "Public can view published project_timeline_events" on project_timeline_events;
drop policy if exists "Staff manage project_timeline_events" on project_timeline_events;

create policy "Public can view published project_timeline_events" on project_timeline_events
  for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_timeline_events.project_id
        and (
          (projects.publication_status = 'published' and projects.verification_status != 'disputed')
          or is_takete_staff()
        )
    )
  );

create policy "Staff manage project_timeline_events" on project_timeline_events
  for all
  using (is_takete_staff())
  with check (is_takete_staff());
