import { test, expect } from "@playwright/test";

/**
 * Site search.
 *
 * The assertions below deliberately use content that ships with the application
 * (the branch network, the place/landmark library, the page index) rather than
 * database rows, so the suite proves search works in the environment the site is
 * actually built and demoed in — one with no Supabase project connected.
 */

test.describe("Site search", () => {
  test("prompts before a query is entered", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("heading", { name: "Start typing to search" })).toBeVisible();
  });

  test("finds a TIPU branch and groups it under the right heading", async ({ page }) => {
    await page.goto("/search?q=ilorin");
    const branchGroup = page.getByRole("heading", { name: /TIPU Branches/ });
    await expect(branchGroup).toBeVisible();
    await expect(page.getByRole("link", { name: /TIPU Ilorin Branch/ }).first()).toBeVisible();
  });

  test("finds a branch that has no photograph — placeholders are still searchable", async ({ page }) => {
    await page.goto("/search?q=kaduna");
    await expect(page.getByRole("link", { name: /TIPU Kaduna Branch/ }).first()).toBeVisible();
  });

  test("finds a place from the community media library", async ({ page }) => {
    await page.goto("/search?q=obasoro");
    await expect(page.getByRole("heading", { name: /Places & Landmarks/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Obasoro Hill/ }).first()).toBeVisible();
  });

  test("finds key pages by name and by intent", async ({ page }) => {
    await page.goto("/search?q=centenary");
    await expect(page.getByRole("heading", { name: /^Pages/ })).toBeVisible();

    // "donate" appears nowhere in the Support page title — it is a keyword.
    await page.goto("/search?q=donate");
    await expect(page.getByRole("link", { name: /Support Takete-Ide/ }).first()).toBeVisible();
  });

  test("groups results by section and lets you filter to one", async ({ page }) => {
    await page.goto("/search?q=ilorin");
    const headingCount = await page.locator("main section h2").count();
    expect(headingCount).toBeGreaterThan(1);

    await page.getByRole("link", { name: /^TIPU Branches \(/ }).click();
    await expect(page).toHaveURL(/type=branch/);
    await expect(page.getByRole("heading", { name: /TIPU Branches/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Places & Landmarks/ })).toHaveCount(0);
  });

  test("reports no results honestly rather than guessing", async ({ page }) => {
    await page.goto("/search?q=zzzznotathing");
    await expect(page.getByRole("heading", { name: /No results for/ })).toBeVisible();
  });

  test("a query containing PostgREST filter syntax does not break the page", async ({ page }) => {
    // Commas and parentheses delimit PostgREST `or=` filters; unsanitised they
    // would change the query's meaning or error the request.
    const res = await page.goto("/search?q=" + encodeURIComponent("ilorin,(branch)*"));
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Search Takete-Ide" })).toBeVisible();
  });

  test("results expose no private or internal data", async ({ page }) => {
    for (const q of ["ilorin", "kaduna", "obasoro", "support", "centenary"]) {
      await page.goto(`/search?q=${q}`);
      const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
      // WhatsApp-derived contact details.
      expect(text).not.toMatch(/\b0[789]\d{9}\b/);
      expect(text).not.toMatch(/\+234[\s\d]{10,}/);
      expect(text).not.toMatch(/~\s*\w+/);
      expect(text).not.toMatch(/[\w.]+@[\w.]+\.\w+/);
      // Internal provenance notes held on branch records for administrators.
      expect(text).not.toMatch(/branch-chairman listing, \d/i);
      expect(text).not.toMatch(/annual-dues\/branch notice/i);
      // The personal account that appears in the community archive.
      expect(text).not.toMatch(/\b0041531156\b/);
    }
  });

  test("search result pages are excluded from indexing", async ({ page }) => {
    await page.goto("/search?q=ilorin");
    const robots = await page.locator('head meta[name="robots"]').getAttribute("content");
    expect(robots).toMatch(/noindex/);
  });
});

test.describe("Publication guards on detail routes", () => {
  // With no database connected these rows cannot exist, so the routes must 404
  // rather than render a shell. The same query guards keep drafts, restricted
  // archive items and non-permitted Oríkì out once a database is connected.
  test("an unknown Oríkì slug is not found", async ({ page }) => {
    const res = await page.goto("/oriki/does-not-exist");
    expect(res?.status()).toBe(404);
  });

  test("an unknown archive slug is not found", async ({ page }) => {
    const res = await page.goto("/archive/does-not-exist");
    expect(res?.status()).toBe(404);
  });

  test("an unknown news slug is not found", async ({ page }) => {
    const res = await page.goto("/news/does-not-exist");
    expect(res?.status()).toBe(404);
  });
});
