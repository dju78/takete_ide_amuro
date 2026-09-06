import { test, expect } from "@playwright/test";

const PUBLIC_ROUTES_INVENTORY = [
  "/",
  "/heritage",
  "/heritage/faith",
  "/heritage/faith/first-baptist-church",
  "/our-story",
  "/gallery",
  "/tipu",
  "/tipu/branches",
  "/tipu/branches/ilorin",
  "/tipu/branches/lokoja",
  "/development",
  "/development/community-at-work",
  "/news",
  "/events",
  "/centenary",
  "/diaspora",
  "/diaspora/uk-europe",
  "/support",
  "/kogi-quest",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
  "/education",
  "/our-people",
  "/families",
  "/families/compounds",
  "/oriki",
  "/archive",
  "/archive/oral-history",
  "/heritage/agado",
  "/heritage/agbagba-ide",
  "/heritage/anthem",
  "/heritage/ate",
  "/heritage/takete-ide-anthem",
  "/heritage/traditional-institution",
  "/heritage/traditional-marriage",
  "/takete-ide-day",
  "/takete-ide-day/cultural-attire",
  "/get-involved",
  "/search",
  "/cookies",
  "/weather",
];

test.describe("Public Route Inventory & Preservation", () => {
  test("all established public routes return HTTP 200 without regression or accidental noindex", async ({ page }) => {
    test.setTimeout(120000);

    for (const route of PUBLIC_ROUTES_INVENTORY) {
      const res = await page.goto(route);
      expect(res, `Route ${route} should resolve to a response`).not.toBeNull();
      expect(res?.status(), `Route ${route} must return status 200`).toBe(200);

      const body = page.locator("body");
      await expect(body).toBeVisible();

      if (route.startsWith("/heritage") || route === "/our-story" || route === "/gallery") {
        const robotsMeta = page.locator("meta[name='robots']");
        const count = await robotsMeta.count();
        if (count > 0) {
          const content = await robotsMeta.getAttribute("content");
          expect(content).not.toContain("noindex");
        }
      }
    }
  });
});
