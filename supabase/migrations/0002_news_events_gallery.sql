-- 0002: News, tags, Takete-Ide Day events, gallery/albums.

create table news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  featured_image text,
  featured_image_alt text,
  author_id uuid references profiles (id) on delete set null,
  category_id uuid references news_categories (id) on delete set null,
  status content_status not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index news_articles_status_idx on news_articles (status, published_at desc);
create index news_articles_category_idx on news_articles (category_id);

create table news_article_tags (
  news_article_id uuid references news_articles (id) on delete cascade,
  tag_id uuid references tags (id) on delete cascade,
  primary key (news_article_id, tag_id)
);

create trigger news_articles_set_updated_at
  before update on news_articles
  for each row execute function set_updated_at();

-- Takete-Ide Day: one row per annual celebration, admin-creatable without a deploy.
create table events (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  slug text not null unique,
  theme text,
  event_date date,
  description text,
  chairman text,
  guest_information text,
  programme_document_url text,
  status content_status not null default 'draft',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger events_set_updated_at
  before update on events
  for each row execute function set_updated_at();

create table event_media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  media_type text not null check (media_type in ('photo', 'video')),
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table event_speeches (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  speaker text not null,
  title text,
  body text,
  document_url text
);

create table event_awards (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  recipient text not null,
  award_title text not null,
  description text
);

create table event_fundraising (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  purpose text not null,
  target_amount numeric(14, 2),
  amount_raised numeric(14, 2),
  currency text not null default 'NGN',
  notes text
);

-- Gallery
create table albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  description text,
  cover_image text,
  created_at timestamptz not null default now()
);

create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references albums (id) on delete set null,
  title text,
  image_url text not null,
  alt_text text not null default '',
  caption text,
  category text not null,
  event_year integer,
  status content_status not null default 'published',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index gallery_items_category_idx on gallery_items (category);
create index gallery_items_year_idx on gallery_items (event_year);
