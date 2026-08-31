import { test, expect } from "@playwright/test";

test.describe("Kogi Quest community tool integration", () => {
  test("renders /community/kogi-quest with proper heading and copy", async ({ page }) => {
    const res = await page.goto("/community/kogi-quest");
    expect(res?.status()).toBe(200);

    // Heading
    await expect(page.getByRole("heading", { name: "Kogi Quest", level: 1 })).toBeVisible();

    // Accurate introductory copy
    await expect(
      page.getByText(
        "Explore Kogi State through an interactive knowledge and learning experience. Kogi Quest offers questions covering history, culture, places and community knowledge.",
      ),
    ).toBeVisible();
  });

  test("Launch Kogi Quest points to the external tool with safe rel and target attributes", async ({ page }) => {
    await page.goto("/community/kogi-quest");

    const launchLink = page.getByRole("link", { name: /Launch Kogi Quest/i });
    await expect(launchLink).toBeVisible();
    await expect(launchLink).toHaveAttribute("href", "https://dju78.github.io/kogiqest");
    await expect(launchLink).toHaveAttribute("target", "_blank");

    const rel = await launchLink.getAttribute("rel");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  test("primary navigation surfaces Kogi Quest in the Community group", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await primaryNav.getByRole("button", { name: "Community", exact: true }).hover();

    const kogiQuestLink = primaryNav.getByRole("link", { name: /Kogi Quest/i });
    await expect(kogiQuestLink).toBeVisible();
    await expect(kogiQuestLink).toHaveAttribute("href", "/community/kogi-quest");
  });

  test("mobile navigation surfaces Kogi Quest in the Community accordion", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Community" }).click();

    const link = dialog.getByRole("link", { name: "Kogi Quest" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/community/kogi-quest");
  });

  test("no horizontal overflow across viewports on /community/kogi-quest", async ({ page }) => {
    const viewports = [
      { name: "mobile-320", width: 320, height: 568 },
      { name: "mobile-375", width: 375, height: 667 },
      { name: "tablet-768", width: 768, height: 1024 },
      { name: "desktop-1440", width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/community/kogi-quest");
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    }
  });
});
