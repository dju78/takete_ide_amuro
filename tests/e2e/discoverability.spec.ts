import { test, expect } from "@playwright/test";

test.describe("Site-wide Public Discoverability & Navigation Pathways", () => {
  test("heritage landing page provides visible feature links to all key heritage sub-pages", async ({ page }) => {
    await page.goto("/heritage");

    const expectedSubpages = [
      { href: "/heritage/community-organisations", name: /Community Organisations/i },
      { href: "/heritage/festivals", name: /Festivals & Cultural Calendar/i },
      { href: "/heritage/land-and-landscape", name: /Land & Landscape/i },
      { href: "/heritage/traditional-council", name: /Traditional Council & Governance/i },
      { href: "/heritage/pacesetters", name: /Pacesetters & Pioneers/i },
      { href: "/heritage/music-games", name: /Music, Games & Folk Traditions/i },
      { href: "/heritage/health-history", name: /Health History/i },
    ];

    for (const subpage of expectedSubpages) {
      const link = page.locator(`a[href="${subpage.href}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test("our-story page provides visible card and link to Takete-Tedo history", async ({ page }) => {
    await page.goto("/our-story");

    const taketeTedoLink = page.locator('a[href="/our-story/takete-tedo"]').first();
    await expect(taketeTedoLink).toBeVisible();
    await expect(page.getByRole("heading", { name: /Takete-Tedo \/ Okegada/i })).toBeVisible();

    // Clicking navigates to Takete-Tedo
    await taketeTedoLink.click();
    await expect(page).toHaveURL("/our-story/takete-tedo");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("video archives page is discoverable from site navigation", async ({ page }) => {
    await page.goto("/");

    // Footer contains direct link to Video Archives
    const footerVideoLink = page.locator('footer a[href="/archive/video"]');
    await expect(footerVideoLink).toBeVisible();

    // Navigate to Video Archives
    await footerVideoLink.click();
    await expect(page).toHaveURL("/archive/video");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("TIPU branch directory includes Lokoja branch with authentic group photo", async ({ page }) => {
    await page.goto("/tipu/branches");

    const lokojaHeading = page.getByRole("heading", { name: /TIPU Lokoja Branch/i });
    await expect(lokojaHeading).toBeVisible();

    const lokojaCard = page.locator('a[href="/tipu/branches/lokoja"]');
    await expect(lokojaCard).toBeVisible();
    await expect(lokojaCard.locator("img")).toHaveAttribute(
      "src",
      /lokoja-branch-group\.jpg/,
    );
  });

  test("Oríkì directory features functional audio filter and dignified unrecorded status", async ({ page }) => {
    await page.goto("/oriki");

    // Check fallback unrecorded label
    await expect(page.getByText("Recording to be added").first()).toBeVisible();
    await expect(page.getByText("Not yet recorded")).toHaveCount(0);

    // Audio available quick filter
    const audioFilter = page.getByRole("button", { name: /Audio Available/i });
    await expect(audioFilter).toBeVisible();
    await audioFilter.click();

    // Filtered view shows 3 records with playable audio
    await expect(page.getByText("3 Records")).toBeVisible();
    await expect(page.locator("table audio, .space-y-3 audio").first()).toBeVisible();

    // All records view restore
    const allFilter = page.getByRole("button", { name: /All Records/i });
    await allFilter.click();
    await expect(page.getByText("18 Records")).toBeVisible();
  });

  test("verified community badges render dignified archival labels rather than pending verification", async ({ page }) => {
    await page.goto("/heritage/faith");

    // Ensure no public badges say "Pending Verification"
    const pendingBadges = page.locator("text='Pending Verification'");
    await expect(pendingBadges).toHaveCount(0);

    // Ensure churches show "Community Record" or "Documentary Evidence"
    await expect(page.getByText("Community Record").first()).toBeVisible();
  });
});
