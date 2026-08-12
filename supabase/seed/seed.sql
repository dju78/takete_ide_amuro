-- Safe, non-fabricated seed data: taxonomies only. No people, rulers, events,
-- projects, families or Oríkì are seeded — those require verified community
-- input via the admin portal. See docs/HISTORICAL_VERIFICATION.md.

insert into news_categories (name, slug) values
  ('Community', 'community'),
  ('Development', 'development'),
  ('Heritage', 'heritage'),
  ('Takete-Ide Day', 'takete-ide-day'),
  ('Education', 'education'),
  ('Health', 'health'),
  ('Diaspora', 'diaspora'),
  ('Announcements', 'announcements')
on conflict (slug) do nothing;

insert into tags (name, slug) values
  ('Culture', 'culture'),
  ('Youth', 'youth'),
  ('Infrastructure', 'infrastructure'),
  ('Diaspora', 'diaspora'),
  ('Faith', 'faith'),
  ('Education', 'education')
on conflict (slug) do nothing;

insert into albums (title, slug, category, description) values
  ('Takete-Ide Day', 'takete-ide-day', 'Takete-Ide Day', 'Photographs from annual Takete-Ide Day celebrations.'),
  ('Community Life', 'community-life', 'Community Life', 'Everyday moments from Takete-Ide Amuro.'),
  ('Traditional Institution', 'traditional-institution', 'Traditional Institution', 'The Olude, chiefs and traditional ceremonies.'),
  ('Children & Cultural Heritage', 'children-cultural-heritage', 'Children & Cultural Heritage', 'Cultural processions and heritage passed to the next generation.'),
  ('Development', 'development', 'Development', 'Community-led development projects.'),
  ('Historical Archive', 'historical-archive', 'Historical Archive', 'Archival photographs of Takete-Ide.')
on conflict (slug) do nothing;
