-- 0023: Google Photos extended community archive settings
alter table site_settings
  add column if not exists google_photos_url text,
  add column if not exists google_photos_enabled boolean not null default true,
  add column if not exists google_photos_title text not null default 'Explore More Takete-Ide Photographs',
  add column if not exists google_photos_description text not null default 'Explore more photographs documenting the people, places, celebrations, institutions and community life of Takete-Ide in our extended Google Photos archive.';
