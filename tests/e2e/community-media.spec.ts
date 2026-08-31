import { test, expect } from "@playwright/test";

/**
 * Covers the community media library imported from the TIPU archive: the story
 * pages it powers, the gallery categories it introduces, and the two properties
 * that keep it from wrecking the site — videos must not download until asked,
 * and no photograph may ship without alt text.
 */

test.describe("Community media story pages", () => {
  test("New Yam Festival page leads with the event and carries both videos", async ({ page }) => {
    await page.goto("/tipu/branches/ilorin");
    await expect(
      page.getByRole("heading", { name: /Celebrating Heritage: TIPU Ilorin Branch New Yam Festival/ }),
    ).toBeVisible();
    await expect(page.getByText("Ilorin, Kwara State").first()).toBeVisible();
    await expect(page.locator("video")).toHaveCount(2);
  });

  test("Lokoja branch page records the meeting date", async ({ page }) => {
    await page.goto("/tipu/branches/lokoja");
    await expect(page.getByRole("heading", { name: "TIPU Lokoja Branch", level: 1 })).toBeVisible();
    await expect(page.getByText("16 August 2026")).toBeVisible();
  });

  test("UK & Europe chapter page is reachable from the diaspora page", async ({ page }) => {
    await page.goto("/diaspora");
    await page.getByRole("link", { name: "Read the full story" }).click();
    await expect(page).toHaveURL(/\/diaspora\/uk-europe$/);
    await expect(
      page.getByRole("heading", { name: /TIPU UK & Europe Chapter Holds Inaugural Meeting/ }),
    ).toBeVisible();
  });

  test("cultural attire archive is reachable from Takete-Ide Day", async ({ page }) => {
    await page.goto("/takete-ide-day");
    await page.getByRole("link", { name: /See the attire archive/ }).click();
    await expect(page).toHaveURL(/\/takete-ide-day\/cultural-attire$/);
    await expect(
      page.getByRole("heading", { name: /Takete-Ide Day Cultural Attire — 2025/, level: 1 }),
    ).toBeVisible();
  });

  test("the 2025 attire is not presented as confirmed Centenary 2026 attire", async ({ page }) => {
    await page.goto("/takete-ide-day/cultural-attire");
    await expect(page.getByRole("heading", { name: "Centenary 2026 Official Attire" })).toBeVisible();
    await expect(page.getByText(/Information coming soon following official confirmation/)).toBeVisible();
    // The archive set must never be labelled as the confirmed 2026 attire.
    await expect(page.getByRole("heading", { name: "Official Centenary Attire", level: 1 })).toHaveCount(0);
  });

  test("branches index links every documented branch", async ({ page }) => {
    await page.goto("/tipu/branches");
    for (const href of ["/tipu/branches/lokoja", "/tipu/branches/ilorin", "/diaspora/uk-europe"]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
  });
});

test.describe("Gallery after the archive import", () => {
  test("new categories appear as filters and narrow the grid", async ({ page }) => {
    await page.goto("/gallery");
    const filters = page.getByRole("group", { name: "Filter gallery by category" });
    for (const category of ["Nature", "Places of Worship", "Culture & Events", "Diaspora"]) {
      await expect(filters.getByRole("link", { name: category, exact: true })).toBeVisible();
    }

    const allCount = await page.locator("main .grid button").count();
    await filters.getByRole("link", { name: "Places of Worship", exact: true }).click();
    await expect(page).toHaveURL(/category=Places\+of\+Worship|category=Places%20of%20Worship/);
    const filteredCount = await page.locator("main .grid button").count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(allCount);
  });

  test("lightbox opens on a photograph and closes with Escape", async ({ page }) => {
    await page.goto("/gallery?category=Nature");
    await page.locator("main .grid button").first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("every gallery photograph has non-empty alt text", async ({ page }) => {
    await page.goto("/gallery");
    const alts = await page.locator("main .grid button img").evaluateAll((imgs) =>
      imgs.map((i) => (i as HTMLImageElement).alt),
    );
    expect(alts.length).toBeGreaterThan(0);
    expect(alts.filter((a) => !a || a.trim().length < 3)).toEqual([]);
  });

  test("First Baptist Church is deduplicated in Places of Worship", async ({ page }) => {
    await page.goto("/gallery?category=Places+of+Worship");
    const baptistCards = page.getByRole("button", { name: /First Baptist Church/ });
    await expect(baptistCards).toHaveCount(1);
  });

  test("landmarks and placeholders are presented respectfully", async ({ page }) => {
    await page.goto("/gallery?category=Landmarks");
    await expect(page.getByText("Okuta Boro")).toBeVisible();
    await expect(page.getByText("Authentic landmark photograph being verified")).toBeVisible();
  });
});

test.describe("Video delivery and accessibility", () => {
  test("players are labelled, controllable and fetch nothing until played", async ({ page }) => {
    await page.goto("/development/community-at-work");
    const videos = page.locator("video");
    await expect(videos).toHaveCount(2);

    const state = await videos.evaluateAll((els) =>
      els.map((el) => {
        const v = el as HTMLVideoElement;
        return {
          preload: v.preload,
          hasPoster: Boolean(v.poster),
          controls: v.controls,
          playsInline: v.playsInline,
          label: v.getAttribute("aria-label") ?? "",
          // NETWORK_EMPTY (0) or NETWORK_IDLE (1) both mean no media bytes fetched.
          fetching: v.networkState === 2,
        };
      }),
    );
    for (const v of state) {
      expect(v.preload).toBe("none");
      expect(v.hasPoster).toBe(true);
      expect(v.controls).toBe(true);
      expect(v.playsInline).toBe(true);
      expect(v.label.length).toBeGreaterThan(3);
      expect(v.fetching).toBe(false);
    }
  });

  test("captions are declared unavailable rather than fabricated", async ({ page }) => {
    await page.goto("/development/community-at-work");
    await expect(page.getByText(/Captions are not available for this recording/).first()).toBeVisible();
    await expect(page.locator("video track")).toHaveCount(0);
  });

  test("unverified footage is not presented as a named road project", async ({ page }) => {
    await page.goto("/development/community-at-work");
    await expect(page.getByRole("heading", { name: "Community at Work", level: 1 })).toBeVisible();
    await expect(
      page.getByText(/The specific road and the exact nature of the work are not yet confirmed/),
    ).toBeVisible();
  });

  test("the development index shows poster cards, not loaded videos", async ({ page }) => {
    await page.goto("/development");
    await expect(page.getByRole("heading", { name: "Community Footage" })).toBeVisible();
    await expect(page.locator("video")).toHaveCount(0);
  });
});

test.describe("Homepage media selection", () => {
  test("leads with place, culture and diaspora rather than an event album", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "The Land We Come From" })).toBeVisible();
    await expect(page.locator('a[href="/diaspora/uk-europe"]').first()).toBeVisible();
    // No video element anywhere on the homepage — nothing multi-megabyte on first paint.
    await expect(page.locator("video")).toHaveCount(0);
  });
});
