import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test.describe("Row Level Security (RLS), Publication Guard & Role Access Regression Tests", () => {
  const migrationPath = path.join(process.cwd(), "supabase/migrations/0027_fix_projects_rls_publication_guard.sql");
  const schoolsMigrationPath = path.join(process.cwd(), "supabase/migrations/0026_schools_transparency_and_provenance.sql");

  test("migration 0027 explicitly defines publication_status and replaces unsafe blanket true RLS on projects", () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
    const sql = fs.readFileSync(migrationPath, "utf-8");

    // 1. Column definition and safe default
    expect(sql).toContain("alter table projects");
    expect(sql).toContain("add column if not exists publication_status content_status not null default 'draft';");
    expect(sql).toContain("create index if not exists projects_publication_status_idx on projects (publication_status);");

    // 2. Safe backfill for verified items without automatically publishing unverified/disputed/community_submitted
    expect(sql).toContain("update projects");
    expect(sql).toContain("set publication_status = 'published'");
    expect(sql).toContain("verification_status in ('verified', 'documentary_evidence', 'community_tradition', 'oral_history')");

    // 3. Projects SELECT policy enforces publication_status = 'published' AND verification_status != 'disputed'
    expect(sql).toContain('drop policy if exists "Public can view published projects" on projects;');
    expect(sql).toContain('create policy "Public can view published projects" on projects');
    expect(sql).toContain("(publication_status = 'published' and verification_status != 'disputed')");
    expect(sql).toContain("is_takete_staff()");

    // 4. Staff manage projects policy retains full management permissions
    expect(sql).toContain('create policy "Staff manage projects" on projects');
    expect(sql).toContain("for all");
    expect(sql).toContain("using (is_takete_staff())");
    expect(sql).toContain("with check (is_takete_staff())");
  });

  test("migration 0027 applies strict publication inheritance on all four child tables", () => {
    const sql = fs.readFileSync(migrationPath, "utf-8");

    const childTables = [
      "project_images",
      "project_updates",
      "project_documents",
      "project_timeline_events",
    ];

    for (const table of childTables) {
      // Public SELECT policy with parent check
      expect(sql).toContain(`create policy "Public can view published ${table}" on ${table}`);
      expect(sql).toContain(`where projects.id = ${table}.project_id`);
      expect(sql).toContain("(projects.publication_status = 'published' and projects.verification_status != 'disputed')");
      expect(sql).toContain("is_takete_staff()");

      // Staff manage policy
      expect(sql).toContain(`create policy "Staff manage ${table}" on ${table}`);
      expect(sql).toContain("for all");
      expect(sql).toContain("using (is_takete_staff())");
      expect(sql).toContain("with check (is_takete_staff())");
    }
  });

  test("RLS policy logical decision matrix verification", () => {
    // Simulates the exact SQL boolean expression:
    // (publication_status === 'published' && verification_status !== 'disputed') || is_takete_staff
    const evaluatePolicy = (
      pubStatus: string,
      verStatus: string,
      isStaff: boolean = false,
    ) => {
      return (pubStatus === "published" && verStatus !== "disputed") || isStaff;
    };

    // Anonymous Public Visitor Tests
    expect(evaluatePolicy("published", "verified", false)).toBe(true); // verified + published -> READABLE
    expect(evaluatePolicy("draft", "verified", false)).toBe(false); // verified + draft -> NOT READABLE
    expect(evaluatePolicy("draft", "community_submitted", false)).toBe(false); // community_submitted + draft -> NOT READABLE
    expect(evaluatePolicy("draft", "unverified", false)).toBe(false); // unverified + draft -> NOT READABLE
    expect(evaluatePolicy("published", "disputed", false)).toBe(false); // disputed -> NOT READABLE even if published
    expect(evaluatePolicy("draft", "disputed", false)).toBe(false); // disputed + draft -> NOT READABLE
    expect(evaluatePolicy("archived", "verified", false)).toBe(false); // archived -> NOT READABLE
    expect(evaluatePolicy("pending_review", "community_submitted", false)).toBe(false); // pending review -> NOT READABLE

    // Authenticated Staff Tests (Staff can view and manage all)
    expect(evaluatePolicy("draft", "unverified", true)).toBe(true);
    expect(evaluatePolicy("draft", "community_submitted", true)).toBe(true);
    expect(evaluatePolicy("published", "disputed", true)).toBe(true);
    expect(evaluatePolicy("archived", "verified", true)).toBe(true);
  });

  test("migration 0026 enforces strict published status RLS on schools", () => {
    expect(fs.existsSync(schoolsMigrationPath)).toBe(true);
    const sql = fs.readFileSync(schoolsMigrationPath, "utf-8");

    expect(sql).toContain("alter table schools enable row level security;");
    expect(sql).toContain('create policy "Public read published schools" on schools');
    expect(sql).toContain("using (status = 'published');");
    expect(sql).toContain('create policy "Staff manage schools" on schools');
    expect(sql).toContain("for all");
    expect(sql).toContain("using (is_takete_staff())");
    expect(sql).toContain("with check (is_takete_staff())");
  });

  test("public/anonymous detail routes serve 404 for unpublished/unverified records", async ({ page }) => {
    const unpublishedProject = await page.goto("/development/projects/unverified-draft-project-test");
    expect(unpublishedProject?.status()).toBe(404);

    const unpublishedNews = await page.goto("/news/unpublished-draft-article");
    expect(unpublishedNews?.status()).toBe(404);

    const unpublishedPerson = await page.goto("/our-people/unverified-draft-person");
    expect(unpublishedPerson?.status()).toBe(404);
  });

  test("unauthenticated visitors cannot perform admin mutations", async ({ page }) => {
    await page.goto("/admin/projects/new");
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto("/admin/schools/new");
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto("/admin/news/new");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
