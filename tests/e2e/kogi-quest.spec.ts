import { test, expect } from "@playwright/test";

test.describe("Kogi Quest — Interactive Confluence Challenge Experience", () => {
  test("homepage displays attractive promotional card linking to /kogi-quest", async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Think You Know Kogi State?" });
    await expect(heading).toBeVisible();

    await expect(
      page.getByText("Test your knowledge, progress through exciting levels and compete for a place on the Kogi Quest leaderboard.")
    ).toBeVisible();

    const promoCard = page.locator("section", { hasText: "Think You Know Kogi State?" });
    const playBtn = promoCard.locator("a[href='/kogi-quest']", { hasText: "Play Kogi Quest" });
    await expect(playBtn).toBeVisible();
  });

  test("desktop top-level navigation displays Kogi Quest between Support and Weather in exact order", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    
    // Top-level link properties
    const questLink = primaryNav.getByRole("link", { name: /Play Kogi Quest|Kogi Quest/i });
    await expect(questLink).toBeVisible();
    await expect(questLink).toHaveText("Kogi Quest");
    await expect(questLink).toHaveAttribute("href", "/kogi-quest");
    await expect(questLink).toHaveAttribute("aria-label", "Play Kogi Quest");
    await expect(questLink).toHaveAttribute("title", "Play Kogi Quest");

    // Verify exact navigation order: Home -> About -> Explore -> Community -> News & Events -> Centenary 2026 -> Support -> Kogi Quest -> Weather
    const navItems = primaryNav.locator("> a, > div > button, > div > a");
    const itemTexts = await navItems.allTextContents();
    const cleanTexts = itemTexts.map((t) => t.trim().replace(/\s+/g, " "));

    expect(cleanTexts).toEqual([
      "Home",
      "About",
      "Explore",
      "Community",
      "News & Events",
      "Centenary 2026",
      "Support",
      "Kogi Quest",
      "Weather",
    ]);

    // Verify Explore dropdown menu does NOT contain Kogi Quest
    await primaryNav.getByRole("button", { name: "Explore" }).hover();
    const exploreDropdown = primaryNav.locator("div.shadow-2xl").locator("a[href='/kogi-quest']");
    await expect(exploreDropdown).toHaveCount(0);
  });

  test("mobile navigation drawer displays standalone Play Kogi Quest item near top", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // Open mobile menu
    await page.getByRole("button", { name: "Open menu" }).click();

    const mobileNav = page.getByRole("dialog", { name: "Site navigation" });
    await expect(mobileNav).toBeVisible();

    const mobileQuestLink = mobileNav.getByRole("link", { name: /Play Kogi Quest/i });
    await expect(mobileQuestLink).toBeVisible();
    await expect(mobileQuestLink).toHaveAttribute("href", "/kogi-quest");

    // Click and verify navigation
    await mobileQuestLink.click();
    await expect(page).toHaveURL(/\/kogi-quest$/);
  });

  test("footer contains exactly one valid link to /kogi-quest", async ({ page }) => {
    await page.goto("/");

    const footerLinks = page.locator("footer a[href='/kogi-quest']");
    await expect(footerLinks).toHaveCount(1);
    await expect(footerLinks.first()).toBeVisible();
    await expect(footerLinks.first()).toHaveText("Kogi Quest");
  });

  test("education page contains promotional callout for Kogi Quest", async ({ page }) => {
    await page.goto("/education");

    const calloutHeading = page.getByRole("heading", { name: /Kogi Quest: Test Your Knowledge/i });
    await expect(calloutHeading).toBeVisible();

    const calloutSection = page.locator("div", { hasText: "Kogi Quest: Test Your Knowledge" });
    const calloutBtn = calloutSection.locator("a[href='/kogi-quest']", { hasText: "Play Kogi Quest" }).first();
    await expect(calloutBtn).toBeVisible();
  });

  test("/kogi-quest renders complete headline, introduction, notice and highlights", async ({ page }) => {
    await page.goto("/kogi-quest");

    await expect(
      page.getByRole("heading", { name: "Kogi Quest: How Well Do You Know the Confluence State?" })
    ).toBeVisible();

    await expect(
      page.getByText("Explore the history, culture, people and remarkable places of Kogi State")
    ).toBeVisible();

    await expect(
      page.getByText("Do you have what it takes to become a Legend of the Confluence?").first()
    ).toBeVisible();

    await expect(
      page.getByText("Sign in or create a free player account to begin the quest and record your score on the leaderboard.")
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "Start the Quest" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Play Full Screen" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Challenge Your Friends" }).first()).toBeVisible();

    await expect(page.getByText("Powered by Omoyele EduVerse.").first()).toBeVisible();

    await expect(page.getByText("Multiple Knowledge Levels")).toBeVisible();
    await expect(page.getByText("Instant Answer Feedback")).toBeVisible();
    await expect(page.getByText("Score Tracking")).toBeVisible();
    await expect(page.getByText("Global Leaderboard")).toBeVisible();
    await expect(page.getByText("Educational & Entertaining")).toBeVisible();
    await expect(page.getByText("Free to Play")).toBeVisible();
  });

  test("click-to-load design prevents iframe download until visitor clicks Start the Quest", async ({ page }) => {
    await page.goto("/kogi-quest");

    expect(await page.locator("iframe").count()).toBe(0);

    await page.getByRole("button", { name: "Start the Quest" }).click();

    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", "https://dju78.github.io/kogiqest/");
    await expect(iframe).toHaveAttribute("title", /Kogi Quest/i);

    const directLink = page.getByRole("link", { name: /Open Direct Game Link/i });
    await expect(directLink).toBeVisible();
    await expect(directLink).toHaveAttribute("href", "https://dju78.github.io/kogiqest/");
  });

  test("iframe permissions contain only valid Permissions Policy tokens without sandbox tokens", async ({ page }) => {
    await page.goto("/kogi-quest");
    await page.getByRole("button", { name: "Start the Quest" }).click();

    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();

    const allowAttr = await iframe.getAttribute("allow");
    expect(allowAttr).toBeTruthy();
    expect(allowAttr).not.toContain("scripts");
    expect(allowAttr).not.toContain("forms");
    expect(allowAttr).not.toContain("same-origin");
    expect(allowAttr).toContain("fullscreen");
    expect(allowAttr).toContain("clipboard-write");
  });

  test("reload button genuinely remounts iframe and removes loading overlay on load", async ({ page }) => {
    await page.goto("/kogi-quest");
    await page.getByRole("button", { name: "Start the Quest" }).click();

    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();

    // Wait for initial load
    const loadingOverlay = page.locator("[data-testid='kogi-quest-loading']");
    await expect(loadingOverlay).toHaveCount(0, { timeout: 15000 });

    // Click Reload button
    const reloadBtn = page.getByRole("button", { name: "Reload game frame" });
    await expect(reloadBtn).toBeVisible();
    await reloadBtn.click();

    // The iframe remounts and load completes, removing loading overlay
    await expect(loadingOverlay).toHaveCount(0, { timeout: 15000 });
    await expect(page.locator("iframe")).toBeVisible();
  });

  test("sharing features include WhatsApp and copy-link with canonical URL", async ({ page }) => {
    await page.goto("/kogi-quest");

    const whatsappLink = page.locator("a[aria-label='Share Kogi Quest challenge on WhatsApp']");
    await expect(whatsappLink).toBeVisible();
    const href = await whatsappLink.getAttribute("href");
    expect(href).toContain("api.whatsapp.com/send");
    expect(href).toContain("https%3A%2F%2Ftakete-ide.org%2Fkogi-quest");

    const copyBtn = page.locator("button[aria-label='Copy Kogi Quest link']");
    await expect(copyBtn).toBeVisible();
  });

  test("SEO metadata, canonical URL, sitemap, and structured data are valid", async ({ request, page }) => {
    await page.goto("/kogi-quest");

    await expect(page).toHaveTitle("Kogi Quest | Test Your Knowledge of Kogi State | Takete-Ide Amuro");
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toContain("Play Kogi Quest and test your knowledge of Kogi State");

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://takete-ide.org/kogi-quest");

    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    expect(ogUrl).toBe("https://takete-ide.org/kogi-quest");

    const jsonLdContent = await page.locator('script[type="application/ld+json"]').allTextContents();
    const gameSchema = jsonLdContent.find((t) => t.includes('"WebApplication"') || t.includes('"GameApplication"'));
    expect(gameSchema).toBeTruthy();
    expect(gameSchema).toContain('"name":"Kogi Quest"');
    expect(gameSchema).toContain('"url":"https://takete-ide.org/kogi-quest"');
    expect(gameSchema).toContain('"isAccessibleForFree":true');

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).toContain("<loc>https://takete-ide.org/kogi-quest</loc>");
  });

  const viewports = [
    { name: "mobile-320", width: 320, height: 600 },
    { name: "mobile-375", width: 375, height: 667 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1024", width: 1024, height: 768 },
    { name: "desktop-1280", width: 1280, height: 800 },
    { name: "desktop-1320", width: 1320, height: 800 },
    { name: "desktop-1440", width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`renders / without horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`renders /kogi-quest without horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/kogi-quest");

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  }
});
