import { test, expect } from "@playwright/test";

test.describe("Celebration Archive & Takete-Ide Day Media Integration", () => {
  test("Celebration Archive on /takete-ide-day renders Takete-Ide Day 2025 celebration card", async ({ page }) => {
    await page.goto("/takete-ide-day");

    const archiveHeading = page.getByRole("heading", { name: "Celebration Archive" });
    await expect(archiveHeading).toBeVisible();

    // 2025 Celebration Card
    const card2025 = page.locator("a[href='/takete-ide-day/2025']");
    await expect(card2025).toBeVisible();
    await expect(card2025).toContainText("2025");
    await expect(card2025).toContainText("Celebrating Heritage, Community Unity & Socio-Cultural Development");

    // Click through to 2025 celebration page
    await card2025.click();
    await expect(page).toHaveURL(/\/takete-ide-day\/2025$/);
  });

  test("/takete-ide-day/2025 renders video player for Deputy Governor arrival and photo gallery", async ({ page }) => {
    await page.goto("/takete-ide-day/2025");

    // Header & details
    await expect(page.getByRole("heading", { name: "Takete-Ide Day 2025" })).toBeVisible();
    await expect(page.getByText("Celebrating Heritage, Community Unity & Socio-Cultural Development")).toBeVisible();

    // Video Section
    const videoSection = page.locator("section", { hasText: "Celebration Video Highlights" });
    await expect(videoSection).toBeVisible();
    const videoPlayer = videoSection.locator("video");
    await expect(videoPlayer).toBeVisible();
    await expect(videoPlayer.locator("source")).toHaveAttribute("src", "/videos/takete-ide/arrival-of-deputy-governor.mp4");

    // Awards Section
    const awardsSection = page.locator("section", { hasText: "Honours & Award Conferments" });
    await expect(awardsSection).toBeVisible();
    await expect(awardsSection).toContainText("Amb. Chief Samuel O. Ipinlaiye");
    await expect(awardsSection).toContainText("Cultural Ambassador of Takete-Ide");

    // Addresses & Remarks
    const speechesSection = page.locator("section", { hasText: "Addresses & Remarks" });
    await expect(speechesSection).toBeVisible();
    await expect(speechesSection).toContainText("His Excellency Comrade Joel Salifu Oyibo");
    await expect(speechesSection).toContainText("HRH Oba Philip Ebilakun (JP)");
  });

  test("Digital Archive on /archive includes Takete-Ide Day 2025 records", async ({ page }) => {
    await page.goto("/archive");

    await expect(page.getByRole("heading", { name: "Digital Archive" })).toBeVisible();
    await expect(page.getByText("Takete-Ide Day 2025 Celebration & Cultural Ambassador Conferment")).toBeVisible();
  });

  test("Archive detail pages render valid CreativeWork JSON-LD structured data", async ({ page }) => {
    // 1. takete-history-original
    await page.goto("/archive/takete-history-original");
    const jsonLdScripts1 = await page.locator('script[type="application/ld+json"]').all();
    const jsonContents1 = await Promise.all(jsonLdScripts1.map((s) => s.textContent()));
    const parsed1 = jsonContents1.map((c) => (c ? JSON.parse(c) : null)).filter(Boolean);

    const creativeWork1 = parsed1.find((item) => item["@type"] === "CreativeWork");
    expect(creativeWork1).toBeDefined();
    expect(creativeWork1["@context"]).toBe("https://schema.org");
    expect(creativeWork1.name).toBe("Takete-Ide Historical Community Account");
    expect(creativeWork1.url).toBe("https://takete-ide.org/archive/takete-history-original");
    expect(creativeWork1.publisher?.name).toBe("Takete-Ide Amuro");
    expect(creativeWork1.image).toBeUndefined(); // no thumbnail

    // Verify BreadcrumbList & Organization schemas exist without duplicates
    const breadcrumb1 = parsed1.filter((item) => item["@type"] === "BreadcrumbList");
    expect(breadcrumb1.length).toBe(1);
    const organization1 = parsed1.filter((item) => item["@type"] === "Organization");
    expect(organization1.length).toBe(1);

    // 2. takete-ide-day-2025-records
    await page.goto("/archive/takete-ide-day-2025-records");
    const jsonLdScripts2 = await page.locator('script[type="application/ld+json"]').all();
    const jsonContents2 = await Promise.all(jsonLdScripts2.map((s) => s.textContent()));
    const parsed2 = jsonContents2.map((c) => (c ? JSON.parse(c) : null)).filter(Boolean);

    const creativeWork2 = parsed2.find((item) => item["@type"] === "CreativeWork");
    expect(creativeWork2).toBeDefined();
    expect(creativeWork2.name).toBe("Takete-Ide Day 2025 Celebration & Cultural Ambassador Conferment");
    expect(creativeWork2.url).toBe("https://takete-ide.org/archive/takete-ide-day-2025-records");
    expect(creativeWork2.image).toContain("https://takete-ide.org/images/takete-ide/celebrations/cultural-ambassador-award-conferment-2025.jpg");
  });
});
