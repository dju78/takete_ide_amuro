import { test, expect } from "@playwright/test";

test.describe("Faith & Religious Heritage Navigation & RSVP Hardening", () => {
  test("Desktop navigation includes Faith & Religious Heritage under About menu", async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto("/");

    // Locate About mega menu button in desktop primary nav and hover to keep open
    const aboutGroup = page.locator("nav[aria-label='Primary'] div.relative").filter({ has: page.getByRole("button", { name: /^About/i }) });
    await expect(aboutGroup).toBeVisible();
    await aboutGroup.hover();

    // Check Faith & Religious Heritage is visible in the dropdown
    const faithLink = aboutGroup.getByRole("link", { name: /Faith & Religious Heritage/i }).first();
    await expect(faithLink).toBeVisible();
    await expect(faithLink).toHaveAttribute("href", "/heritage/faith");

    // Also check About includes required links
    await expect(aboutGroup.getByRole("link", { name: /Our Story/i }).first()).toBeVisible();
    await expect(aboutGroup.getByRole("link", { name: /Our People/i }).first()).toBeVisible();
    await expect(aboutGroup.getByRole("link", { name: /Traditional Institution/i }).first()).toBeVisible();
    await expect(aboutGroup.getByRole("link", { name: /Families & Compounds/i }).first()).toBeVisible();
    await expect(aboutGroup.getByRole("link", { name: /Oríkì/i }).first()).toBeVisible();
  });

  test("Desktop navigation includes Faith & Religious Heritage under Explore/Heritage menu", async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto("/");

    const exploreGroup = page.locator("nav[aria-label='Primary'] div.relative").filter({ has: page.getByRole("button", { name: /^Explore/i }) });
    await expect(exploreGroup).toBeVisible();
    await exploreGroup.hover();

    const faithLink = exploreGroup.getByRole("link", { name: /Faith & Religious Heritage/i }).first();
    await expect(faithLink).toBeVisible();
    await expect(faithLink).toHaveAttribute("href", "/heritage/faith");
  });

  test("Mobile navigation includes Faith & Religious Heritage under About accordion", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Open mobile menu
    const menuBtn = page.getByRole("button", { name: "Open menu" });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Open About accordion in mobile nav
    const mobileNav = page.locator("nav[aria-label='Mobile']");
    await expect(mobileNav).toBeVisible();

    const aboutAccordionBtn = mobileNav.getByRole("button", { name: "About" });
    await expect(aboutAccordionBtn).toBeVisible();
    // In mobile nav, the first group (About) is open by default, or click if closed
    const faithMobileLink = mobileNav.getByRole("link", { name: "Faith & Religious Heritage" });
    if (!(await faithMobileLink.isVisible())) {
      await aboutAccordionBtn.click();
    }
    await expect(faithMobileLink).toBeVisible();
    await expect(faithMobileLink).toHaveAttribute("href", "/heritage/faith");
  });

  test("Footer includes Faith & Religious Heritage linking to /heritage/faith", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    const faithFooterLink = footer.getByRole("link", { name: "Faith & Religious Heritage" });
    await expect(faithFooterLink).toBeVisible();
    await expect(faithFooterLink).toHaveAttribute("href", "/heritage/faith");
  });

  test("/heritage/faith returns HTTP 200 and is indexable with canonical URL", async ({ page }) => {
    const res = await page.goto("/heritage/faith");
    expect(res?.status()).toBe(200);

    const canonical = page.locator("link[rel='canonical']");
    await expect(canonical).toHaveAttribute("href", "https://takete-ide.org/heritage/faith");

    const robotsMeta = page.locator("meta[name='robots']");
    if (await robotsMeta.count() > 0) {
      const robotsContent = await robotsMeta.getAttribute("content");
      expect(robotsContent).not.toContain("noindex");
    }
  });

  test("RSVP form consent is not pre-selected and submission displays 'RSVP Received'", async ({ page }) => {
    await page.goto("/centenary");
    const rsvpSection = page.locator("#rsvp");
    await expect(rsvpSection).toBeVisible();

    // Consent checkbox must not be checked by default
    const consentCheckbox = rsvpSection.locator("input[name='consent']");
    await expect(consentCheckbox).toBeVisible();
    expect(await consentCheckbox.isChecked()).toBe(false);

    // Anti-spam honeypot field must exist
    const botField = rsvpSection.locator("input[name='bot_field']");
    await expect(botField).toHaveCount(1);

    // Fill form fields
    await rsvpSection.locator("input[name='fullName']").fill("Elder Test Guest");
    await rsvpSection.locator("input[name='email']").fill("guest@example.com");
    await rsvpSection.locator("input[name='phone']").fill("+2348012345678");
    await rsvpSection.locator("input[name='partySize']").fill("2");
    await consentCheckbox.check();

    // Submit form
    await rsvpSection.locator("button[type='submit']").click();

    // Verify success view says 'RSVP Received' (not 'RSVP Confirmed')
    await expect(rsvpSection.getByRole("heading", { name: "RSVP Received" })).toBeVisible({ timeout: 10000 });
    await expect(rsvpSection.getByText("Thank you. Your attendance details have been received by the Takete-Ide Centenary organising committee.")).toBeVisible();
    await expect(rsvpSection.getByText("The organising committee will contact you if any additional information or confirmation is required.")).toBeVisible();
    await expect(rsvpSection.getByRole("heading", { name: "RSVP Confirmed" })).toHaveCount(0);
  });
});
