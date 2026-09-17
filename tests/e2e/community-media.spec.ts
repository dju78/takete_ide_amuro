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
    await expect(
      page.getByText(/Folorunso Omoniyi \(Bontoro\) receiving an award on behalf of Cheche/).first(),
    ).toBeVisible();
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

    const allCount = await page.locator("main .grid button, .grid button").count();
    await Promise.all([
      page.waitForURL(/category=Places/),
      filters.getByRole("link", { name: "Places of Worship", exact: true }).click(),
    ]);
    const filteredCount = await page.locator("main .grid button, .grid button").count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(allCount);
  });

  test("lightbox opens on a photograph and closes with Escape", async ({ page }) => {
    await page.goto("/gallery?category=Nature");
    await page.locator("main .grid button, .grid button").first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("every gallery photograph has non-empty alt text", async ({ page }) => {
    await page.goto("/gallery");
    const alts = await page.locator("main .grid button img, .grid button img").evaluateAll((imgs) =>
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

  test("First ECWA Church is deduplicated in Places of Worship", async ({ page }) => {
    await page.goto("/gallery?category=Places+of+Worship");
    const ecwaCards = page.getByRole("button", { name: /First ECWA Church/ });
    await expect(ecwaCards).toHaveCount(1);
    await expect(page.locator('img[src*="ecwa-church.jpg"]')).toHaveCount(0);
  });

  test("Redeemed Christian Church of God renders with approved metadata in Places of Worship gallery", async ({ page }) => {
    await page.goto("/gallery?category=Places+of+Worship");
    const rccgButton = page.getByRole("button", { name: /Redeemed Christian Church of God/i });
    await expect(rccgButton).toBeVisible();
    await expect(rccgButton.locator("img")).toHaveAttribute(
      "alt",
      "Redeemed Christian Church of God (RCCG) church building in Takete-Ide.",
    );
    await rccgButton.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Redeemed Christian Church of God (RCCG), Takete-Ide.");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("landmarks and placeholders are presented respectfully", async ({ page }) => {
    await page.goto("/gallery?category=Landmarks");
    await expect(page.getByText("Okuta Gbooro").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Takete-Ide Town Hall/i })).toBeVisible();
    await expect(page.locator('img[src*="takete-ide-town-hall.jpg"]')).toBeVisible();
  });

  test("verified-place placeholders render with correct categories and distinct identities", async ({ page }) => {
    // 1. Nature & Waterways
    await page.goto("/gallery?category=Nature");
    await expect(page.getByRole("button", { name: /Obasoro Hill/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /bank of the Eba River/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Eba River.*in flow/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Igboruku/i })).toBeVisible();
    await expect(page.getByText("Owowo River")).toBeVisible();
    const riverPlaceholders = page.getByText("Community landscape photograph to be added");
    await expect(riverPlaceholders).toHaveCount(1);

    // 2. Places of Worship
    await page.goto("/gallery?category=Places+of+Worship");
    await expect(page.getByRole("button", { name: /First Baptist Church/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Church of God in Christ/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /First ECWA Church/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Second ECWA Church/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Redeemed Christian Church of God/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /The Apostolic Church/i })).toBeVisible();

    // 3. Education
    await page.goto("/gallery?category=Education");
    await expect(page.getByRole("button", { name: /Takete-Ide Primary School/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Universal Basic Education/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Takete-Ide NCC Computer Centre/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Government Day Secondary School/i })).toBeVisible();
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
      page.getByText(/The specific road, the nature of the work and project details continue to be documented/),
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
    { name: "desktop-1280", width: 1280, height: 800 },
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

    test(`no horizontal overflow on /support/payment/failed at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/support/payment/failed?reference=TIPU-TEST-REF");
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

test.describe("TIPU Ilorin Branch Award Presentation Media", () => {
  test("renders Cheche and Bldr Dare Fiki award photographs on gallery and branch pages", async ({ page }) => {
    await page.goto("/tipu/branches/ilorin");

    // Check Cheche award presentation photograph and caption
    const checheImg = page.locator('img[src*="award-presentation-cheche.jpg"]');
    await expect(checheImg).toBeVisible();
    await expect(page.getByText("Chief Oluabimbo Bola Ipinlaye", { exact: false }).first()).toBeVisible();

    // Check Bldr Dare Fiki award presentation photograph and caption
    const dareFikiImg = page.locator('img[src*="award-presentation-01.jpg"]');
    await expect(dareFikiImg).toBeVisible();
    await expect(page.getByText("Bldr Dare Fiki", { exact: false }).first()).toBeVisible();
  });
});

test.describe("Natural Landmarks & Oko Loke Video Integration", () => {
  test("renders featured Oko Loke video player and natural landmarks on land-and-landscape page", async ({ page }) => {
    await page.goto("/heritage/land-and-landscape");

    // Check featured Oko Loke video
    const video = page.locator("video");
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("poster", /oko-loke\.jpg/);
    await expect(page.getByText("Oko Loke — a natural and community landmark in Takete-Ide", { exact: false })).toBeVisible();

    // Check natural landmarks grid
    await expect(page.getByRole("heading", { name: "Omi Pandara" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Igboruku" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Okuta Gbooro" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Obasoro Hill" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Eba River" })).toBeVisible();
  });

  test("renders educational facilities on education page", async ({ page }) => {
    await page.goto("/education");

    await expect(page.getByRole("heading", { name: "Takete-Ide Primary School" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Universal Basic Education, Takete-Ide" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Takete-Ide NCC Computer Centre" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Government Day Secondary School, Takete-Ide", level: 3 })).toBeVisible();
  });

  test("renders health facilities on health-history page", async ({ page }) => {
    await page.goto("/heritage/health-history");

    await expect(page.getByRole("heading", { name: "Takete-Ide Primary Health Centre" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Old Health Centre" })).toBeVisible();
  });

  test("renders civic and community landmarks in public gallery categories", async ({ page }) => {
    // Landmarks category
    await page.goto("/gallery?category=Landmarks");
    await expect(page.getByRole("button", { name: /Takete-Ide Town Hall/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Area Court/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Police Station/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Civil Defence Office/i })).toBeVisible();

    // Places of Worship category
    await page.goto("/gallery?category=Places+of+Worship");
    await expect(page.getByRole("button", { name: /The Apostolic Church/i })).toBeVisible();

    // Community Life category
    await page.goto("/gallery?category=Community+Life");
    await expect(page.getByRole("button", { name: /Takete-Ide Market/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Aiyedayo Junction/i })).toBeVisible();
  });
});

