import { test, expect } from "@playwright/test";

const routesToVerify = [
  { path: "/", titleFragment: "Takete-Ide Amuro", canonical: "https://takete-ide.org" },
  { path: "/our-story", titleFragment: "Our Story", canonical: "https://takete-ide.org/our-story" },
  { path: "/heritage", titleFragment: "Heritage", canonical: "https://takete-ide.org/heritage" },
  { path: "/heritage/faith", titleFragment: "Faith & Religious Heritage", canonical: "https://takete-ide.org/heritage/faith" },
  { path: "/gallery", titleFragment: "Gallery", canonical: "https://takete-ide.org/gallery" },
  { path: "/tipu", titleFragment: "TIPU", canonical: "https://takete-ide.org/tipu" },
  { path: "/development", titleFragment: "Development", canonical: "https://takete-ide.org/development" },
  { path: "/centenary", titleFragment: "Centenary", canonical: "https://takete-ide.org/centenary" },
  { path: "/diaspora", titleFragment: "Diaspora", canonical: "https://takete-ide.org/diaspora" },
  { path: "/support", titleFragment: "Support", canonical: "https://takete-ide.org/support" },
  { path: "/kogi-quest", titleFragment: "Kogi Quest", canonical: "https://takete-ide.org/kogi-quest" },
];

test.describe("Open Graph, Canonical & Metadata Verification", () => {
  for (const { path, titleFragment, canonical } of routesToVerify) {
    test(`verifies rendered Open Graph, canonical and metadata on ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);

      // Title
      const title = await page.title();
      expect(title).toContain(titleFragment);
      // Ensure no double suffix e.g. "Takete-Ide Amuro | Takete-Ide Amuro"
      expect(title).not.toMatch(/Takete-Ide Amuro\s*\|\s*Takete-Ide Amuro/);

      // Canonical link tag
      const canonicalTag = page.locator("link[rel='canonical']");
      if (await canonicalTag.count() > 0) {
        const href = await canonicalTag.getAttribute("href");
        expect(href).toBe(canonical);
      }

      // Description
      const metaDesc = page.locator("meta[name='description']");
      if (await metaDesc.count() > 0) {
        const descContent = await metaDesc.getAttribute("content");
        expect(descContent).toBeTruthy();
        expect(descContent?.length).toBeGreaterThan(15);
      }

      // Open Graph Tags
      const ogTitle = page.locator("meta[property='og:title']");
      if (await ogTitle.count() > 0) {
        const ogTitleContent = await ogTitle.getAttribute("content");
        expect(ogTitleContent).toBeTruthy();
      }

      const ogDesc = page.locator("meta[property='og:description']");
      if (await ogDesc.count() > 0) {
        const ogDescContent = await ogDesc.getAttribute("content");
        expect(ogDescContent).toBeTruthy();
      }

      const ogUrl = page.locator("meta[property='og:url']");
      if (await ogUrl.count() > 0) {
        const ogUrlContent = await ogUrl.getAttribute("content");
        expect(ogUrlContent).toBe(canonical);
      }
    });
  }

  test("Centenary calendar .ics download endpoint produces valid RFC 5545 calendar file", async ({ request }) => {
    const response = await request.get("/centenary/calendar.ics");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/calendar");
    const body = await response.text();
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).toContain("VERSION:2.0");
    expect(body).toContain("BEGIN:VEVENT");
    expect(body.toUpperCase()).toContain("SUMMARY:TAKETE-IDE DAY & CENTENARY CELEBRATION 2026");
    expect(body).toContain("DTSTART;VALUE=DATE:20261029");
    expect(body).toContain("DTEND;VALUE=DATE:20261101");
    expect(body).toContain("END:VEVENT");
    expect(body).toContain("END:VCALENDAR");
  });

  test("Centenary Web RSVP form renders cleanly with required fields", async ({ page }) => {
    await page.goto("/centenary");
    const rsvpSection = page.locator("#rsvp");
    await expect(rsvpSection).toBeVisible();

    // Verify presence of online RSVP form
    await expect(rsvpSection.getByText("Online Attendance RSVP")).toBeVisible();
    await expect(rsvpSection.locator("input[name='fullName']")).toBeVisible();
    await expect(rsvpSection.locator("input[name='email']")).toBeVisible();
    await expect(rsvpSection.locator("input[name='phone']")).toBeVisible();
    await expect(rsvpSection.locator("button[type='submit']")).toBeVisible();
  });
});
