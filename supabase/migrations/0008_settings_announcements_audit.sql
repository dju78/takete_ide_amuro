-- 0008: Site settings (singleton), announcements, audit log.

create table site_settings (
  id boolean primary key default true constraint site_settings_singleton check (id),
  site_title text not null default 'Takete-Ide Amuro',
  tagline text not null default 'Heritage • Unity • Progress',
  contact_email text,
  contact_phone text,
  social_links jsonb not null default '{}',
  footer_text text,
  community_logo_url text,
  tipu_logo_url text,
  default_seo_title text not null default 'Takete-Ide Amuro | Heritage, Unity, Progress',
  default_seo_description text not null default 'The official digital home of Takete-Ide Amuro, Mopamuro LGA, Kogi State, Nigeria.',
  homepage_featured jsonb not null default '{}',
  weather_enabled boolean not null default true,
  weather_location_label text not null default 'Takete-Ide Amuro',
  weather_location_key text not null default '923542',
  weather_forecast_url text not null default 'https://www.accuweather.com/en/ng/takete-ide/923542/weather-forecast/923542',
  weather_show_on_homepage boolean not null default true,
  weather_show_in_header boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles (id) on delete set null
);

insert into site_settings (id) values (true);

create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  start_date date not null default current_date,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on audit_logs (entity_type, entity_id);
create index audit_logs_created_idx on audit_logs (created_at desc);
