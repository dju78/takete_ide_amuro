import { test, expect } from "@playwright/test";

test.describe("Takete-Ide complete historical integration & depth", () => {
  test.describe("/our-story primary historical experience", () => {
    test("renders hero, Takete-Idera, migration stages, archive CTA, and valid section anchor targets", async ({ page }) => {
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

      // Confirm exact section anchor IDs exist on the page
      const requiredAnchorIds = [
        "a-place-of-comfort",
        "takete-within-amuro",
        "earlier-roots",
        "the-search-for-peace",
        "journey",
        "home-at-last",
        "faith-and-development",
        "community-memory",
      ];
      for (const id of requiredAnchorIds) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }

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

  test.describe("Heritage, Festivals & Okuta Gboro", () => {
    test("renders /heritage/agbagba-ide with cultural memory framing and praise traditions", async ({ page }) => {
      const res = await page.goto("/heritage/agbagba-ide");
      expect(res?.status()).toBe(200);

      await expect(page.getByRole("heading", { name: "Agbagba Ide", level: 1 })).toBeVisible();
      await expect(page.getByText("Symbol, Memory and Community Tradition")).toBeVisible();
      await expect(page.getByRole("heading", { name: "A Sanctuary in Times of Conflict" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Anthem & Praise Traditions" })).toBeVisible();
      await expect(page.getByText(/Takete-Ide Community Anthem/i).first()).toBeVisible();
      await expect(page.getByText(/Oríkì Agbagba Ide/i).first()).toBeVisible();

      // Links to anthem page
      const anthemLink = page.getByRole("link", { name: /Read full verbatim Anthem & Oríkì/i });
      await expect(anthemLink).toBeVisible();
      await expect(anthemLink).toHaveAttribute("href", "/heritage/takete-ide-anthem");
    });

    test("heritage page surfaces Ogun Festival, Land & Water with Okuta Gboro, and distinct gallery links", async ({ page }) => {
      await page.goto("/heritage");
      await expect(page.locator('a[href="/heritage/agbagba-ide"]')).toBeVisible();
      await expect(page.locator('a[href="/heritage/takete-ide-anthem"]')).toBeVisible();

      // Ogun Festival discoverable
      await expect(page.getByRole("heading", { name: "Ogun Festival" })).toBeVisible();
      await expect(
        page.getByAltText(/A cultural gathering of community members associated with the Ogun Festival in Takete-Ide/i),
      ).toBeVisible();
      const exploreCulturalLink = page.getByRole("link", { name: /Explore Cultural Gallery/i });
      await expect(exploreCulturalLink).toBeVisible();
      await expect(exploreCulturalLink).toHaveAttribute("href", "/gallery?category=Culture+%26+Events");

      // Land, Water & Memory with Okuta Gboro
      await expect(page.getByRole("heading", { name: "Land, Water & Memory" })).toBeVisible();
      await expect(page.getByAltText(/Okuta Gboro, a prominent rock formation/i)).toBeVisible();
      await expect(page.getByText(/Obasoro, Oke Elegan, Oroke Agodi/i)).toBeVisible();
      await expect(page.getByText(/Eba, Owowo, Oga, Ibedo/i)).toBeVisible();

      // Separate links for Nature vs Landmarks
      const natureLink = page.getByRole("link", { name: /Nature & waterways/i });
      await expect(natureLink).toBeVisible();
      await expect(natureLink).toHaveAttribute("href", "/gallery?category=Nature");

      const landmarkLink = page.getByRole("link", { name: /Community landmarks/i });
      await expect(landmarkLink).toBeVisible();
      await expect(landmarkLink).toHaveAttribute("href", "/gallery?category=Landmarks");

      // No obsolete spelling "Okuta Gbooro"
      const bodyText = await page.innerText("body");
      expect(bodyText).not.toContain("Okuta Gbooro");
    });
  });

  test.describe("Living Oral Heritage: Takete-Ide Community Anthem & Oríkì", () => {
    test("renders anthem page with verbatim original Yoruba lyrics and distinct Oríkì", async ({ page }) => {
      const res = await page.goto("/heritage/takete-ide-anthem");
      expect(res?.status()).toBe(200);

      // Hero
      await expect(page.getByRole("heading", { name: "Takete-Ide Community Anthem", level: 1 })).toBeVisible();
      await expect(page.getByText("Community Anthem / Preserved Oral Heritage")).toBeVisible();

      // Verbatim Anthem lines
      await expect(page.getByText("Takete Ide ilu olokiki, ngha tedo h’owo oke")).toBeVisible();
      await expect(page.getByText("Ile nghin san ghun wara at’oyin").first()).toBeVisible();
      await expect(page.getByText("Solo/ T’agbe Tahete Ide ga")).toBeVisible();
      await expect(page.getByText("All/ T.agbe Takete Ide ga")).toBeVisible();

      // Distinct Oríkì Agbagba Ide section
      await expect(page.getByRole("heading", { name: "Oríkì Agbagba Ide" })).toBeVisible();
      await expect(page.getByText("Oni e ha h’abe re ojo a pa")).toBeVisible();
      await expect(page.getByText("A mi g’orun ghanghan l’ekikan")).toBeVisible();

      // No invented translations
      const bodyText = await page.innerText("body");
      expect(bodyText).not.toContain("198×");
      expect(bodyText).not.toContain("200×");
    });
  });

  test.describe("Digital Archive deep historical record & correct anchors", () => {
    test("archive displays Takete-Ide Historical Community Account with branded cover, valid section anchors, and separate nature/landmark links", async ({ page }) => {
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

      // Inside this Historical Account links point to valid Our Story anchor targets
      await expect(page.locator('a[href="/our-story#a-place-of-comfort"]')).toBeVisible();
      await expect(page.locator('a[href="/our-story#takete-within-amuro"]')).toBeVisible();
      await expect(page.locator('a[href="/our-story#the-search-for-peace"]')).toBeVisible();
      await expect(page.locator('a[href="/our-story#journey"]').first()).toBeVisible();

      // Distinct Natural Heritage vs Landmarks related cards
      await expect(page.locator('a[href="/gallery?category=Nature"]')).toBeVisible();
      await expect(page.locator('a[href="/gallery?category=Landmarks"]')).toBeVisible();

      // Migration Sequence strip
      await expect(page.getByRole("heading", { name: "Historical Migration Sequence" })).toBeVisible();

      // Ileteju transition feature
      await expect(page.getByRole("heading", { name: "Ileteju to Takete-Idera" })).toBeVisible();
    });
  });

  test.describe("Traditional Institution & Shared Register", () => {
    test("traditional institution renders dignitaries image, Oba Philip Ebilakun portrait, confirmed register, and cross-link to compounds", async ({ page }) => {
      const res = await page.goto("/heritage/traditional-institution");
      expect(res?.status()).toBe(200);

      // Olu'de introduction
      await expect(page.getByRole("heading", { name: "The Olu’de and the Takete-Ide Traditional Council" })).toBeVisible();

      // Authentic Traditional & Community Dignitaries image present
      await expect(
        page.getByAltText(/Traditional and community leaders seated together in ceremonial attire at a Takete-Ide gathering/i),
      ).toBeVisible();

      // Amuro structure
      await expect(page.getByRole("heading", { name: "Takete-Ide within the Amuro Traditional Structure" })).toBeVisible();
      await expect(page.getByText(/Alamuro heads the wider Amuro Traditional Council/i)).toBeVisible();

      // Manuscript identification of 13th Olu'de with authentic portrait
      await expect(page.getByText("Manuscript Identification")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Oba Philip Ebilakun (Manuscript Record)" })).toBeVisible();
      await expect(page.getByAltText(/Portrait of Oba Philip Ebilakun in royal attire/i)).toBeVisible();

      // Historical Olu'de Register (12 rulers with confirmed family & ward affiliations)
      await expect(page.getByRole("heading", { name: "Historical Olu’de Register" })).toBeVisible();
      
      const expectedRulers = [
        { name: "Olu’de Opalu", family: "Atemayi", ward: "Oke-Ako" },
        { name: "Olu’de Ide", family: "Eseyintelu", ward: "Ile-Nla" },
        { name: "Olu’de Oriko", family: "Oriko", ward: "Osikegun" },
        { name: "Olu’de Atte Gbogori", family: "Atemesami", ward: "Osikegun" },
        { name: "Olu’de Orunmbe", family: "Eseyintelu", ward: "Osikegun" },
        { name: "Olu’de Obadofin Obere", family: "Atemeji", ward: "Oketaro" },
        { name: "Olu’de Obaba Omologun", family: "Atemeto", ward: "Oke-Oja" },
        { name: "Olu’de Obajemu Atepa", family: "Atemogbe", ward: "Oke-Oja" },
        { name: "Olu’de Elewa", family: "Eseyinmeleri", ward: "Osikegun" },
        { name: "Olu’de Obajemu Ate", family: "Atejagbo", ward: "Osikegun" },
        { name: "Olu’de Alufa Olukotun", family: "Atejaba", ward: "Oketaro" },
        { name: "Olu’de J.A. Fiki", family: "Atemayi", ward: "Oke-Oja" },
      ];

      for (const ruler of expectedRulers) {
        await expect(page.getByText(ruler.name).first()).toBeVisible();
        await expect(page.getByText(ruler.family).first()).toBeVisible();
        await expect(page.getByText(ruler.ward).first()).toBeVisible();
      }

      // Cross-link to compounds & families
      await expect(page.getByRole("heading", { name: "Explore Compounds & Families" })).toBeVisible();
      await expect(page.getByRole("link", { name: "View Compounds →" })).toBeVisible();
      await expect(page.getByRole("link", { name: "View Families →" })).toBeVisible();

      // No 198× or 200×
      const bodyText = await page.innerText("body");
      expect(bodyText).not.toContain("198×");
      expect(bodyText).not.toContain("200×");
    });
  });

  test.describe("Documented Families & Compounds Integration", () => {
    test("/families/compounds renders 5 unique documented compounds with families and Olu'des", async ({ page }) => {
      const res = await page.goto("/families/compounds");
      expect(res?.status()).toBe(200);

      // Heading and explanatory safeguard
      await expect(
        page.getByRole("heading", { name: "Compounds Documented in the Historical Olu’de Register" }),
      ).toBeVisible();
      await expect(
        page.getByText(/should not be treated as a complete list of every compound in Takete-Ide/i),
      ).toBeVisible();

      // All 5 unique compounds present
      const expectedCompounds = [
        { name: "Oke-Ako", family: "Atemayi", ruler: "Olu’de Opalu" },
        { name: "Ile-Nla", family: "Eseyintelu", ruler: "Olu’de Ide" },
        { name: "Osikegun", family: "Oriko", ruler: "Olu’de Oriko" },
        { name: "Oketaro", family: "Atemeji", ruler: "Olu’de Obadofin Obere" },
        { name: "Oke-Oja", family: "Atemeto", ruler: "Olu’de Obaba Omologun" },
      ];

      for (const comp of expectedCompounds) {
        await expect(page.getByRole("heading", { name: comp.name, level: 2 })).toBeVisible();
        await expect(page.getByText(comp.family).first()).toBeVisible();
        await expect(page.getByText(comp.ruler).first()).toBeVisible();
      }

      // Badge
      await expect(page.getByText("Historical manuscript record").first()).toBeVisible();

      // Cross link to Traditional Institution
      await expect(page.getByRole("link", { name: /View Traditional Institution register/i })).toBeVisible();

      // Safeguard note for community profiles
      await expect(
        page.getByText(/Detailed compound profiles, photographs and oral histories will be added/i),
      ).toBeVisible();
    });

    test("/families renders 10 unique documented families with multiple compound associations and updated cards", async ({ page }) => {
      const res = await page.goto("/families");
      expect(res?.status()).toBe(200);

      // Card description updated
      await expect(
        page.getByText("Explore documented Takete-Ide compounds and their historical family associations."),
      ).toBeVisible();

      // Section heading and safeguard
      await expect(
        page.getByRole("heading", { name: "Families Documented in the Historical Olu’de Register" }),
      ).toBeVisible();
      await expect(
        page.getByText(/do not necessarily represent every Takete-Ide family/i),
      ).toBeVisible();

      // 10 unique families
      const uniqueFamilies = [
        "Atejaba",
        "Atejagbo",
        "Atemayi",
        "Atemeji",
        "Atemesami",
        "Atemeto",
        "Atemogbe",
        "Eseyinmeleri",
        "Eseyintelu",
        "Oriko",
      ];

      for (const fam of uniqueFamilies) {
        await expect(page.getByRole("heading", { name: fam, level: 2 })).toBeVisible();
      }

      // Atemayi shows both Oke-Ako and Oke-Oja
      const atemayiHeading = page.getByRole("heading", { name: "Atemayi", level: 2 });
      const atemayiCard = atemayiHeading.locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')]");
      await expect(atemayiCard.getByRole("link", { name: "Oke-Ako" })).toBeVisible();
      await expect(atemayiCard.getByRole("link", { name: "Oke-Oja" })).toBeVisible();

      // Eseyintelu shows both Ile-Nla and Osikegun
      const eseyinteluHeading = page.getByRole("heading", { name: "Eseyintelu", level: 2 });
      const eseyinteluCard = eseyinteluHeading.locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')]");
      await expect(eseyinteluCard.getByRole("link", { name: "Ile-Nla" })).toBeVisible();
      await expect(eseyinteluCard.getByRole("link", { name: "Osikegun" })).toBeVisible();
    });
  });

  test.describe("Authentic Community Media & Facilities", () => {
    test("traditional marriage renders wedding gifts section with authentic photos", async ({ page }) => {
      await page.goto("/heritage/traditional-marriage");
      await expect(page.getByRole("heading", { name: "Gifts, Household Preparation & Celebration" })).toBeVisible();
      await expect(
        page.getByAltText(/Household items and gift presentations prepared for a traditional marriage ceremony/i),
      ).toBeVisible();
      await expect(
        page.getByAltText(/Gift presentations and gathering of family members at a Takete-Ide traditional marriage celebration/i),
      ).toBeVisible();
    });

    test("Ate page renders authentic Egungun festival gathering photo", async ({ page }) => {
      await page.goto("/heritage/ate");
      await expect(
        page.getByAltText(/Community members gathered around an Egungun masquerade at a cultural celebration in Takete-Ide/i),
      ).toBeVisible();
    });

    test("development page renders CVB Primary Health Centre facility image", async ({ page }) => {
      await page.goto("/development");
      await expect(page.getByRole("heading", { name: "Community Infrastructure & Facilities" })).toBeVisible();
      await expect(page.getByText("CVB Primary Health Centre, Takete-Ide")).toBeVisible();
      await expect(page.getByAltText(/Building facade and signboard of the CVB Primary Health Centre/i)).toBeVisible();
    });

    test("gallery landmarks renders authentic Okuta Gboro without placeholder tag", async ({ page }) => {
      await page.goto("/gallery?category=Landmarks");
      await expect(page.getByText("Okuta Gboro").first()).toBeVisible();
      await expect(page.getByAltText(/Okuta Gboro, a prominent rock formation/i)).toBeVisible();
    });
  });

  test.describe("Site Search for historical topics", () => {
    test("finds key historical terms across public pages", async ({ page }) => {
      for (const term of [
        "Takete-Idera",
        "Amuro-Odo",
        "Ilu-Oke",
        "Agbagba Ide",
        "Ileteju",
        "Traditional Institution",
        "Takete-Ide Anthem",
        "Ate",
        "Compounds",
      ]) {
        await page.goto(`/search?q=${encodeURIComponent(term)}`);
        await expect(page.getByText(/results? for/i)).toBeVisible();
        await expect(page.getByText(/No results for/i)).toHaveCount(0);
      }
    });
  });

  test.describe("Safeguards & Responsive Layout", () => {
    test("no internal editorial paths or unresolved ruler dates exposed publicly", async ({ page }) => {
      for (const path of [
        "/our-story",
        "/centenary",
        "/heritage",
        "/heritage/agbagba-ide",
        "/heritage/traditional-institution",
        "/heritage/traditional-marriage",
        "/heritage/ate",
        "/heritage/takete-ide-anthem",
        "/families",
        "/families/compounds",
        "/development",
        "/archive",
        "/archive/takete-history-original",
      ]) {
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
        for (const route of [
          "/our-story",
          "/centenary",
          "/heritage/agbagba-ide",
          "/heritage/traditional-institution",
          "/heritage/traditional-marriage",
          "/heritage/ate",
          "/heritage/takete-ide-anthem",
          "/families",
          "/families/compounds",
          "/development",
          "/archive/takete-history-original",
        ]) {
          await page.goto(route);
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
        }
      }
    });
  });
});
