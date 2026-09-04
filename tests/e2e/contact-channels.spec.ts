import { test, expect } from "@playwright/test";

const OFFICIAL_EMAIL = "taketeideamuro@gmail.com";
const OFFICIAL_YOUTUBE = "https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw";

test.describe("Official Contact Channels — Email & YouTube", () => {
  test.describe("Contact Page (/contact)", () => {
    test("displays official email as clickable mailto link and eliminates fallback text", async ({ page }) => {
      await page.goto("/contact");

      // Verify email heading/content
      const emailLink = page.getByRole("link", { name: new RegExp(OFFICIAL_EMAIL, "i") });
      await expect(emailLink).toBeVisible();
      await expect(emailLink).toHaveAttribute("href", `mailto:${OFFICIAL_EMAIL}`);
      await expect(emailLink).toHaveText(OFFICIAL_EMAIL);

      // Verify fallback text is not shown
      await expect(page.getByText("Email address to be published by the admin team")).toBeHidden();
    });

    test("displays official YouTube channel with external link safeguards", async ({ page }) => {
      await page.goto("/contact");

      const youtubeLink = page.getByRole("link", { name: /Takete-Ide Amuro YouTube Channel/i });
      await expect(youtubeLink).toBeVisible();
      await expect(youtubeLink).toHaveAttribute("href", OFFICIAL_YOUTUBE);
      await expect(youtubeLink).toHaveAttribute("target", "_blank");
      await expect(youtubeLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  test.describe("Footer Contact & Social Links", () => {
    test("footer email icon links directly to official mailto address", async ({ page }) => {
      await page.goto("/");

      const footer = page.locator("footer");
      const footerEmail = footer.getByRole("link", { name: /Email/i });
      await expect(footerEmail).toBeVisible();
      await expect(footerEmail).toHaveAttribute("href", `mailto:${OFFICIAL_EMAIL}`);
    });

    test("footer includes YouTube icon linking to exact official channel", async ({ page }) => {
      await page.goto("/");

      const footer = page.locator("footer");
      const footerYoutube = footer.getByRole("link", { name: "Takete-Ide Amuro on YouTube" });
      await expect(footerYoutube).toBeVisible();
      await expect(footerYoutube).toHaveAttribute("href", OFFICIAL_YOUTUBE);
      await expect(footerYoutube).toHaveAttribute("target", "_blank");
      await expect(footerYoutube).toHaveAttribute("rel", "noopener noreferrer");
    });

    test("main navigation does not contain a YouTube item", async ({ page }) => {
      await page.goto("/");

      const headerNav = page.locator("header nav");
      await expect(headerNav.getByRole("link", { name: /YouTube/i })).toBeHidden();
    });
  });

  test.describe("Structured Data (JSON-LD)", () => {
    test("root layout contains organization email and YouTube sameAs", async ({ page }) => {
      await page.goto("/");

      const ldJsonScript = page.locator('script[type="application/ld+json"]').first();
      const content = await ldJsonScript.textContent();
      expect(content).toBeTruthy();
      const json = JSON.parse(content || "{}");

      expect(json["@type"]).toBe("Organization");
      expect(json.email).toBe(OFFICIAL_EMAIL);
      expect(json.sameAs).toContain(OFFICIAL_YOUTUBE);
    });
  });
});