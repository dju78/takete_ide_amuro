import { test, expect } from "@playwright/test";

test.describe("Agado Festival Thumbnail & Living Heritage Card", () => {
  test("renders Agado Festival card on homepage with authentic extracted video thumbnail and play overlay", async ({ page }) => {
    await page.goto("/");

    // Locate the Agado Festival card
    const agadoCard = page.locator('a[href="/heritage/agado"]').first();
    await expect(agadoCard).toBeVisible();

    // Verify Title & Description & Explore link
    await expect(agadoCard.locator("h3")).toHaveText("Agado Festival");
    await expect(agadoCard.locator("p")).toContainText("Community video footage from the Agado Festival.");
    await expect(agadoCard.locator("span:has-text('Explore →')")).toBeVisible();

    // Verify thumbnail image
    const img = agadoCard.locator("img");
    await expect(img).toBeAttached();
    const src = await img.getAttribute("src");
    expect(src).toContain("agado-festival.jpg");

    // Verify Alt text is non-empty and descriptive
    const alt = await img.getAttribute("alt");
    expect(alt).toBeTruthy();
    expect(alt!.length).toBeGreaterThan(10);
    expect(alt).toContain("Agado Festival");

    // Verify Play overlay icon is visible
    const playIcon = agadoCard.locator("svg");
    await expect(playIcon).toBeVisible();
  });

  test("renders Agado Festival card on /heritage page with authentic extracted thumbnail", async ({ page }) => {
    await page.goto("/heritage");

    const agadoCard = page.locator('a[href="/heritage/agado"]').first();
    await expect(agadoCard).toBeVisible();
    await expect(agadoCard.locator("h3")).toHaveText("Agado Festival");

    const img = agadoCard.locator("img");
    await expect(img).toBeAttached();
    const src = await img.getAttribute("src");
    expect(src).toContain("agado-festival.jpg");
  });

  test("renders Agado Festival page with video player having poster attribute", async ({ page }) => {
    await page.goto("/heritage/agado");

    const video = page.locator("video");
    await expect(video).toBeAttached();
    const poster = await video.getAttribute("poster");
    expect(poster).toContain("agado-festival.jpg");
  });

  const viewports = [
    { name: "mobile-320", width: 320, height: 568 },
    { name: "mobile-375", width: 375, height: 667 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1280", width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    test(`renders Agado Festival card without overflow at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const agadoCard = page.locator('a[href="/heritage/agado"]').first();
      await expect(agadoCard).toBeVisible();

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);
    });
  }
});
