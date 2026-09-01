-- ---------- Centenary Settings & Programme Schema Alignment ----------

-- 1. Ensure centenary_settings has all current admin fields
alter table if exists centenary_settings
  add column if not exists event_dates text,
  add column if not exists main_event_time text,
  add column if not exists theme text;

-- 2. Create centenary_programmes table for multi-day schedule
create table if not exists centenary_programmes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  day_number int not null default 1,
  day_label text not null,
  date date not null,
  date_label text,
  start_time text,
  end_time text,
  time_label text,
  venue text,
  description text,
  category text,
  theme text,
  is_grand_celebration boolean default false,
  confirmed boolean default false,
  display_order int default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table centenary_programmes enable row level security;
create policy "Public can view centenary_programmes" on centenary_programmes for select using (true);
create policy "Staff manage centenary_programmes" on centenary_programmes for all using (is_takete_staff()) with check (is_takete_staff());
