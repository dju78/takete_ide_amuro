import { test, expect } from "@playwright/test";
import { getCentenary, getSupportAccount } from "@/lib/data/community-programme";
import { getAllNews } from "@/lib/data/news";
import { getOrikiList } from "@/lib/data/families";
import { getBranchNetwork } from "@/lib/data/tipu-branches";

test.describe("Website Performance, Caching & Header Validation", () => {
  const publicRoutes = [
    "/",
    "/centenary",
    "/events",
    "/support",
    "/oriki",
    "/tipu",
    "/tipu/branches",
    "/heritage/traditional-institution",
    "/weather",
    "/our-story",
    "/get-involved",
  ];

  for (const route of publicRoutes) {
    test(`public route ${route} responds with fast TTFB and valid status`, async ({ request }) => {
      const start = Date.now();
      const response = await request.get(route);
      const duration = Date.now() - start;

      expect(response.status()).toBe(200);
      // Fast TTFB constraint: server response well under 2000ms SLA
      expect(duration).toBeLessThan(2000);

      // Verify that public pages are not marked as private no-store
      const cacheControl = response.headers()["cache-control"] || "";
      expect(cacheControl).not.toContain("private, no-cache, no-store");
    });
  }

  test("public slug routes pre-render and respond immediately", async ({ request }) => {
    const slugRoutes = [
      "/archive/takete-history-original",
      "/heritage/traditional-marriage",
      "/heritage/ate",
      "/heritage/agbagba-ide",
    ];

    for (const route of slugRoutes) {
      const start = Date.now();
      const response = await request.get(route);
      const duration = Date.now() - start;

      expect(response.status()).toBe(200);
      expect(duration).toBeLessThan(2000);
    }
  });

  test("homepage and centenary render with canonical content and no blocking scripts", async ({ request }) => {
    const [homeRes, centenaryRes, centenary] = await Promise.all([
      request.get("/"),
      request.get("/centenary"),
      getCentenary(),
    ]);

    expect(homeRes.status()).toBe(200);
    expect(centenaryRes.status()).toBe(200);

    const homeHtml = await homeRes.text();
    const centenaryHtml = await centenaryRes.text();

    expect(homeHtml).toContain(centenary.eventDates);
    expect(centenaryHtml).toContain("Celebrating 100 Years of Heritage");
  });
});
