-- ---------- Centenary Live Broadcast Hub (/live) ----------
--
-- Single-row table holding PUBLIC viewing information for the live page:
-- YouTube video ID, public platform links, manually-set status and replays.
--
-- This table is publicly readable. It must NEVER hold stream keys, RTMP
-- addresses, passwords, access tokens or private management URLs — the
-- application validator rejects such values, and the check constraints below
-- add a second line of defence for the obvious cases.

create table if not exists live_broadcast_settings (
  id boolean primary key default true constraint live_broadcast_settings_singleton check (id),
  title text,
  video_id text,
  status text not null default 'scheduled'
    constraint live_broadcast_status_valid check (status in ('scheduled', 'live', 'interrupted', 'ended')),
  status_message text,
  scheduled_start timestamptz,
  chat_enabled boolean not null default true,
  youtube_url text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  replays jsonb not null default '[]'::jsonb
    constraint live_broadcast_replays_array check (jsonb_typeof(replays) = 'array'),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint live_broadcast_no_ingest_urls check (
    coalesce(video_id, '') !~* 'rtmp' and
    coalesce(youtube_url, '') !~* '(rtmp|stream_?key|studio\.youtube\.com)' and
    coalesce(facebook_url, '') !~* '(rtmp|stream_?key|live/producer)' and
    coalesce(instagram_url, '') !~* '(rtmp|stream_?key)' and
    coalesce(tiktok_url, '') !~* '(rtmp|stream_?key)'
  )
);

alter table live_broadcast_settings enable row level security;

drop policy if exists "Public can view live_broadcast_settings" on live_broadcast_settings;
create policy "Public can view live_broadcast_settings"
  on live_broadcast_settings for select using (true);

drop policy if exists "Staff manage live_broadcast_settings" on live_broadcast_settings;
create policy "Staff manage live_broadcast_settings"
  on live_broadcast_settings for all using (is_takete_staff()) with check (is_takete_staff());
