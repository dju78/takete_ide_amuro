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
  published_tables text[][] := array[
    array['news_categories', 'true'],
    array['tags', 'true'],
    array['news_articles', 'status = ''published'''],
    array['news_article_tags', 'true'],
    array['events', 'status = ''published'''],
    array['event_media', 'true'],
    array['event_speeches', 'true'],
    array['event_awards', 'true'],
    array['event_fundraising', 'true'],
    array['albums', 'true'],
    array['gallery_items', 'status = ''published'''],
    array['projects', 'true'],
    array['project_images', 'true'],
    array['project_updates', 'true'],
    array['project_documents', 'true'],
    array['project_timeline_events', 'true'],
    array['historical_people', 'status = ''published'''],
    array['traditional_rulers', 'true'],
    array['traditional_council_members', 'true'],
    array['tipu_leadership', 'true'],
    array['tipu_branches', 'true'],
    array['tipu_projects', 'true'],
    array['tipu_announcements', 'status = ''published'''],
    array['tipu_documents', 'true'],
    array['archive_sources', 'true'],
    array['archive_items', 'status = ''published'' and access_level = ''public'''],
    array['oral_histories', 'status = ''published'''],
    array['documents', 'true'],
    array['compounds', 'status = ''published'''],
    array['families', 'status = ''published'''],
    array['family_relationships', 'true'],
    array['family_media', 'publication_permission = true'],
    array['oriki', 'status = ''published'' and publication_permission = true'],
    array['oriki_media', 'true'],
    array['announcements', 'is_active = true and current_date between start_date and coalesce(end_date, current_date)']
  ];
begin
  foreach rec in array published_tables loop
    execute format(
      'create policy "Public can view published %1$I" on %1$I for select using (%2$s or is_takete_staff())',
      rec[1], rec[2]
    );
    execute format(
      'create policy "Staff manage %1$I" on %1$I for all using (is_takete_staff()) with check (is_takete_staff())',
      rec[1]
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
