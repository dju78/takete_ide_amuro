import { test, expect } from "@playwright/test";

test.describe("Takete-Ide complete historical integration", () => {
  test.describe("/our-story primary historical experience", () => {
    test("renders hero, Takete-Idera, migration stages, and archive CTA", async ({ page }) => {
      const res = await page.goto("/our-story");
      expect(res?.status()).toBe(200);

      // Hero
      await expect(page.getByRole("heading", { name: "From the Hills to a Home of Peace", level: 1 })).toBeVisible();
      await expect(page.getByText(/reaches beyond the present settlement/i)).toBeVisible();

      // Takete-Idera meaning and landscape
      await expect(page.getByRole("heading", { name: /Takete-Idera — A Place of Comfort/i })).toBeVisible();
      await expect(page.getByText(/separated to a place of comfort, rest and peace/i)).toBeVisible();

      // Migration stages in timeline
      await expect(page.getByRole("heading", { name: "Amuro-Odo" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Igbo Ide (Igbo Idera)" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Ilu-Oke" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Okeata / Surrounding Uplands" })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Present Takete-Ide/i })).toBeVisible();

      // c.1926 settlement milestone callout
      await expect(
        page.getByRole("heading", { name: /1926 marks a new chapter in the story — not the beginning of Takete-Ide/i }),
      ).toBeVisible();
      await expect(page.getByText(/1926 or thereabouts/i).first()).toBeVisible();

      // Archive CTA link
      const archiveLink = page.getByRole("link", { name: "Explore the Digital Archive" }).first();
      await expect(archiveLink).toBeVisible();
      await expect(archiveLink).toHaveAttribute("href", "/archive");
    });

    test("mobile timeline renders cleanly without hover requirements", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/our-story");

      // Verify all stages are present in DOM
      for (const stage of ["Amuro-Odo", "Igbo Ide", "Ilu-Oke", "Okeata", "Present Takete-Ide"]) {
        await expect(page.getByText(stage, { exact: false }).first()).toBeVisible();
      }
    });
  });

  test.describe("/centenary Why 2026 Matters", () => {
    test("explains centenary as a century at the present settlement and avoids false founding claims", async ({ page }) => {
      await page.goto("/centenary");

      // Why 2026 Matters section
      await expect(page.getByText("Why 2026 Matters")).toBeVisible();
      await expect(page.getByRole("heading", { name: "A Century at the Present Settlement" })).toBeVisible();
      await expect(page.getByText(/around 1926/i)).toBeVisible();
      await expect(page.getByText(/approximately a century at the present settlement/i).first()).toBeVisible();

      // Prohibited claim check: "Takete-Ide was founded in 1926" must NEVER appear
      const bodyText = await page.innerText("body");
      expect(bodyText).not.toMatch(/Takete-Ide was founded in 1926/i);
      expect(bodyText).not.toMatch(/Takete-Ide began in 1926/i);
      expect(bodyText).not.toMatch(/Takete-Ide is only 100 years old/i);
    });
  });

  test.describe("Homepage history preview", () => {
    test("homepage displays history preview linking to /our-story", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "From the Hills to a Home of Peace" })).toBeVisible();
      const cta = page.getByRole("link", { name: "Explore Our Story" }).first();
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", "/our-story");
    });
  });

  test.describe("Heritage & Agbagba Ide", () => {
    test("renders /heritage/agbagba-ide with cultural memory framing and praise traditions", async ({ page }) => {
      const res = await page.goto("/heritage/agbagba-ide");
      expect(res?.status()).toBe(200);

      await expect(page.getByRole("heading", { name: "Agbagba Ide", level: 1 })).toBeVisible();
      await expect(page.getByText("Symbol, Memory and Community Tradition")).toBeVisible();
      await expect(page.getByRole("heading", { name: "A Sanctuary in Times of Conflict" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Anthem & Praise Traditions" })).toBeVisible();
      await expect(page.getByText(/Takete-Ide Community Anthem/i).first()).toBeVisible();
      await expect(page.getByText(/Oríkì Agbagba Ide/i).first()).toBeVisible();
    });

    test("heritage page surfaces Agbagba Ide and authentic landscape photos", async ({ page }) => {
      await page.goto("/heritage");
      await expect(page.getByRole("link", { name: /Agbagba Ide/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Landscape & Natural Heritage" })).toBeVisible();
    });
  });

  test.describe("Digital Archive integration", () => {
    test("archive displays Takete-Ide Historical Community Account metadata record", async ({ page }) => {
      await page.goto("/archive");
      await expect(page.getByText("Takete-Ide Historical Community Account").first()).toBeVisible();

      // Navigate to detail
      await page.getByRole("link", { name: /Takete-Ide Historical Community Account/i }).click();
      await expect(page).toHaveURL(/takete-history-original/);
      await expect(page.getByRole("heading", { name: "Takete-Ide Historical Community Account", level: 1 })).toBeVisible();
    });
  });

  test.describe("Site Search for historical topics", () => {
    test("finds key historical terms across public pages", async ({ page }) => {
      for (const term of ["Takete-Idera", "Amuro-Odo", "Ilu-Oke", "Agbagba Ide"]) {
        await page.goto(`/search?q=${encodeURIComponent(term)}`);
        await expect(page.getByText(/results? for/i)).toBeVisible();
        await expect(page.getByText(/No results for/i)).toHaveCount(0);
      }
    });
  });

  test.describe("Safeguards & Responsive Layout", () => {
    test("no internal editorial paths or unresolved ruler dates exposed publicly", async ({ page }) => {
      for (const path of ["/our-story", "/centenary", "/heritage", "/heritage/agbagba-ide", "/archive"]) {
        await page.goto(path);
        const bodyText = await page.innerText("body");
        expect(bodyText).not.toContain("content/history/editorial");
        expect(bodyText).not.toContain("content/history/sources");
        expect(bodyText).not.toContain("198×");
        expect(bodyText).not.toContain("200×");
      }
    });

    test("no horizontal overflow across viewports on historical pages", async ({ page }) => {
      const viewports = [
        { name: "320", width: 320, height: 568 },
        { name: "375", width: 375, height: 667 },
        { name: "390", width: 390, height: 844 },
        { name: "430", width: 430, height: 932 },
        { name: "768", width: 768, height: 1024 },
        { name: "1024", width: 1024, height: 768 },
        { name: "1280", width: 1280, height: 800 },
        { name: "1440", width: 1440, height: 900 },
      ];

      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        for (const route of ["/our-story", "/centenary", "/heritage/agbagba-ide"]) {
          await page.goto(route);
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
        }
      }
    });
  });
});
