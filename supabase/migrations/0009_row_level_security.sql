-- 0009: Row Level Security.
--
-- Pattern used throughout:
--  * Published/public content  -> anon + authenticated can SELECT rows that are
--    published (status = 'published' or access_level = 'public'); Takete staff can
--    SELECT everything.
--  * Takete Staff (active row in app_memberships for app_key = 'takete') can INSERT/UPDATE/DELETE content tables.
--  * Submission/inbox tables (contact, diaspora, volunteer, nominations,
--    heritage submissions) allow anonymous INSERT only; SELECT/UPDATE/DELETE
--    is Takete staff-only, so submitted data is never publicly readable.
--  * profiles, audit_logs, site_settings, verification_records are staff-only.

-- ---------- helper: enable RLS on every relevant table ----------
do $$
declare t text;
begin
  foreach t in array array[
    'news_categories','tags','news_articles','news_article_tags',
    'events','event_media','event_speeches','event_awards','event_fundraising',
    'albums','gallery_items',
    'projects','project_images','project_updates','project_documents','project_timeline_events',
    'historical_people','traditional_rulers','traditional_council_members',
    'tipu_leadership','tipu_branches','tipu_projects','tipu_announcements','tipu_documents',
    'archive_sources','archive_items','oral_histories','verification_records','documents','media',
    'compounds','families','family_relationships','family_media','family_sources',
    'family_representatives','oriki','oriki_media','oriki_sources','heritage_submissions',
    'diaspora_members','contact_messages','volunteer_submissions','community_profile_nominations',
    'site_settings','announcements','audit_logs'
  ]
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- ---------- published/public content tables ----------
-- (table, published-condition)
do $$
declare
  rec record;
begin
  for rec in (
    select * from (values
      ('news_categories', 'true'),
      ('tags', 'true'),
      ('news_articles', 'status = ''published'''),
      ('news_article_tags', 'true'),
      ('events', 'status = ''published'''),
      ('event_media', 'true'),
      ('event_speeches', 'true'),
      ('event_awards', 'true'),
      ('event_fundraising', 'true'),
      ('albums', 'true'),
      ('gallery_items', 'status = ''published'''),
      ('projects', 'true'),
      ('project_images', 'true'),
      ('project_updates', 'true'),
      ('project_documents', 'true'),
      ('project_timeline_events', 'true'),
      ('historical_people', 'status = ''published'''),
      ('traditional_rulers', 'true'),
      ('traditional_council_members', 'true'),
      ('tipu_leadership', 'true'),
      ('tipu_branches', 'true'),
      ('tipu_projects', 'true'),
      ('tipu_announcements', 'status = ''published'''),
      ('tipu_documents', 'true'),
      ('archive_sources', 'true'),
      ('archive_items', 'status = ''published'' and access_level = ''public'''),
      ('oral_histories', 'status = ''published'''),
      ('documents', 'true'),
      ('compounds', 'status = ''published'''),
      ('families', 'status = ''published'''),
      ('family_relationships', 'true'),
      ('family_media', 'publication_permission = true'),
      ('oriki', 'status = ''published'' and publication_permission = true'),
      ('oriki_media', 'true'),
      ('announcements', 'is_active = true and current_date between start_date and coalesce(end_date, current_date)')
    ) as t(tbl, cond)
  ) loop
    execute format(
      'create policy "Public can view published %1$I" on %1$I for select using (%2$s or is_takete_staff())',
      rec.tbl, rec.cond
    );
    execute format(
      'create policy "Staff manage %1$I" on %1$I for all using (is_takete_staff()) with check (is_takete_staff())',
      rec.tbl
    );
  end loop;
end $$;

-- Media library and family/oriki sources: staff-only (not directly public-facing lists).
create policy "Staff manage media" on media for all using (is_takete_staff()) with check (is_takete_staff());
create policy "Staff manage family_sources" on family_sources for all using (is_takete_staff()) with check (is_takete_staff());
create policy "Staff manage oriki_sources" on oriki_sources for all using (is_takete_staff()) with check (is_takete_staff());
create policy "Staff manage family_representatives" on family_representatives for all using (is_takete_staff()) with check (is_takete_staff());
create policy "Staff view verification_records" on verification_records for all using (is_takete_staff()) with check (is_takete_staff());

-- ---------- submission / inbox tables: public insert, staff-only read/manage ----------
do $$
declare t text;
begin
  foreach t in array array[
    'diaspora_members', 'contact_messages', 'volunteer_submissions',
    'community_profile_nominations', 'heritage_submissions'
  ]
  loop
    execute format('create policy "Anyone can submit to %1$I" on %1$I for insert with check (true)', t);
    execute format('create policy "Staff manage %1$I" on %1$I for select using (is_takete_staff())', t);
    execute format('create policy "Staff update %1$I" on %1$I for update using (is_takete_staff())', t);
    execute format('create policy "Staff delete %1$I" on %1$I for delete using (is_takete_staff())', t);
  end loop;
end $$;

-- ---------- system tables ----------
create policy "Public can read site settings" on site_settings for select using (true);
create policy "Admins update site settings" on site_settings for update using (is_takete_admin());

create policy "Staff read audit logs" on audit_logs for select using (is_takete_staff());
create policy "System inserts audit logs" on audit_logs for insert with check (is_takete_staff());
