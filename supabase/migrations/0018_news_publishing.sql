-- 0018: News publishing — featured articles, editorial dates, attribution and
-- lightweight relationships to the rest of the site.
--
-- The news schema had the editorial workflow (draft → published → archived) but
-- nothing to *do* with an article once written: no way to lead the newsroom with
-- one story, no way to record where a story came from when it is reproduced with
-- permission, and no way to connect an article to the project, branch or
-- celebration it is about.
--
-- Relationships are deliberately thin. A project gets a real foreign key because
-- projects are rows; a branch is referenced by the slug that lib/media/tipu-branches.ts
-- already treats as its stable key, and a Takete-Ide Day celebration by its year,
-- which is unique on `events`. That avoids inventing join tables for what is a
-- single optional pointer per article.
--
-- Non-destructive and backward compatible: every column is nullable or defaulted,
-- so existing rows and any application still reading the old shape are unaffected.

alter table news_articles add column if not exists is_featured boolean not null default false;

-- Attribution for a story reproduced from an external source with permission.
-- Left NULL for community-authored articles, which are attributed to the union.
alter table news_articles add column if not exists source_name text;
alter table news_articles add column if not exists source_url text;

-- Optional relationships. All nullable: an article need not be about anything.
alter table news_articles add column if not exists related_project_id uuid
  references projects (id) on delete set null;
alter table news_articles add column if not exists related_branch_slug text;
alter table news_articles add column if not exists related_event_year integer;

-- Partial index: the newsroom only ever asks for featured articles that are
-- actually published, so the index does not carry drafts.
create index if not exists news_articles_featured_idx
  on news_articles (published_at desc)
  where is_featured and status = 'published';

create index if not exists news_articles_related_branch_idx
  on news_articles (related_branch_slug)
  where related_branch_slug is not null;

-- RLS is unchanged: migration 0009 already grants public SELECT on
-- news_articles only where status = 'published', and staff-only writes. The new
-- columns inherit that policy, so a draft's relationships and source stay
-- invisible until the article itself is published.
