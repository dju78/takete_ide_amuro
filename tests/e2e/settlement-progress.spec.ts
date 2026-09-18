import { test, expect } from "@playwright/test";

test.describe("Settlement & Community Progress (/development/settlement-progress)", () => {
  test("loads successfully with correct metadata, headings and canonical URL", async ({ page }) => {
    await page.goto("/development/settlement-progress");

    // Title & Primary Heading
    await expect(page).toHaveTitle(/Settlement & Community Progress \| Takete-Ide Amuro/i);
    const h1 = page.getByRole("heading", { level: 1, name: "Settlement & Community Progress" });
    await expect(h1).toBeVisible();

    // Canonical link
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://takete-ide.org/development/settlement-progress");

    // Breadcrumb
    const breadcrumbs = page.locator("nav[aria-label='Breadcrumb']");
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText("Development");
    await expect(breadcrumbs).toContainText("Settlement & Community Progress");

    // Headings structure (sequential)
    const h2s = page.locator("main h2");
    await expect(h2s).toHaveCount(3);
    await expect(h2s.nth(0)).toHaveText("A Changing Built Environment");
    await expect(h2s.nth(1)).toHaveText("Contemporary Residential Development");
    await expect(h2s.nth(2)).toHaveText("Documenting Community Change");
  });

  test("renders all 9 authentic settlement photographs with non-empty neutral alt text", async ({ page }) => {
    await page.goto("/development/settlement-progress");

    const images = page.locator("main img, .bg-ivory img");
    // Ensure all 9 settlement progress images exist
    for (let i = 1; i <= 9; i++) {
      const filename = `settlement-progress-0${i}.jpg`;
      const img = page.locator(`img[src*="${filename}"]`).first();
      await expect(img).toBeAttached();
      const alt = await img.getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt!.length).toBeGreaterThan(5);
      // Ensure no speculative luxury/wealth words in alt text
      expect(alt).not.toMatch(/mansion|luxury|wealth|estate|millionaire/i);
    }
  });

  test("lightbox opens when a photo is clicked, navigates next/prev, and closes on Escape", async ({ page }) => {
    await page.goto("/development/settlement-progress");

    const firstCard = page.getByRole("button", { name: /Contemporary residential building in Takete-Ide/i }).first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Modal dialog opens
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("1 of 9");

    // Click Next
    const nextButton = page.getByRole("button", { name: "Next photograph" });
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    await expect(dialog).toContainText("2 of 9");

    // Click Prev
    const prevButton = page.getByRole("button", { name: "Previous photograph" });
    await expect(prevButton).toBeVisible();
    await prevButton.click();
    await expect(dialog).toContainText("1 of 9");

    // Close via Escape key
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("is discoverable from parent /development page and primary navigation", async ({ page }) => {
    await page.goto("/development");

    const link = page.locator('a[href="/development/settlement-progress"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/development\/settlement-progress$/);
  });

  test("sitemap.xml includes /development/settlement-progress", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("https://takete-ide.org/development/settlement-progress");
  });

  const viewports = [
    { name: "mobile-320", width: 320, height: 568 },
    { name: "mobile-375", width: 375, height: 667 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1280", width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    test(`renders without horizontal overflow at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/development/settlement-progress");

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);
    });
  }
});
