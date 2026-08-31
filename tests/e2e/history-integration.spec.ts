import { test, expect } from "@playwright/test";

test.describe("Takete-Ide complete historical integration & depth", () => {
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

      for (const stage of ["Amuro-Odo", "Igbo Ide", "Ilu-Oke", "Okeata", "Present Takete-Ide"]) {
        await expect(page.getByText(stage, { exact: false }).first()).toBeVisible();
      }
    });
  });

  test.describe("/centenary Why 2026 Matters", () => {
    test("explains centenary as a century at the present settlement and avoids false founding claims", async ({ page }) => {
      await page.goto("/centenary");

      await expect(page.getByText("Why 2026 Matters")).toBeVisible();
      await expect(page.getByRole("heading", { name: "A Century at the Present Settlement" })).toBeVisible();
      await expect(page.getByText(/around 1926/i)).toBeVisible();
      await expect(page.getByText(/approximately a century at the present settlement/i).first()).toBeVisible();

      const bodyText = await page.innerText("body");
      expect(bodyText).not.toMatch(/Takete-Ide was founded in 1926/i);
      expect(bodyText).not.toMatch(/Takete-Ide began in 1926/i);
      expect(bodyText).not.toMatch(/Takete-Ide is only 100 years old/i);
    });
  });

  test.describe("Homepage history preview & wording", () => {
    test("homepage displays history preview linking to /our-story with updated milestone", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "From the Hills to a Home of Peace" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Present Settlement — c.1926–Present" })).toBeVisible();
      await expect(page.getByText("Generations of culture and tradition.")).toBeVisible();

      const bodyText = await page.innerText("body");
      expect(bodyText).not.toContain("Centuries of culture and tradition.");

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

    test("heritage page surfaces Land, Water & Memory with authentic landscape photos and landmark list", async ({ page }) => {
      await page.goto("/heritage");
      await expect(page.getByRole("link", { name: /Agbagba Ide/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Land, Water & Memory" })).toBeVisible();
      await expect(page.getByText(/Obasoro, Oke Elegan, Oroke Agodi/i)).toBeVisible();
      await expect(page.getByText(/Eba, Owowo, Oga, Ibedo/i)).toBeVisible();
    });
  });

  test.describe("Digital Archive deep historical record", () => {
    test("archive displays Takete-Ide Historical Community Account with branded cover, precise metadata, inside cards and migration strip", async ({ page }) => {
      await page.goto("/archive");
      await expect(page.getByText("Takete-Ide Historical Community Account").first()).toBeVisible();

      // Navigate to detail
      await page.getByRole("link", { name: /Takete-Ide Historical Community Account/i }).click();
      await expect(page).toHaveURL(/takete-history-original/);
      await expect(page.getByRole("heading", { name: "Takete-Ide Historical Community Account", level: 1 })).toBeVisible();

      // Ensure no invented date
      const text = await page.locator("main").innerText();
      expect(text).not.toContain("1 January 2026");
      expect(text).not.toContain("Jan 1, 2026");
      await expect(page.getByText("Not stated in supplied manuscript")).toBeVisible();

      // Ensure author and source type
      await expect(page.getByText("Not stated in supplied copy")).toBeVisible();
      await expect(page.getByText("Community historical account and oral-tradition compilation")).toBeVisible();

      // Ensure branded archive document cover renders
      await expect(page.locator('[aria-label="Archive document cover"]')).toBeVisible();

      // Inside this Historical Account
      await expect(page.getByRole("heading", { name: "Inside this Historical Account" })).toBeVisible();
      await expect(page.getByText("1. Takete-Idera — A Place of Comfort")).toBeVisible();
      await expect(page.getByText("2. Takete within Amuro & Okun")).toBeVisible();
      await expect(page.getByText("4. The Migration Journey")).toBeVisible();
      await expect(page.getByText("6. Traditional Institution & Cultural Memory")).toBeVisible();

      // Migration Sequence strip
      await expect(page.getByRole("heading", { name: "Historical Migration Sequence" })).toBeVisible();

      // Ileteju transition feature
      await expect(page.getByRole("heading", { name: "Ileteju to Takete-Idera" })).toBeVisible();

      // Related Heritage
      await expect(page.getByRole("heading", { name: "Related Heritage & Public Pages" })).toBeVisible();
    });
  });

  test.describe("Traditional Institution deep integration", () => {
    test("traditional institution renders Olu'de introduction, Amuro structure, 13th ruler manuscript identification, and 12-ruler register", async ({ page }) => {
      const res = await page.goto("/heritage/traditional-institution");
      expect(res?.status()).toBe(200);

      // Olu'de introduction
      await expect(page.getByRole("heading", { name: "The Olu’de and the Takete-Ide Traditional Council" })).toBeVisible();

      // Palace placeholder present (not misattributed event photo)
      await expect(page.getByText("Authentic palace / traditional council photograph being verified")).toBeVisible();

      // Amuro structure
      await expect(page.getByRole("heading", { name: "Takete-Ide within the Amuro Traditional Structure" })).toBeVisible();
      await expect(page.getByText(/Alamuro heads the wider Amuro Traditional Council/i)).toBeVisible();

      // Manuscript identification of 13th Olu'de
      await expect(page.getByText("Manuscript Identification")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Oba Philip Ebilakun (Manuscript Record)" })).toBeVisible();
      await expect(page.getByText(/Current-status confirmation with the traditional institution remains pending/i)).toBeVisible();

      // Historical Olu'de Register (12 rulers)
      await expect(page.getByRole("heading", { name: "Historical Olu’de Register" })).toBeVisible();
      await expect(page.getByText("Olu’de Opalu")).toBeVisible();
      await expect(page.getByText("Olu’de Ide")).toBeVisible();
      await expect(page.getByText("Olu’de Oriko")).toBeVisible();
      await expect(page.getByText("Olu’de J.A. Fiki")).toBeVisible();

      // No 198× or 200×
      const bodyText = await page.innerText("body");
      expect(bodyText).not.toContain("198×");
      expect(bodyText).not.toContain("200×");
    });
  });

  test.describe("Site Search for historical topics", () => {
    test("finds key historical terms across public pages", async ({ page }) => {
      for (const term of ["Takete-Idera", "Amuro-Odo", "Ilu-Oke", "Agbagba Ide", "Ileteju", "Traditional Institution"]) {
        await page.goto(`/search?q=${encodeURIComponent(term)}`);
        await expect(page.getByText(/results? for/i)).toBeVisible();
        await expect(page.getByText(/No results for/i)).toHaveCount(0);
      }
    });
  });

  test.describe("Safeguards & Responsive Layout", () => {
    test("no internal editorial paths or unresolved ruler dates exposed publicly", async ({ page }) => {
      for (const path of ["/our-story", "/centenary", "/heritage", "/heritage/agbagba-ide", "/heritage/traditional-institution", "/archive", "/archive/takete-history-original"]) {
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
        for (const route of ["/our-story", "/centenary", "/heritage/agbagba-ide", "/heritage/traditional-institution", "/archive/takete-history-original"]) {
          await page.goto(route);
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
        }
      }
    });
  });
});
