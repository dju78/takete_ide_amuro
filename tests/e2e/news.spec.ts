import { test, expect } from "@playwright/test";

/**
 * The newsroom.
 *
 * With no Supabase project connected there are no articles, which is exactly the
 * condition worth pinning down: the page must say so plainly rather than invent
 * filler, and nothing that is not a published article may appear.
 */

test.describe("Newsroom", () => {
  test("renders with an honest empty state rather than placeholder articles", async ({ page }) => {
    await page.goto("/news");
    await expect(page.getByRole("heading", { name: "News", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "No news published yet" })).toBeVisible();
    await expect(
      page.getByText(/Nothing is drafted automatically — every article is written and approved/),
    ).toBeVisible();
    // No article cards, and no lead article, when there is nothing published.
    await expect(page.locator('a[href^="/news/"]')).toHaveCount(0);
  });

  test("category filter marks the active selection", async ({ page }) => {
    await page.goto("/news");
    const all = page.getByRole("link", { name: "All", exact: true });
    await expect(all).toBeVisible();
    await expect(all).toHaveClass(/bg-purple-600/);
  });

  test("searching reports what was searched for", async ({ page }) => {
    await page.goto("/news?q=centenary");
    await expect(page.getByText(/matching\s+“centenary”/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "No articles match that filter" })).toBeVisible();
  });

  test("an unpublished or unknown article is not served", async ({ page }) => {
    const res = await page.goto("/news/some-unpublished-draft");
    expect(res?.status()).toBe(404);
  });

  test("the newsroom is reachable from the primary navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("button", { name: "News & Events" }).hover();
    await nav.getByRole("link", { name: /^News/ }).first().click();
    await expect(page).toHaveURL(/\/news$/);
  });

  test("no draft, pending or archived article leaks into the sitemap", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    // The sitemap is built from the published-only query, so with nothing
    // published there must be no article URLs at all.
    expect(xml).not.toMatch(/<loc>[^<]*\/news\/[^<]+<\/loc>/);
    // The newsroom index itself is a real page and should be listed.
    expect(xml).toMatch(/<loc>[^<]*\/news<\/loc>/);
  });
});
