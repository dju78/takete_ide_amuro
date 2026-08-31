-- 0012: Editor overrides for the checked-in community media library.
--
-- The media files themselves ship with the application under public/ (see
-- docs/IMAGE_MANIFEST.md) and their baseline metadata lives in
-- lib/media/community-media.ts. That keeps the site correct with no database
-- at all, but it would mean a redeploy just to fix a caption — so this table
-- carries per-item editor overrides that are merged over the baseline at read
-- time by lib/data/community-media.ts.
--
-- Every column is nullable: a NULL means "no override, use the baseline value".
-- `media_key` is the stable id from the registry, not a foreign key, because
-- the authoritative list of items is code, not data.

create table community_media_overrides (
  media_key text primary key,
  title text,
  description text,
  alt_text text,
  category text,
  event_label text,
  branch text,
  event_date date,
  event_period text,
  location text,
  featured boolean,
  published boolean,
  -- Names may only be filled in once the community has verified them and
  -- confirmed publication is appropriate — see docs/SECURITY.md and the
  -- privacy note in docs/CONTENT_GUIDE.md.
  verified_names text,
  verification_status text check (verification_status in ('verified', 'community-record', 'pending-verification')),
  verification_note text,
  updated_by uuid references profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger community_media_overrides_set_updated_at
  before update on community_media_overrides
  for each row execute function set_updated_at();

alter table community_media_overrides enable row level security;

-- Overrides describe publicly visible media, so they are publicly readable;
-- only staff may write them.
create policy "Public can view community_media_overrides"
  on community_media_overrides for select using (true);

create policy "Staff manage community_media_overrides"
  on community_media_overrides for all using (is_takete_staff()) with check (is_takete_staff());
