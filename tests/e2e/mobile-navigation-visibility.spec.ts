import { test, expect } from "@playwright/test";

test.describe("Mobile Navigation Full-Screen Overlay & Visibility Validation", () => {
  const viewports = [
    { width: 320, height: 568, name: "320px (iPhone SE 1st gen)" },
    { width: 360, height: 740, name: "360px (Android small)" },
    { width: 390, height: 844, name: "390px (iPhone 12/13/14)" },
    { width: 412, height: 915, name: "412px (Pixel / Samsung)" },
    { width: 430, height: 932, name: "430px (iPhone Pro Max)" },
  ];

  const targetRoutes = ["/", "/oriki", "/weather", "/centenary"];

  for (const vp of viewports) {
    for (const route of targetRoutes) {
      test(`mobile menu renders opaque full-screen overlay on ${route} at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route);

        // Hamburger button must be visible
        const hamburger = page.getByRole("button", { name: "Open menu" });
        await expect(hamburger).toBeVisible();
        await hamburger.click();

        // Dialog must be visible and have full-viewport white background
        const dialog = page.getByRole("dialog", { name: "Site navigation" });
        await expect(dialog).toBeVisible();

        // Validate overlay bounding box spans full viewport width and height
        const box = await dialog.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBe(vp.width);
        expect(box!.height).toBe(vp.height);
        expect(box!.x).toBe(0);
        expect(box!.y).toBe(0);

        // Validate opaque background color (rgb(255, 255, 255))
        const bgColor = await dialog.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(bgColor).toBe("rgb(255, 255, 255)");

        // Logo and Close button are visible
        await expect(dialog.getByRole("button", { name: "Close menu" })).toBeVisible();

        // Top-level direct links are visible
        await expect(dialog.getByRole("link", { name: "Home" })).toBeVisible();
        await expect(dialog.getByRole("link", { name: "Weather" }).first()).toBeVisible();

        // Group headings are visible
        await expect(dialog.getByRole("button", { name: "About" })).toBeVisible();
        await expect(dialog.getByRole("button", { name: "Explore" })).toBeVisible();
        await expect(dialog.getByRole("button", { name: "Community" })).toBeVisible();
        await expect(dialog.getByRole("button", { name: "News & Events" })).toBeVisible();
        await expect(dialog.getByRole("button", { name: "Centenary 2026" })).toBeVisible();
        await expect(dialog.getByRole("button", { name: "Support" })).toBeVisible();

        // Accordion expands and displays child links
        await dialog.getByRole("button", { name: "Explore" }).click();
        await expect(dialog.getByRole("link", { name: "Culture & Heritage" })).toBeVisible();
        await expect(dialog.getByRole("link", { name: "Families & Oríkì" })).toBeVisible();

        // Close menu
        await dialog.getByRole("button", { name: "Close menu" }).click();
        await expect(dialog).not.toBeVisible();
      });
    }
  }

  test("body scrolling is disabled when menu is open and restored when closed", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/oriki");

    const initialOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(initialOverflow).toBe("");

    // Open menu
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();

    const openOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(openOverflow).toBe("hidden");

    // Close menu
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site navigation" })).not.toBeVisible();

    const closedOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(closedOverflow).toBe("");
  });

  test("navigating via mobile menu closes the overlay and loads the target page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/oriki");

    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();

    // Click Weather
    await dialog.getByRole("link", { name: "Weather" }).first().click();

    // Verify navigation to /weather and overlay closed
    await expect(page).toHaveURL(/\/weather$/);
    await expect(page.getByRole("heading", { name: "Takete-Ide Weather", level: 1 })).toBeVisible();
    await expect(dialog).not.toBeVisible();
  });

  test("menu can be opened and closed repeatedly without breaking layout or scroll state", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const dialog = page.getByRole("dialog", { name: "Site navigation" });
      await expect(dialog).toBeVisible();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

      await dialog.getByRole("button", { name: "Close menu" }).click();
      await expect(dialog).not.toBeVisible();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    }
  });
});
