import { test, expect } from "@playwright/test";

test.describe("Primary navigation", () => {
  test("Explore dropdown surfaces Families & Oríkì", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await primaryNav.getByRole("button", { name: "Explore" }).hover();
    const familiesLink = primaryNav.getByRole("link", { name: /Families & Oríkì/ });
    await expect(familiesLink).toBeVisible();
    await familiesLink.click();
    await expect(page).toHaveURL(/\/families$/);
  });

  test("Explore dropdown also surfaces Oríkì Archive and Voices of Takete-Ide", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await primaryNav.getByRole("button", { name: "Explore" }).hover();
    await expect(primaryNav.getByRole("link", { name: "Oríkì Archive" })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Voices of Takete-Ide" })).toBeVisible();
  });

  test("every mega-menu group opens and reaches its section", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    for (const [group, sampleItem] of [
      ["About", "Our History"],
      ["Explore", "Digital Archive"],
      ["Community", "The TIPU Network"],
      ["News & Events", "Takete-Ide Day"],
      ["Centenary 2026", "Cultural Attire"],
      ["Support", "Security Trust Fund"],
    ] as const) {
      await primaryNav.getByRole("button", { name: group, exact: true }).hover();
      await expect(
        primaryNav.getByRole("link", { name: new RegExp(`^${sampleItem}`) }).first(),
      ).toBeVisible();
    }
  });

  test("individual branches are never listed in the primary navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await primaryNav.getByRole("button", { name: "Community", exact: true }).hover();
    // Twenty branches belong on the network page, not in a dropdown.
    for (const branch of ["Kaduna", "Port Harcourt", "Minna", "Osun"]) {
      await expect(primaryNav.getByRole("link", { name: new RegExp(`^TIPU ${branch}`) })).toHaveCount(0);
    }
  });

  test("mobile accordion drawer expands a group and navigates to an item", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "News & Events" }).click();
    const link = dialog.getByRole("link", { name: "Weather" });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/weather$/);
  });
});

test.describe("Search", () => {
  test("search page shows a prompt with no query", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText("Start typing to search")).toBeVisible();
  });

  // This previously asserted that "takete" returned nothing — true only because
  // search was a title-only ilike against an empty database. The intent was that
  // searching never errors, so that is what it now checks, on both outcomes.
  test("a term that matches renders results rather than erroring", async ({ page }) => {
    const res = await page.goto("/search?q=takete");
    expect(res?.status()).toBe(200);
    await expect(page.getByText(/results? for/)).toBeVisible();
    await expect(page.getByText(/No results for/)).toHaveCount(0);
  });

  test("a term that matches nothing shows the no-results state", async ({ page }) => {
    const res = await page.goto("/search?q=qqzzxx-no-such-term");
    expect(res?.status()).toBe(200);
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

  // The gallery is no longer empty without a database: the community media
  // library ships with the application, so photographs render either way. The
  // empty state now only appears for a category that genuinely has nothing.
  test("gallery renders the imported community archive without a database", async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.getByRole("heading", { name: "Gallery", level: 1 })).toBeVisible();
    expect(await page.locator("main .grid button").count()).toBeGreaterThan(0);
  });

  test("a category with no photographs still shows the empty state", async ({ page }) => {
    await page.goto("/gallery?category=Historical%20Archive");
    await expect(page.getByText(/gallery is being curated/)).toBeVisible();
  });
});

test.describe("Admin", () => {
  test("login form surfaces a graceful error when Supabase isn't configured", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.locator("form [role='alert']")).toBeVisible({ timeout: 10000 });
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
