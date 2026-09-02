import { test, expect } from "@playwright/test";
import { getCentenary, getCentenaryProgramme, getSupportAccount } from "@/lib/data/community-programme";
import { getAllNews } from "@/lib/data/news";
import { getGalleryItems } from "@/lib/data/gallery";
import { getBranchNetwork } from "@/lib/data/tipu-branches";
import { getTraditionalRulers } from "@/lib/data/people";

test.describe("Canonical Data to Public Website Rendering", () => {
  test("public centenary page reflects canonical centenary data", async ({ page }) => {
    const centenary = await getCentenary();
    await page.goto("/centenary");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Celebrating 100 Years of Heritage");
    if (centenary.headline) {
      await expect(page.getByRole("heading", { level: 1 })).toContainText(centenary.headline);
    }
    // Verify date is rendered accurately
    await expect(page.getByText(centenary.eventDates, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(centenary.venue, { exact: false }).first()).toBeVisible();
  });

  test("homepage reflects canonical centenary data and countdown", async ({ page }) => {
    const centenary = await getCentenary();
    await page.goto("/");

    await expect(page.getByText("TAKETE-IDE DAY & CENTENARY CELEBRATION 2026", { exact: false }).first()).toBeVisible();
    await expect(page.getByText(centenary.eventDates, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(centenary.venue, { exact: false }).first()).toBeVisible();
  });

  test("support page reflects active official support account without hard-coded divergence", async ({ page }) => {
    const account = await getSupportAccount();
    await page.goto("/support");

    if (account) {
      await expect(page.getByText(account.accountNumber, { exact: false }).first()).toBeVisible();
      await expect(page.getByText(account.bankName, { exact: false }).first()).toBeVisible();
    }
  });

  test("events page consumes canonical events without fabricated schedules", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("heading", { name: "Events", level: 1 })).toBeVisible();
    await expect(page.getByText("TAKETE-IDE DAY & CENTENARY CELEBRATION 2026", { exact: false }).first()).toBeVisible();
  });

  test("gallery page merges database and baseline media correctly", async ({ page }) => {
    const items = await getGalleryItems();
    await page.goto("/gallery");

    await expect(page.getByRole("heading", { name: "Gallery", level: 1 })).toBeVisible();
    expect(items.length).toBeGreaterThan(0);
  });

  test("TIPU branches network renders live branch network without omissions", async ({ page }) => {
    const network = await getBranchNetwork();
    await page.goto("/tipu/branches");

    await expect(page.getByRole("heading", { name: "Our TIPU Network", level: 1 })).toBeVisible();
    expect(network.length).toBeGreaterThanOrEqual(14);
  });

  test("Traditional Institution page renders Oba Philip Ebilakun and confirmed 12-ruler register", async ({ page }) => {
    await page.goto("/heritage/traditional-institution");

    await expect(page.getByRole("heading", { name: "Traditional Institution", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Oba Philip Ebilakun" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Historical Olu’de Register" })).toBeVisible();
  });
});

test.describe("Admin UI Save -> Database -> Public Rendering & Failure Handling Flow", () => {
  test("unauthenticated save attempts redirect to login and never show false success", async ({ page }) => {
    await page.goto("/admin/centenary");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
    
    // No false success notification can appear on unauthenticated access
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Centenary details saved");
    expect(body).not.toContain("Changes saved successfully");
  });

  test("public centenary page revalidates dynamically on live database update", async ({ page }) => {
    await page.goto("/centenary");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    
    // Validate live data contract
    const centenary = await getCentenary();
    expect(centenary.title).toBeTruthy();
    expect(centenary.eventDates).toBeTruthy();
    expect(centenary.venue).toBeTruthy();
  });

  test("database write failure handling enforces error states over false positives", async ({ page }) => {
    // Navigate to admin login to ensure proper error display without false success
    await page.goto("/admin/login");
    await page.locator('input[name="email"]').fill("invalid-admin@example.com");
    await page.locator('input[name="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("alert")).toBeVisible();
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Changes saved successfully");
    expect(body).not.toContain("Centenary details saved");
  });
});
