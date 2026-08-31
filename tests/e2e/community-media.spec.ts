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
    await expect(page.getByText("Takete-Ide Town Hall")).toBeVisible();
    await expect(page.getByText("Authentic current photograph coming soon")).toBeVisible();
    await expect(page.getByText("Authentic landmark photograph being verified")).toBeVisible();
  });

  test("verified-place placeholders render with correct categories and distinct identities", async ({ page }) => {
    // 1. Nature & Waterways
    await page.goto("/gallery?category=Nature");
    await expect(page.getByRole("button", { name: /Obasoro Hill/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /bank of the Eba River/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Eba River.*in flow/i })).toBeVisible();
    await expect(page.getByText("Ighoruku River")).toBeVisible();
    await expect(page.getByText("Owowo River")).toBeVisible();
    const riverPlaceholders = page.getByText("Authentic river photograph coming soon");
    await expect(riverPlaceholders).toHaveCount(2);

    // 2. Places of Worship
    await page.goto("/gallery?category=Places+of+Worship");
    await expect(page.getByRole("button", { name: /First Baptist Church/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Church of God in Christ/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /ECWA/i })).toBeVisible();
    await expect(page.getByText("First Apostolic Church, Takete-Ide")).toBeVisible();
    await expect(page.getByText("Authentic community photograph coming soon")).toBeVisible();

    // 3. Education
    await page.goto("/gallery?category=Education");
    await expect(page.getByText("Takete-Ide Primary School")).toBeVisible();
    await expect(page.getByText("Government Day Secondary School, Takete-Ide")).toBeVisible();
    const schoolPlaceholders = page.getByText("Authentic school photograph coming soon");
    await expect(schoolPlaceholders).toHaveCount(2);
  });

  test("no authentic place image is reused for another distinct place", async ({ page }) => {
    await page.goto("/gallery");
    // Verify each authentic place image appears at most once in the gallery buttons
    const imgSources = await page.locator("main .grid button img").evaluateAll((imgs) =>
      imgs.map((i) => (i as HTMLImageElement).src),
    );
    const uniqueSources = new Set(imgSources);
    expect(imgSources.length).toBe(uniqueSources.size);
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

test.describe("Digital archive and oral history presentation", () => {
  test("archive index displays search, categories, and respectful empty states", async ({ page }) => {
    await page.goto("/archive");
    await expect(page.getByRole("heading", { name: "Digital Archive", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voices of Takete-Ide" })).toBeVisible();
    await expect(page.getByPlaceholder("Search the archive…")).toBeVisible();
  });

  test("oral history page preserves privacy and offers elder recommendation CTA", async ({ page }) => {
    await page.goto("/archive/oral-history");
    await expect(page.getByRole("heading", { name: "Voices of Takete-Ide", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Recommend an Elder to Interview" })).toBeVisible();
    // Verify no audio autoplays
    const audios = page.locator("audio");
    if (await audios.count() > 0) {
      const preload = await audios.first().getAttribute("preload");
      expect(preload).toBe("none");
    }
  });
});

test.describe("Responsive viewport safety and layout integrity", () => {
  const viewports = [
    { name: "mobile-320", width: 320, height: 568 },
    { name: "mobile-375", width: 375, height: 667 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "mobile-430", width: 430, height: 932 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1024", width: 1024, height: 768 },
    { name: "desktop-1440", width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`no horizontal overflow on / at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test(`no horizontal overflow on /gallery at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/gallery");
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test(`no horizontal overflow on /support at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/support");
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
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
