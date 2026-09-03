import { test, expect } from "@playwright/test";
import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest } from "next/server";

test.describe("Admin Canonical Domain & Security Enforcement", () => {
  test("legacy hostname takete.netlify.app/admin issues a 308 redirect to https://takete-ide.org/admin", async () => {
    const req = new NextRequest("https://takete.netlify.app/admin", {
      headers: { host: "takete.netlify.app" },
    });
    const res = await updateSession(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://takete-ide.org/admin");
  });

  test("legacy hostname takete.netlify.app/admin/* preserves nested path and query params with 308 redirect", async () => {
    const req = new NextRequest("https://takete.netlify.app/admin/news/new?category=culture&draft=true", {
      headers: { host: "takete.netlify.app" },
    });
    const res = await updateSession(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe(
      "https://takete-ide.org/admin/news/new?category=culture&draft=true"
    );
  });

  test("x-forwarded-host header from proxy/CDN triggers canonical redirect", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/admin/events", {
      headers: {
        host: "127.0.0.1:3000",
        "x-forwarded-host": "takete.netlify.app",
      },
    });
    const res = await updateSession(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://takete-ide.org/admin/events");
  });

  test("canonical hostname takete-ide.org does not redirect in a loop", async () => {
    const req = new NextRequest("https://takete-ide.org/admin", {
      headers: { host: "takete-ide.org" },
    });
    const res = await updateSession(req);
    // Should not return 308 redirect to itself
    expect(res.status).not.toBe(308);
  });

  test("admin routes declare noindex/nofollow robots metadata", async ({ page }) => {
    await page.goto("/admin/login");
    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robotsMeta).toContain("noindex");
    expect(robotsMeta).toContain("nofollow");
  });

  test("admin routes remain disallowed in robots.txt and excluded from sitemap.xml", async ({ request }) => {
    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain("Disallow: /admin");

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).not.toContain("<loc>https://takete-ide.org/admin");
    expect(sitemapText).not.toContain("takete.netlify.app");
  });

  test("unauthenticated access to protected admin route redirects to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
  });
});
