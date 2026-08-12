import { test, expect } from "@playwright/test";

test.describe("Heritage navigation prominence", () => {
  test("Heritage dropdown surfaces Families & Oríkì at the top level", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await primaryNav.getByRole("button", { name: "Heritage" }).hover();
    const familiesLink = primaryNav.getByRole("link", { name: /Families & Oríkì/ });
    await expect(familiesLink).toBeVisible();
    await familiesLink.click();
    await expect(page).toHaveURL(/\/families$/);
  });

  test("Heritage dropdown also surfaces Oríkì Archive and Voices of Takete-Ide", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await primaryNav.getByRole("button", { name: "Heritage" }).hover();
    await expect(primaryNav.getByRole("link", { name: "Oríkì Archive" })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Voices of Takete-Ide" })).toBeVisible();
  });
});

test.describe("Search", () => {
  test("search page shows a prompt with no query", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText("Start typing to search")).toBeVisible();
  });

  test("searching gracefully shows no-results rather than erroring", async ({ page }) => {
    await page.goto("/search?q=takete");
    await expect(page.getByText(/No results for/)).toBeVisible();
  });

  test("header search icon links to the search page", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("link", { name: "Search the site" }).click();
    await expect(page).toHaveURL(/\/search$/);
  });
});

test.describe("Archive & Gallery filters", () => {
  test("archive category filter updates the URL", async ({ page }) => {
    await page.goto("/archive");
    await page.getByRole("link", { name: "photograph" }).click();
    await expect(page).toHaveURL(/category=photograph/);
  });

  test("gallery page renders with an empty state when no photographs are published", async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.getByRole("heading", { name: "Gallery", level: 1 })).toBeVisible();
    await expect(page.getByText(/gallery is being curated/)).toBeVisible();
  });
});

test.describe("Admin", () => {
  test("login form surfaces a graceful error when Supabase isn't configured", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
  });

  test("admin settings and news routes also redirect unauthenticated visitors", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto("/admin/news/new");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("Families & Oríkì empty states", () => {
  test("Oríkì directory shows an honest empty state, never fabricated content", async ({ page }) => {
    await page.goto("/oriki");
    await expect(page.getByText(/Oríkì archive is just beginning/)).toBeVisible();
  });

  test("Traditional Institution shows an honest empty state for unconfirmed rulers", async ({ page }) => {
    await page.goto("/heritage/traditional-institution");
    await expect(page.getByText(/Awaiting confirmation from the traditional council/)).toBeVisible();
  });
});
