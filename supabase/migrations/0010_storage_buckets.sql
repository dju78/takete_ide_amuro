-- 0010: Supabase Storage buckets for all uploaded media with Takete-namespacing and privacy classification.
--
-- Public-media buckets: public = true (news, events, gallery, projects, tipu, site, people).
-- Controlled/private-by-default buckets: public = false (archive, oral-history, families, oriki, documents).

insert into storage.buckets (id, name, public)
values
  ('takete-news', 'takete-news', true),
  ('takete-events', 'takete-events', true),
  ('takete-gallery', 'takete-gallery', true),
  ('takete-projects', 'takete-projects', true),
  ('takete-tipu', 'takete-tipu', true),
  ('takete-site', 'takete-site', true),
  ('takete-people', 'takete-people', true),
  ('takete-archive', 'takete-archive', false),
  ('takete-oral-history', 'takete-oral-history', false),
  ('takete-families', 'takete-families', false),
  ('takete-oriki', 'takete-oriki', false),
  ('takete-documents', 'takete-documents', false)
on conflict (id) do nothing;

-- Public read policy for public media buckets ONLY:
create policy "Public read takete public buckets" on storage.objects for select
  using (bucket_id in ('takete-news', 'takete-events', 'takete-gallery', 'takete-projects', 'takete-tipu', 'takete-site', 'takete-people'));

-- Controlled / Staff-only read policy for private-by-default buckets:
create policy "Staff read takete controlled buckets" on storage.objects for select
  using (bucket_id in ('takete-archive', 'takete-oral-history', 'takete-families', 'takete-oriki', 'takete-documents') and is_takete_staff());

-- Staff upload policy for all Takete buckets:
create policy "Takete staff upload to takete buckets" on storage.objects for insert to authenticated
  with check (bucket_id like 'takete-%' and is_takete_staff());

-- Staff modify policy for all Takete buckets:
create policy "Takete staff modify takete buckets" on storage.objects for update to authenticated
  using (bucket_id like 'takete-%' and is_takete_staff());

-- Staff delete policy for all Takete buckets:
create policy "Takete staff delete from takete buckets" on storage.objects for delete to authenticated
  using (bucket_id like 'takete-%' and is_takete_staff());
