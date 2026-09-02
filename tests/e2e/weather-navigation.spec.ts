import { test, expect } from "@playwright/test";

test.describe("Public Takete-Ide Weather Page & Multi-Path Navigation", () => {
  test("weather page /weather loads successfully with full location heading", async ({ page }) => {
    const response = await page.goto("/weather");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Takete-Ide Weather", level: 1 })).toBeVisible();
    await expect(
      page.getByText("Local weather conditions and forecasts for Takete-Ide, Amuro, Kogi State, Nigeria."),
    ).toBeVisible();
  });

  test("desktop primary navigation includes visible Weather link resolving to /weather", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await expect(primaryNav).toBeVisible();

    const weatherLink = primaryNav.getByRole("link", { name: "Weather" });
    await expect(weatherLink).toBeVisible();
    await weatherLink.click();

    await expect(page).toHaveURL(/\/weather$/);
    await expect(page.getByRole("heading", { name: "Takete-Ide Weather", level: 1 })).toBeVisible();
  });

  test("mobile navigation menu contains visible Weather link resolving to /weather", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileNav = page.getByRole("dialog", { name: "Site navigation" });
    await expect(mobileNav).toBeVisible();

    const mobileWeatherLink = mobileNav.getByRole("link", { name: "Weather" }).first();
    await expect(mobileWeatherLink).toBeVisible();
    await mobileWeatherLink.click();

    await expect(page).toHaveURL(/\/weather$/);
    await expect(page.getByRole("heading", { name: "Takete-Ide Weather", level: 1 })).toBeVisible();
  });

  test("footer includes Weather link resolving to /weather without 404", async ({ page }) => {
    await page.goto("/");
    const footerNav = page.getByRole("navigation", { name: "Footer sections" });
    const footerWeatherLink = footerNav.getByRole("link", { name: "Weather" });

    await expect(footerWeatherLink).toBeVisible();
    await footerWeatherLink.click();

    await expect(page).toHaveURL(/\/weather$/);
    await expect(page.getByRole("heading", { name: "Takete-Ide Weather", level: 1 })).toBeVisible();
  });

  test("every public weather link across the site resolves without 404", async ({ page }) => {
    await page.goto("/");
    const weatherLinks = await page.locator("a[href='/weather']").all();
    expect(weatherLinks.length).toBeGreaterThanOrEqual(2);

    for (const link of weatherLinks) {
      const href = await link.getAttribute("href");
      expect(href).toBe("/weather");
    }

    const weatherRes = await page.goto("/weather");
    expect(weatherRes?.status()).toBe(200);
  });
});
