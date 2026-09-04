import { test, expect } from "@playwright/test";

test.describe("Faith & Religious Heritage Section — Takete-Ide Archive", () => {
  test.describe("/heritage/faith primary landing page", () => {
    test("renders hero, breadcrumbs, disclaimers, and main historical sections", async ({ page }) => {
      const res = await page.goto("/heritage/faith");
      expect(res?.status()).toBe(200);

      // Hero
      await expect(page.getByRole("heading", { name: "Faith & Religious Heritage", level: 1 })).toBeVisible();
      await expect(page.getByText(/Faith has formed an important part of Takete-Ide’s cultural and community life/i)).toBeVisible();
      await expect(page.getByText(/This archive preserves historical accounts, places of worship/i)).toBeVisible();

      // Breadcrumb check
      const breadcrumb = page.locator("nav[aria-label='Breadcrumb']");
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByText("Culture & Heritage")).toBeVisible();
      await expect(breadcrumb.getByText("Faith & Religious Heritage")).toBeVisible();

      // Section A: Indigenous Religious Heritage
      await expect(
        page.getByRole("heading", { name: "Indigenous Religious Heritage of Takete-Ide" }),
      ).toBeVisible();
      await expect(page.getByText(/Orisa Oke/i).first()).toBeVisible();
      await expect(page.getByText(/Olu Orun/i).first()).toBeVisible();
      await expect(page.getByText(/Obarisa/i).first()).toBeVisible();
      await expect(page.getByRole("heading", { name: /Agado & Oliwo Traditions/i })).toBeVisible();
      await expect(page.getByText(/Akorowo/i).first()).toBeVisible();
      await expect(page.getByText(/Ate/i).first()).toBeVisible();
      await expect(page.getByText(/Origi/i).first()).toBeVisible();
      await expect(page.getByText(/Apa Rege Rege/i).first()).toBeVisible();
      await expect(page.getByText(/Otutumoba/i).first()).toBeVisible();

      // Links to existing dedicated heritage pages
      await expect(page.getByRole("link", { name: /Explore Agado Heritage/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /Explore Ate \(Egungun\) Heritage/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /Explore Agbagba Ide Sanctuary/i })).toBeVisible();

      // Egungun Festival authentic video player
      await expect(page.getByRole("heading", { name: /Egungun Festival — Living Cultural/i })).toBeVisible();
      const videoPlayer = page.locator("video[aria-label*='Egungun Festival']");
      await expect(videoPlayer).toBeVisible();
      await expect(videoPlayer.locator("source")).toHaveAttribute("src", "/videos/takete-ide/egungun-festival.mp4");

      // Section B: Christianity Comes to Yagba (Regional Context)
      await expect(page.getByRole("heading", { name: "Christianity Comes to Yagba" })).toBeVisible();
      await expect(page.getByText(/E. P. Lang/i).first()).toBeVisible();
      await expect(page.getByText(/Tommie.*Titcombe/i).first()).toBeVisible();
      await expect(page.getByText(/31 October 1909/i).first()).toBeVisible();
      await expect(page.getByText(/From mission centres such as Ogga and Egbe/i)).toBeVisible();

      // Section C: Christianity Reaches Takete-Ide
      await expect(page.getByRole("heading", { name: "Christianity Reaches Takete-Ide" })).toBeVisible();
      await expect(page.getByText(/By 1922, an active Christian congregation/i)).toBeVisible();
      await expect(page.getByText(/1919 Introduction Reference in Community Records/i)).toBeVisible();

      // Section D: Churches of Takete-Ide
      await expect(page.getByRole("heading", { name: "Churches of Takete-Ide" })).toBeVisible();

      // Section E: Religious Heritage Timeline
      await expect(page.getByRole("heading", { name: "Religious Heritage Timeline" })).toBeVisible();

      // Section F: Places of Worship Gallery Link
      await expect(page.getByRole("heading", { name: "Places of Worship Gallery" })).toBeVisible();
      const galleryLink = page.getByRole("link", { name: /View Places of Worship Gallery/i });
      await expect(galleryLink).toBeVisible();
      await expect(galleryLink).toHaveAttribute("href", "/gallery?category=Places+of+Worship");
    });

    test("church directory contains all 13 churches in exact specified order", async ({ page }) => {
      await page.goto("/heritage/faith");

      const expectedOrder = [
        "First ECWA Church, Takete-Ide",
        "First Baptist Church, Takete-Ide",
        "The Apostolic Church, Takete-Ide",
        "Christ Apostolic Church (CAC), Takete-Ide",
        "Cherubim and Seraphim Church, Takete-Ide",
        "Second ECWA Church, Takete-Ide",
        "Redeemed Christian Church of God (RCCG), Takete-Ide",
        "Church of God in Christ, Takete-Ide",
        "Seed of Christ Golden Church (Sebioba), Takete-Ide",
        "Second Apostolic Church, Takete-Ide",
        "Healing Church, Takete-Ide",
        "Deeper Life Bible Church, Takete-Ide",
        "Christ Bible Baptist Church, Takete-Ide",
      ];

      // Retrieve all church headings in order
      const churchCards = page.locator("#churches article");
      await expect(churchCards).toHaveCount(13);

      for (let i = 0; i < expectedOrder.length; i++) {
        const card = churchCards.nth(i);
        await expect(card.getByRole("heading", { level: 3 })).toHaveText(expectedOrder[i]);
      }

      // First and Second ECWA remain separate entries
      const firstEcwa = churchCards.nth(0);
      const secondEcwa = churchCards.nth(5);
      await expect(firstEcwa).toContainText("First ECWA Church");
      await expect(secondEcwa).toContainText("Second ECWA Church");

      // The Apostolic Church and Second Apostolic Church remain separate entries
      const firstApostolic = churchCards.nth(2);
      const secondApostolic = churchCards.nth(9);
      await expect(firstApostolic).toContainText("The Apostolic Church");
      await expect(secondApostolic).toContainText("Second Apostolic Church");

      // First ECWA uses its authentic image and caption
      await expect(firstEcwa.locator("img")).toHaveAttribute("src", /first-ecwa-church-takete-ide\.jpg/);
      await expect(firstEcwa).toContainText("present-day church building");

      // Second ECWA uses its authentic image and caption
      await expect(secondEcwa.locator("img")).toHaveAttribute("src", /second-ecwa-church-takete-ide\.jpg/);
      await expect(secondEcwa).toContainText("present-day church building");

      // First Baptist displays November 1922 and links to full history
      const firstBaptist = churchCards.nth(1);
      await expect(firstBaptist).toContainText("November 1922");
      const readHistoryBtn = firstBaptist.getByRole("link", { name: /Read church history/i });
      await expect(readHistoryBtn).toBeVisible();
      await expect(readHistoryBtn).toHaveAttribute("href", "/heritage/faith/first-baptist-church");

      // Incomplete/newly confirmed churches show "Historical profile being documented" and placeholder text
      const sebioba = churchCards.nth(8);
      await expect(sebioba).toContainText("Seed of Christ Golden Church (Sebioba), Takete-Ide");
      await expect(sebioba).toContainText("Historical profile being documented");

      const healing = churchCards.nth(10);
      await expect(healing).toContainText("Healing Church, Takete-Ide");
      await expect(healing).toContainText("Historical profile being documented");
      await expect(healing).toContainText("Archival photo pending");

      const deeperLife = churchCards.nth(11);
      await expect(deeperLife).toContainText("Deeper Life Bible Church, Takete-Ide");
      await expect(deeperLife).toContainText("Historical profile being documented");
      await expect(deeperLife).toContainText("Archival photo pending");

      const christBibleBaptist = churchCards.nth(12);
      await expect(christBibleBaptist).toContainText("Christ Bible Baptist Church, Takete-Ide");
      await expect(christBibleBaptist).toContainText("Historical profile being documented");
      await expect(christBibleBaptist).toContainText("Archival photo pending");
    });
  });

  test.describe("/heritage/faith/first-baptist-church detail history page", () => {
    test("renders complete 12 sections with verified founders, buildings, pastors, and verification notice", async ({ page }) => {
      const res = await page.goto("/heritage/faith/first-baptist-church");
      expect(res?.status()).toBe(200);

      // Hero
      await expect(page.getByRole("heading", { name: "First Baptist Church, Takete-Ide", level: 1 })).toBeVisible();
      await expect(page.getByText("Established November 1922")).toBeVisible();
      await expect(page.getByText("The birth and growth of the Baptist Mission in Takete-Ide")).toBeVisible();

      // Breadcrumb
      const breadcrumb = page.locator("nav[aria-label='Breadcrumb']");
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByText("Culture & Heritage")).toBeVisible();
      await expect(breadcrumb.getByText("Faith & Religious Heritage")).toBeVisible();
      await expect(breadcrumb.getByText("First Baptist Church")).toBeVisible();

      // Verification note
      await expect(page.getByText("Community Heritage Record")).toBeVisible();
      await expect(page.getByText(/Points Subject to Elder & Register Confirmation/i)).toBeVisible();
      await expect(page.getByText(/Noah Omoyele.*Noah Eseyin/i).first()).toBeVisible();

      // Authentic Image
      await expect(
        page.getByAltText(/First Baptist Church building in Takete-Ide with hills visible behind/i),
      ).toBeVisible();

      // 1. The Birth of the Baptist Mission
      await expect(page.getByRole("heading", { name: /1\. The Birth of the Baptist Mission/i })).toBeVisible();
      await expect(page.getByText(/doctrine of one man, one wife/i)).toBeVisible();

      // 2. Founding of First Baptist Church - 1922
      await expect(page.getByRole("heading", { name: /2\. Founding of First Baptist Church — 1922/i })).toBeVisible();
      await expect(page.getByText(/November 1922/i).first()).toBeVisible();

      // 3. The Six Founders
      await expect(page.getByRole("heading", { name: /3\. The Six Founders/i })).toBeVisible();
      const expectedFounders = [
        "Pa Joash Agunbiade",
        "Pa Luke Olorunleke",
        "Pa Paul Amora",
        "Pa Saul Akedi",
        "Pa Noah Omoyele",
        "Pa Alfred Eseyin",
      ];
      for (const founder of expectedFounders) {
        await expect(page.getByText(founder).first()).toBeVisible();
      }
      await expect(page.getByText("Baba Egbe").first()).toBeVisible();
      await expect(page.getByText("Church Leader").first()).toBeVisible();

      // 4. Early Worship Places & Buildings
      await expect(page.getByRole("heading", { name: /4\. Early Worship Places and Church Buildings/i })).toBeVisible();
      await expect(page.getByText(/mud seats/i).first()).toBeVisible();
      await expect(page.getByText(/1959/i).first()).toBeVisible();

      // 5. Early Pastoral Support
      await expect(page.getByRole("heading", { name: /5\. Early Pastoral Support/i })).toBeVisible();
      await expect(page.getByText(/Rev\. Margi/i).first()).toBeVisible();
      await expect(page.getByText(/Rev\. Agbode/i).first()).toBeVisible();
      await expect(page.getByText(/Pastor Olaleken/i).first()).toBeVisible();

      // 6. Pastoral Leadership 1982-1990
      await expect(page.getByRole("heading", { name: /6\. Pastoral Leadership, 1982–1990/i })).toBeVisible();
      await expect(page.getByText(/HRH Oba Philip Ebilakun/i).first()).toBeVisible();
      await expect(page.getByText(/Rev\. Oyekunle/i).first()).toBeVisible();
      await expect(page.getByText(/Rev\. Agbogun/i).first()).toBeVisible();

      // 7. Aiyedayo Road and Church Land
      await expect(page.getByRole("heading", { name: /7\. Aiyedayo Road and Church Land/i })).toBeVisible();
      await expect(page.getByText(/primary school.*main gate/i)).toBeVisible();

      // 8. Pa Alfred Eseyin (Baba Owa)
      await expect(page.getByRole("heading", { name: /8\. Growth and the Legacy of Pa Alfred Eseyin/i })).toBeVisible();
      await expect(page.getByText(/Bope wani, bo yawa ni, odo Re na lanmbo wa simi/i)).toBeVisible();

      // 9. The Church Farm
      await expect(page.getByRole("heading", { name: /9\. The Church Farm/i })).toBeVisible();
      await expect(page.getByText(/Fridays were customarily dedicated/i)).toBeVisible();

      // 10. Later Leadership
      await expect(page.getByRole("heading", { name: /10\. Later Leadership/i })).toBeVisible();
      await expect(page.getByText("Pa Raphael Elewa").first()).toBeVisible();
      await expect(page.getByText("Chief Reuben Eleah").first()).toBeVisible();

      // 11. Historical Gallery
      await expect(page.getByRole("heading", { name: /11\. Historical Gallery/i })).toBeVisible();

      // 12. Sources & Verification
      await expect(page.getByRole("heading", { name: /12\. Sources & Archival Provenance/i })).toBeVisible();
    });
  });

  test.describe("Cross-site Integration & Navigation", () => {
    test("heritage page links to /heritage/faith with updated Faith teaser copy", async ({ page }) => {
      await page.goto("/heritage");

      // Heading and updated copy
      await expect(page.getByRole("heading", { name: "Faith & Religious Heritage", level: 2 })).toBeVisible();
      await expect(
        page.getByText(/From indigenous religious traditions to the arrival and growth of Christianity/i),
      ).toBeVisible();

      // Primary CTA link to /heritage/faith
      const primaryCta = page.getByRole("link", { name: /Explore Faith & Religious Heritage/i });
      await expect(primaryCta).toBeVisible();
      await expect(primaryCta).toHaveAttribute("href", "/heritage/faith");

      // IconCard link to /heritage/faith
      const iconCardLink = page.locator("a[href='/heritage/faith']").first();
      await expect(iconCardLink).toBeVisible();
    });

    test("our-story page links to /heritage/faith and uses qualified 1919 community record phrasing", async ({ page }) => {
      await page.goto("/our-story");

      await expect(
        page.getByRole("link", { name: /Explore the full Faith & Religious Heritage archive/i }),
      ).toBeVisible();
      await expect(
        page.getByText(/SIM Christianity was introduced according to the community historical record around 1919/i),
      ).toBeVisible();
    });

    test("places of worship gallery resolves and filters correctly", async ({ page }) => {
      await page.goto("/gallery?category=Places+of+Worship");
      await expect(page.getByAltText(/First Baptist Church/i).first()).toBeVisible();
      await expect(page.getByAltText(/First ECWA Church/i).first()).toBeVisible();
    });
  });

  test.describe("Responsive Layout & Safeguards", () => {
    test("no horizontal overflow across viewports on faith heritage pages", async ({ page }) => {
      test.setTimeout(60000);
      const viewports = [
        { name: "320", width: 320, height: 568 },
        { name: "375", width: 375, height: 667 },
        { name: "768", width: 768, height: 1024 },
        { name: "1280", width: 1280, height: 800 },
      ];

      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        for (const route of ["/heritage/faith", "/heritage/faith/first-baptist-church"]) {
          await page.goto(route);
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
        }
      }
    });

    test("safeguards check: no derogatory words or unverified founded dates", async ({ page }) => {
      for (const path of ["/heritage/faith", "/heritage/faith/first-baptist-church"]) {
        await page.goto(path);
        const bodyText = await page.innerText("body");

        // Ensure "pagan" only appears within historical terminology note if at all
        if (bodyText.includes("pagan")) {
          expect(bodyText).toContain("Historical Terminology Note");
        }

        // Ensure no unsupported founding dates
        expect(bodyText).not.toContain("Second ECWA Church was founded in");
        expect(bodyText).not.toContain("The Apostolic Church was founded in");
        expect(bodyText).not.toContain("Christ Apostolic Church was founded in");
        expect(bodyText).not.toContain("Second Apostolic Church was founded in");
        expect(bodyText).not.toContain("Healing Church was founded in");
        expect(bodyText).not.toContain("Deeper Life Bible Church was founded in");
        expect(bodyText).not.toContain("Christ Bible Baptist Church was founded in");
      }
    });
  });
});
