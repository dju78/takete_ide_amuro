import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TARGET_URL || "https://takete-ide.org";

test.describe("Production Smoke Test", () => {
  test("Homepage loads with branding, headings, and authentic imagery", async ({ page }) => {
    const res = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);

    await expect(page).toHaveTitle(/Takete-Ide/i);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator('img[alt*="Okuta Gbooro"]').first()).toBeAttached();
  });

  test("Oríkì directory loads live Supabase records and all 3 audio recordings resolve", async ({ page, request }) => {
    const res = await page.goto("/oriki", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);

    // Dynamic record count badge
    const countBadge = page.locator("span", { hasText: /Records?/i }).first();
    await expect(countBadge).toBeVisible();

    // Verify 3 approved audio files directly
    const esehaAudio = await request.get("/audio/oriki/eseha-jare.ogg");
    expect(esehaAudio.status()).toBe(200);
    expect(Number(esehaAudio.headers()["content-length"])).toBeGreaterThan(1000);

    const mesamiAudio = await request.get("/audio/oriki/mesami-olu.ogg");
    expect(mesamiAudio.status()).toBe(200);
    expect(Number(mesamiAudio.headers()["content-length"])).toBeGreaterThan(1000);

    const eseyinAudio = await request.get("/audio/oriki/eseyin-telu.ogg");
    expect(eseyinAudio.status()).toBe(200);
    expect(Number(eseyinAudio.headers()["content-length"])).toBeGreaterThan(1000);

    // Audio available quick filter
    const audioFilter = page.getByRole("button", { name: /Audio Available/i });
    await expect(audioFilter).toBeVisible();
    await audioFilter.click();
    await expect(page.locator("table audio, .space-y-3 audio").first()).toBeVisible();
  });

  test("Faith heritage page renders all 13 churches with authentic imagery and no pending badges", async ({ page }) => {
    const res = await page.goto("/heritage/faith", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);

    const churchCards = page.locator("#churches article");
    await expect(churchCards).toHaveCount(13);

    // RCCG image present
    const rccgImg = page.locator('img[src*="rccg-takete-ide.png"]');
    await expect(rccgImg).toBeVisible();

    // Second ECWA image present
    const secondEcwaImg = page.locator('img[src*="second-ecwa-church-takete-ide.jpg"]');
    await expect(secondEcwaImg).toBeVisible();

    // No pending verification badges
    await expect(page.locator("text='Pending Verification'")).toHaveCount(0);

    // First Baptist church history route
    const firstBaptistRes = await page.goto("/heritage/faith/first-baptist-church", { waitUntil: "domcontentloaded" });
    expect(firstBaptistRes?.status()).toBe(200);
  });

  test("Traditional marriage page renders with dignified archival terminology", async ({ page }) => {
    const res = await page.goto("/heritage/traditional-marriage", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);

    const bodyText = await page.innerText("body");
    expect(bodyText).not.toContain("unverified");
    expect(bodyText).toContain("commitment to historical precision");
  });

  test("Mobile navigation opens and renders cleanly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const menuBtn = page.getByRole("button", { name: /Open navigation menu|Toggle navigation menu|menu/i });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
  });

  test("Discoverability routes resolve with HTTP 200", async ({ page }) => {
    const routes = [
      "/heritage/community-organisations",
      "/heritage/festivals",
      "/heritage/land-and-landscape",
      "/heritage/traditional-council",
      "/heritage/pacesetters",
      "/heritage/music-games",
      "/heritage/health-history",
      "/our-story/takete-tedo",
      "/archive?category=video",
      "/tipu/branches/ilorin",
      "/tipu/branches/lokoja",
    ];

    for (const route of routes) {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.status()).toBe(200);
    }
  });
});
