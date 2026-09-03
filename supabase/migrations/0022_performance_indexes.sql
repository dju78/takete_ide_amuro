-- 0022: Performance optimization indexes for public page queries and filtering

-- Gallery items status and recency
create index if not exists gallery_items_status_created_idx
  on gallery_items (status, created_at desc);

-- Announcements active status and date range
create index if not exists announcements_active_dates_idx
  on announcements (is_active, start_date desc, end_date);

-- Takete-Ide Day events status and year ordering
create index if not exists events_status_year_idx
  on events (status, year desc);

-- Oriki records published status and display ordering
create index if not exists oriki_records_published_order_idx
  on oriki_records (published, display_order, family_origin);

-- Historical people published status and category filtering
create index if not exists historical_people_status_cat_name_idx
  on historical_people (status, category, name);

-- Projects status and recency ordering
create index if not exists projects_status_created_idx
  on projects (status, created_at desc);

-- TIPU branch updates status and date ordering
create index if not exists tipu_branch_updates_status_date_idx
  on tipu_branch_updates (status, occurs_on desc);

-- Support accounts active status and sort order
create index if not exists support_accounts_active_sort_idx
  on support_accounts (is_active, sort_order);

-- Centenary programmes display order
create index if not exists centenary_programmes_order_idx
  on centenary_programmes (display_order asc);
