-- 0017: Widen project categories, and align news categories with the site's sections.
--
-- The development section now covers areas the original eight categories could
-- not express — security (the Security Trust Fund), the town hall, community
-- lighting, palace works and environment — all of which appear in the community
-- record. Rather than forcing them into "civic_infrastructure" and losing the
-- distinction, the check constraint is widened.

alter table projects drop constraint if exists projects_category_check;
alter table projects add constraint projects_category_check check (
  category in (
    'roads_access', 'education', 'healthcare', 'water', 'electricity',
    'civic_infrastructure', 'ict_digital', 'youth_development',
    'security', 'town_hall', 'community_lighting', 'traditional_institution',
    'environment'
  )
);

-- News categories matching the site's actual sections, so a curated summary can
-- be filed where readers will look for it. Existing categories are left in place;
-- these are added only if missing.
insert into news_categories (name, slug) values
  ('TIPU', 'tipu'),
  ('Centenary', 'centenary'),
  ('Culture', 'culture'),
  ('Youth', 'youth'),
  ('Traditional Institution', 'traditional-institution')
on conflict (slug) do nothing;
