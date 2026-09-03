import { test, expect } from "@playwright/test";

test.describe("Production SEO & Canonical Domain Verification (https://takete-ide.org)", () => {
  test("sitemap.xml returns HTTP 200 with XML content and every <loc> begins with https://takete-ide.org", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);

    const contentType = res.headers()["content-type"] || "";
    expect(contentType).toMatch(/xml/i);

    const text = await res.text();
    expect(text).toContain("<urlset");
    expect(text).not.toContain("takete.netlify.app");
    expect(text).not.toContain("taketeideamuro.org");

    // Extract all <loc> elements
    const locMatches = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(locMatches.length).toBeGreaterThan(20);

    for (const loc of locMatches) {
      expect(loc.startsWith("https://takete-ide.org")).toBe(true);
    }
  });

  test("robots.txt declares correct canonical sitemap at https://takete-ide.org/sitemap.xml", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);

    const text = await res.text();
    expect(text).toContain("Sitemap: https://takete-ide.org/sitemap.xml");
    expect(text).not.toContain("takete.netlify.app");
    expect(text).not.toContain("taketeideamuro.org");
  });

  test("homepage renders canonical link, Open Graph and JSON-LD with https://takete-ide.org", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);

    const html = await res.text();
    expect(html).not.toContain("takete.netlify.app");
    expect(html).not.toContain("taketeideamuro.org");

    // Check Open Graph URL
    expect(html).toContain('property="og:url" content="https://takete-ide.org"');

    // Check JSON-LD Organization URL
    expect(html).toContain('"url":"https://takete-ide.org"');
  });

  test("Googlebot user-agent receives HTTP 200 with canonical metadata", async ({ request }) => {
    const res = await request.get("/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('property="og:url" content="https://takete-ide.org"');
  });

  test("public slug pages declare canonical URLs on https://takete-ide.org", async ({ request }) => {
    const routes = [
      "/centenary",
      "/events",
      "/support",
      "/oriki",
      "/tipu",
      "/our-story",
    ];

    for (const route of routes) {
      const res = await request.get(route);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).not.toContain("takete.netlify.app");
      expect(html).not.toContain("taketeideamuro.org");
    }
  });
});
