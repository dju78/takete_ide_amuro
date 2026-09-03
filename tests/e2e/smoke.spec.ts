import { test, expect } from "@playwright/test";

test.describe("Public site smoke tests", () => {
  test("homepage renders with brand and hero (desktop composition)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page).toHaveTitle(/Takete-Ide Amuro/);
    await expect(page.getByRole("heading", { name: "Takete-Ide Amuro", level: 1 })).toBeVisible();
    // Desktop and mobile hero markups both exist in the DOM (CSS-toggled); at
    // this viewport the mobile one is display:none. The footer carries the motto
    // too, so scope to the hero rather than matching site-wide.
    const hero = page.locator("section").first();
    await expect(hero.locator("text=Heritage • Unity • Progress >> visible=true")).toBeVisible();
  });

  test("homepage renders with brand and hero (mobile composition)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Takete-Ide Amuro", level: 1 })).toBeVisible();
    const hero = page.locator("section").first();
    await expect(hero.locator("text=Heritage • Unity • Progress >> visible=true")).toBeVisible();
  });

  test("Home link and mega-menu group links resolve", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/development");
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await primaryNav.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);

    await primaryNav.getByRole("button", { name: "Community" }).hover();
    await primaryNav.getByRole("link", { name: /^Development/ }).first().click();
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
    await expect(page.getByRole("heading", { name: /Detailed Family Profiles Under Compilation/i })).toBeVisible();
  });

  test("public Kogi Quest link exists in navigation and footer pointing to /kogi-quest", async ({ page }) => {
    await page.goto("/");
    const navLink = page.locator("nav a[href='/kogi-quest']").first();
    await expect(navLink).toBeAttached();

    const footerLink = page.locator("footer a[href='/kogi-quest']").first();
    await expect(footerLink).toBeAttached();
  });

  test("homepage does not display broken weather unavailable block when unconfigured", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Weather temporarily unavailable")).toHaveCount(0);
  });

  test("homepage renders authentic Okuta Gbooro without placeholder tag", async ({ page }) => {
    await page.goto("/");
    const okutaImg = page.locator("img[src*='okuta-gboro'] >> visible=true").first();
    await expect(okutaImg).toBeVisible();
    await expect(page.getByText("authentic photograph being verified")).toHaveCount(0);
  });

  test("public site offers direct bank transfer and no active online payment checkout", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: "Direct Bank Transfer" })).toBeVisible();
    await expect(page.getByText("2023263187", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Pay Online|Pay with Card|Donate Online|Pay with Paystack/i })).toHaveCount(0);

    await page.goto("/get-involved");
    await expect(page.getByText(/Contributions to the union can be made by direct bank transfer/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Pay Online|Pay with Card|Donate Online/i })).toHaveCount(0);

    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: "Contributions" })).toBeVisible();
    await expect(page.getByText(/Community contributions to the union.*direct bank transfer/i)).toBeVisible();
  });
});

test.describe("Admin auth gate", () => {
  test("unauthenticated visitors are redirected to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
  });
});
