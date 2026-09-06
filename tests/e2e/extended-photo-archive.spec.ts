import { test, expect } from "@playwright/test";
import { validateGooglePhotosUrl } from "@/lib/site-config";

test.describe("Google Photos — Extended Community Photo Archive Integration", () => {
  test("unit safeguard: validateGooglePhotosUrl strictly blocks account-specific URLs like /u/3/", () => {
    // Account-specific URLs must be rejected
    expect(validateGooglePhotosUrl("https://photos.google.com/u/3/")).toBeNull();
    expect(validateGooglePhotosUrl("https://photos.google.com/u/0/album/123")).toBeNull();
    expect(validateGooglePhotosUrl("https://photos.google.com/u/123/")).toBeNull();
    expect(validateGooglePhotosUrl("")).toBeNull();
    expect(validateGooglePhotosUrl(null)).toBeNull();
    expect(validateGooglePhotosUrl("https://invalid-domain.com/photos")).toBeNull();

    // Valid public shared album links must pass
    expect(validateGooglePhotosUrl("https://photos.app.goo.gl/ABC123xyz")).toBe("https://photos.app.goo.gl/ABC123xyz");
    expect(validateGooglePhotosUrl("https://photos.google.com/share/AF1QipNxyz?key=123")).toBe("https://photos.google.com/share/AF1QipNxyz?key=123");
  });

  test("gallery page (/gallery) renders cleanly and safely with extended archive section", async ({ page }) => {
    const res = await page.goto("/gallery");
    expect(res?.status()).toBe(200);

    // Curated gallery header exists
    await expect(page.getByRole("heading", { name: "Gallery", level: 1 })).toBeVisible();

    // Ensure no account-specific URL is ever rendered in HTML/links
    const pageHtml = await page.content();
    expect(pageHtml).not.toContain("/u/3/");
    expect(pageHtml).not.toContain("/u/0/");

    // If extended archive button is visible, ensure security attributes
    const archiveButton = page.locator("a:has-text('View Full Photo Archive')");
    const count = await archiveButton.count();
    if (count > 0) {
      await expect(archiveButton).toHaveAttribute("target", "_blank");
      await expect(archiveButton).toHaveAttribute("rel", /noopener/);
      await expect(archiveButton).toHaveAttribute("rel", /noreferrer/);
      await expect(archiveButton).toHaveAttribute("aria-label", /Photo Archive/i);
    }
  });

  test("heritage page (/heritage) includes subtle browse extended archive link", async ({ page }) => {
    const res = await page.goto("/heritage");
    expect(res?.status()).toBe(200);

    const archiveLink = page.getByRole("link", { name: /Browse the Extended Photo Archive/i });
    await expect(archiveLink).toBeVisible();
    await expect(archiveLink).toHaveAttribute("href", "/gallery");
  });

  test("homepage (/) includes secondary link to /gallery rather than directly leaving the site", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);

    const secondaryGalleryLink = page.getByRole("link", { name: /See more community photographs/i });
    await expect(secondaryGalleryLink).toBeVisible();
    await expect(secondaryGalleryLink).toHaveAttribute("href", "/gallery");
  });

  test("faith heritage page (/heritage/faith) remains fully protected and intact", async ({ page }) => {
    const res = await page.goto("/heritage/faith");
    expect(res?.status()).toBe(200);

    // Verified sections intact
    await expect(page.getByRole("heading", { name: "Indigenous Religious Heritage of Takete-Ide" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Christianity Comes to Yagba" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Christianity Reaches Takete-Ide" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Churches of Takete-Ide" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Religious Heritage Timeline" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Places of Worship Gallery" })).toBeVisible();
  });
});
