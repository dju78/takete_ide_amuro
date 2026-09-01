import { test, expect } from "@playwright/test";

/**
 * The events surface. The recurring risk here is fabrication — a start time, a
 * programme or a performer invented to fill a card sends people to a field at
 * the wrong hour. These tests assert the confirmed facts are present and the
 * unconfirmed ones stay absent.
 */

test.describe("Events", () => {
  test("renders upcoming and past sections", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("heading", { name: "Community Events", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Upcoming Events" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Past Events" })).toBeVisible();
  });

  test("the Centenary appears with its confirmed date and venue", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByText("Saturday, 31 October 2026").first()).toBeVisible();
    await expect(page.getByText(/UBE School Field/).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Centenary 2026/ }).first()).toBeVisible();
  });

  test("the Centenary is listed as upcoming, not archived", async ({ page }) => {
    await page.goto("/events");
    const upcoming = page.locator("section").filter({ hasText: "Upcoming Events" });
    await expect(upcoming.getByText(/Centenary/i).first()).toBeVisible();
  });

  test("emits Event structured data using only confirmed fields", async ({ page }) => {
    await page.goto("/events");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const events = blocks
      .flatMap((b) => {
        try {
          const parsed = JSON.parse(b);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [];
        }
      })
      .filter((n) => n["@type"] === "Event");

    expect(events.length).toBeGreaterThan(0);
    const centenary = events.find((e) => String(e.name).toLowerCase().includes("centenary"));
    expect(centenary).toBeTruthy();
    expect(centenary.startDate).toBe("2026-10-31");
    expect(centenary.eventStatus).toBe("https://schema.org/EventScheduled");
    expect(centenary.location?.name).toMatch(/UBE School Field/);

    // Unconfirmed ticket/performer details are never fabricated.
    for (const e of events) {
      expect(e.doorTime).toBeUndefined();
      expect(e.offers).toBeUndefined();
      expect(e.performer).toBeUndefined();
    }
  });

  test("invents no ticketing or performers", async ({ page }) => {
    await page.goto("/events");
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    expect(text).not.toMatch(/buy tickets?|ticket price|admission fee|book now/i);
    await expect(
      page.getByText(/Start times, programmes and guest details are published only once/),
    ).toBeVisible();
  });

  test("is reachable from the primary navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("button", { name: "News & Events" }).hover();
    await nav.getByRole("link", { name: /^Events/ }).first().click();
    await expect(page).toHaveURL(/\/events$/);
  });

  test("appears in the sitemap", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("/events");
  });
});
