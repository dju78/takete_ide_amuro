-- 0010: Supabase Storage buckets for all uploaded media.
-- All buckets are public-read (site imagery/documents are meant to be viewed by
-- visitors) with writes restricted to authenticated staff. Swap for
-- Cloudinary/S3 later by re-implementing lib/storage.ts — the app never
-- references bucket internals directly outside that module.

insert into storage.buckets (id, name, public)
values
  ('news', 'news', true),
  ('events', 'events', true),
  ('gallery', 'gallery', true),
  ('projects', 'projects', true),
  ('archive', 'archive', true),
  ('oral-history', 'oral-history', true),
  ('people', 'people', true),
  ('families', 'families', true),
  ('oriki', 'oriki', true),
  ('tipu', 'tipu', true),
  ('documents', 'documents', true),
  ('site', 'site', true)
on conflict (id) do nothing;

do $$
declare b text;
begin
  foreach b in array array[
    'news','events','gallery','projects','archive','oral-history',
    'people','families','oriki','tipu','documents','site'
  ]
  loop
    execute format(
      'create policy "Public read %1$I bucket" on storage.objects for select using (bucket_id = %2$L)',
      b || '_read', b
    );
    execute format(
      'create policy "Staff upload %1$I bucket" on storage.objects for insert to authenticated with check (bucket_id = %2$L and is_staff())',
      b || '_write', b
    );
    execute format(
      'create policy "Staff modify %1$I bucket" on storage.objects for update to authenticated using (bucket_id = %2$L and is_staff())',
      b || '_update', b
    );
    execute format(
      'create policy "Staff delete %1$I bucket" on storage.objects for delete to authenticated using (bucket_id = %2$L and is_staff())',
      b || '_delete', b
    );
  end loop;
end $$;
