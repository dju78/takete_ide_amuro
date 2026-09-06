import { test, expect } from "@playwright/test";

test.describe("Proper Name Regression — Canonical Eleah", () => {
  test("incorrect spelling Eleahy does not render on any key public heritage/history pages", async ({ page }) => {
    const targetRoutes = [
      "/heritage/faith",
      "/heritage/faith/first-baptist-church",
      "/heritage",
      "/our-story",
      "/archive",
      "/archive/oral-history",
      "/families",
      "/families/compounds",
      "/oriki",
    ];

    for (const route of targetRoutes) {
      const res = await page.goto(route);
      expect(res?.status(), `Expected route ${route} to return 200`).toBe(200);

      const bodyText = await page.innerText("body");
      expect(bodyText).not.toMatch(/Eleahy/i);
    }
  });

  test("canonical spelling Eleah renders properly across First Baptist Church history", async ({ page }) => {
    const res = await page.goto("/heritage/faith/first-baptist-church");
    expect(res?.status()).toBe(200);

    await expect(page.getByText("Baba Eleah").first()).toBeVisible();
    await expect(page.getByText("Pa Thomas Eleah").first()).toBeVisible();
    await expect(page.getByText("Pa Gideon Eleah").first()).toBeVisible();
    await expect(page.getByText("Chief Reuben Eleah").first()).toBeVisible();
  });
});
