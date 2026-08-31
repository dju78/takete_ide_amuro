import { test, expect } from "@playwright/test";
import { roleRank, isFinancialAdmin, FINANCIAL_ROLES } from "@/lib/auth";

test.describe("App-scoped Takete authorization & role isolation logic", () => {
  test("role rank hierarchy enforces proper permissions", () => {
    // Media Manager, Project Manager, Historian, Treasurer are specialists (rank 1)
    expect(roleRank.media_manager).toBe(1);
    expect(roleRank.project_manager).toBe(1);
    expect(roleRank.historian).toBe(1);
    expect(roleRank.treasurer).toBe(1);

    // Editor is general content manager (rank 2)
    expect(roleRank.editor).toBe(2);

    // Administrator manages content and staff (rank 3)
    expect(roleRank.administrator).toBe(3);

    // Super Admin has full governance (rank 4)
    expect(roleRank.super_admin).toBe(4);

    expect(roleRank.super_admin).toBeGreaterThan(roleRank.administrator);
    expect(roleRank.administrator).toBeGreaterThan(roleRank.editor);
    expect(roleRank.editor).toBeGreaterThan(roleRank.historian);
  });

  test("financial administration is strictly isolated to super_admin and treasurer", () => {
    expect(FINANCIAL_ROLES).toEqual(["super_admin", "treasurer"]);

    // Permitted financial roles
    expect(isFinancialAdmin("super_admin")).toBe(true);
    expect(isFinancialAdmin("treasurer")).toBe(true);

    // Denied editorial & specialist roles
    expect(isFinancialAdmin("editor")).toBe(false);
    expect(isFinancialAdmin("administrator")).toBe(false);
    expect(isFinancialAdmin("historian")).toBe(false);
    expect(isFinancialAdmin("project_manager")).toBe(false);
    expect(isFinancialAdmin("media_manager")).toBe(false);
  });

  test("admin dashboard redirects unauthenticated or non-Takete visitors to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
  });

  test("admin users management route requires super_admin and redirects unauthenticated visitors", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("admin support account management route requires financial role and redirects unauthenticated visitors", async ({ page }) => {
    await page.goto("/admin/support");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("admin login page exposes no internal guide references or public registration", async ({ page }) => {
    await page.goto("/admin/login");

    // Admin Sign In controls remain available
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();

    // Internal developer documentation and guide references are removed
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("ADMIN_GUIDE");
    expect(bodyText).not.toContain("docs/ADMIN_GUIDE.md");
    expect(bodyText).not.toContain("Need an account?");

    // Public signup / self-registration is strictly not offered
    expect(bodyText).not.toMatch(/sign\s*up/i);
    expect(bodyText).not.toMatch(/register/i);
    expect(bodyText).not.toMatch(/create\s*account/i);
  });
});

test.describe("Public pages smoke test with shared database architecture", () => {
  const publicRoutes = [
    "/",
    "/tipu",
    "/tipu/branches",
    "/news",
    "/takete-ide-day",
    "/search",
    "/centenary",
    "/gallery",
    "/archive",
    "/archive/oral-history",
    "/oriki",
    "/support",
    "/development/security-trust-fund",
  ];

  for (const route of publicRoutes) {
    test(`renders public route ${route} without errors`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
      await expect(page).toHaveTitle(/Takete-Ide Amuro/);
    });
  }
});
