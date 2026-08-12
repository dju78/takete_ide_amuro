import { test, expect } from "@playwright/test";

test.describe("Public site smoke tests", () => {
  test("homepage renders with brand and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Takete-Ide Amuro/);
    await expect(page.getByRole("heading", { name: "Takete-Ide Amuro", level: 1 })).toBeVisible();
    await expect(page.getByText("Heritage • Unity • Progress").first()).toBeVisible();
  });

  test("Home link and mega-menu group links resolve", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/development");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await primaryNav.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);

    await primaryNav.getByRole("button", { name: "Development" }).hover();
    await primaryNav.getByRole("link", { name: "Development Projects" }).click();
    await expect(page).toHaveURL(/\/development$/);
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("contact form shows client-side validation before submit", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send Message" }).click();
    const nameInput = page.locator("#name");
    await expect(nameInput).toHaveJSProperty("validity.valid", false);
  });

  test("weather page renders with fallback when unconfigured", async ({ page }) => {
    await page.goto("/weather");
    await expect(page.getByRole("heading", { name: "Takete-Ide Weather" })).toBeVisible();
  });

  test("empty states render instead of fabricated content", async ({ page }) => {
    await page.goto("/families");
    await expect(page.getByRole("heading", { name: /family directory is just beginning/i })).toBeVisible();
  });
});

test.describe("Admin auth gate", () => {
  test("unauthenticated visitors are redirected to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
  });
});
