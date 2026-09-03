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
});
