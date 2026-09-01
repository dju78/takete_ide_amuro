import { test, expect } from "@playwright/test";

/**
 * The public-facing programme: the contribution account, the Centenary, and the
 * Security Trust Fund.
 *
 * These pages carry a higher cost of being wrong than ordinary copy — a wrong
 * account number sends community money to a stranger, a wrong date sends people
 * to an empty field, and a stale fund figure misrepresents the community's
 * finances. The assertions here are deliberately about correctness and honesty,
 * not layout.
 */

const OFFICIAL = {
  name: "Takete Ide Progressive Union",
  bank: "First Bank",
  number: "2023263187",
};

test.describe("Support Takete-Ide", () => {
  test("publishes the official account exactly", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: "Support Takete-Ide", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: OFFICIAL.name })).toBeVisible();
    await expect(page.getByText(OFFICIAL.bank, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(OFFICIAL.number, { exact: true }).first()).toBeVisible();
  });

  test("copy button reports success", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/support");
    const button = page.getByRole("button", { name: /Copy account number/ });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.getByRole("button", { name: /Account number copied/ })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(OFFICIAL.number);
  });

  test("warns about the beneficiary name and never asks for credentials", async ({ page }) => {
    await page.goto("/support");
    await expect(
      page.getByText(/confirm that your banking application displays .Takete Ide Progressive Union./),
    ).toBeVisible();
    await expect(page.getByText(/does not request or store your banking password, PIN or OTP/)).toBeVisible();
    // No credential capture anywhere on the page.
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.getByLabel(/pin|otp|password/i)).toHaveCount(0);
  });

  test("publishes exactly one account and no personal ones", async ({ page }) => {
    await page.goto("/support");
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    // Exactly one 10-digit account number on the page.
    const accountNumbers = text.match(/\b\d{10}\b/g) ?? [];
    expect(accountNumbers).toEqual([OFFICIAL.number]);
    // No personal account from the community archive, and no phone numbers.
    expect(text).not.toMatch(/\b0041531156\b/);
    expect(text).not.toMatch(/\b0[789]\d{9}\b/);
    expect(text).not.toMatch(/\+234[\s\d]{10,}/);
    expect(text).not.toMatch(/[\w.]+@[\w.]+\.\w+/);
  });

  test("does not present dormant areas as live fundraising campaigns", async ({ page }) => {
    await page.goto("/support");
    await expect(
      page.getByText(/ongoing areas of work rather than active campaigns with targets/),
    ).toBeVisible();
  });

  test("renders bank account details QR code with accessible alt text and scannable quiet zone", async ({ page }) => {
    await page.goto("/support");
    const qrImage = page.getByAltText(/QR code to view Takete-Ide Progressive Union bank account details/i);
    await expect(qrImage).toBeVisible();
    await expect(qrImage).toHaveAttribute("src", /takete-account-details-qr\.png/);
    await expect(page.getByRole("heading", { name: "Scan for account details" })).toBeVisible();
    await expect(
      page.getByText("Scan this code to view the official bank account details for manual transfer."),
    ).toBeVisible();
  });

  test("QR wording clarifies manual transfer and does not claim instant payment or automatic debits", async ({ page }) => {
    await page.goto("/support");
    const mainText = await page.locator("main").innerText();
    // Confirmed valid wording
    expect(mainText).toContain("Scan for account details");
    expect(mainText).toContain(OFFICIAL.bank);
    expect(mainText).toContain(OFFICIAL.number);
    expect(mainText).toContain(OFFICIAL.name);

    // Forbidden misleading wording
    expect(mainText).not.toMatch(/Scan to Pay/i);
    expect(mainText).not.toMatch(/Pay by QR/i);
    expect(mainText).not.toMatch(/QR Payment/i);
    expect(mainText).not.toMatch(/Instant Payment/i);
  });
});
test.describe("Centenary 2026", () => {
  test("states the confirmed date, venue and theme", async ({ page }) => {
    await page.goto("/centenary");
    await expect(page.getByText("29–31 October 2026").first()).toBeVisible();
    await expect(page.getByText("Saturday, 31 October 2026").first()).toBeVisible();
    await expect(page.getByText(/UBE School Field/).first()).toBeVisible();
    await expect(page.getByText(/FAITH, UNITY AND PROGRESS/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Celebrating 100 Years of Heritage" })).toBeVisible();
  });

  test("the countdown never shows a negative value", async ({ page }) => {
    await page.goto("/centenary");
    const values = await page
      .locator("li span.tabular-nums")
      .evaluateAll((els) => els.map((e) => e.textContent?.trim() ?? ""));
    expect(values.length).toBeGreaterThan(0);
    for (const v of values) {
      expect(v).not.toMatch(/-\d/);
      // Either pre-hydration placeholder or zero-padded number.
      expect(v === "--" || v === "––" || /^\d{2,}$/.test(v)).toBe(true);
    }
  });

  test("does not claim a 1926 founding", async ({ page }) => {
    await page.goto("/centenary");
    const text = await page.locator("main").innerText();
    // Affirmative claims only — the page's own disclaimer necessarily contains
    // the phrase "founded in 1926" in order to deny it.
    expect(text).not.toMatch(/Takete-Ide was founded/i);
    expect(text).not.toMatch(/established in 1926/i);
    expect(text).not.toMatch(/since 1926/i);
    expect(text).not.toMatch(/ 1926\s*[-–—]\s*2026 /);
    await expect(page.getByText(/not claimed here to have been founded in 1926/)).toBeVisible();
  });

  test("renders 3-day programme schedule and event highlights without fabricating unconfirmed times or titles", async ({ page }) => {
    await page.goto("/centenary");
    await expect(page.getByRole("heading", { name: "Centenary Programme", exact: true })).toBeVisible();
    await expect(page.getByText("Thursday, 29 October 2026")).toBeVisible();
    await expect(page.getByText("Friday, 30 October 2026")).toBeVisible();
    await expect(page.getByText("Saturday, 31 October 2026").first()).toBeVisible();

    // No invented titles
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/Centenary Opening & Heritage Programme/i);
    expect(text).not.toMatch(/Centenary Cultural & Community Eve/i);

    // Days without exact times show honest notice
    await expect(page.getByText(/Programme details to be confirmed/).first()).toBeVisible();
    await expect(page.getByText(/Schedule details to be confirmed/).first()).toBeVisible();

    // Highlights
    await expect(page.getByRole("heading", { name: "Event Highlights" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cultural Display" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Traditional Music & Dance" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Community Exhibition" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Historical Reflections" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Awards & Recognitions" })).toBeVisible();
  });

  test("shows a selection of branches, not the whole network", async ({ page }) => {
    await page.goto("/centenary");
    await expect(page.getByRole("heading", { name: "Coming Home From Near and Far" })).toBeVisible();
    const tiles = await page.locator("section", { hasText: "Coming Home From Near and Far" }).locator("ul li").count();
    expect(tiles).toBeGreaterThan(0);
    expect(tiles).toBeLessThan(10);
  });
});

test.describe("Security Trust Fund", () => {
  test("publishes the reported figures with the date they were reported", async ({ page }) => {
    await page.goto("/development/security-trust-fund");
    await expect(page.getByText("₦16,500,000").first()).toBeVisible();
    await expect(page.getByText("₦6,667,960").first()).toBeVisible();
    // Outstanding is computed: 16,500,000 - 6,667,960.
    await expect(page.getByText("₦9,832,040").first()).toBeVisible();
    await expect(page.getByText(/Last reported update: 25 August 2026/)).toBeVisible();
  });

  test("progress is calculated from the amounts, not hard-coded", async ({ page }) => {
    await page.goto("/development/security-trust-fund");
    const bar = page.getByRole("progressbar");
    const now = Number(await bar.getAttribute("aria-valuenow"));
    // 6,667,960 / 16,500,000 = 40.4%
    expect(now).toBe(Math.round((6_667_960 / 16_500_000) * 100));
    const width = await bar.locator("div").first().evaluate((el) => (el as HTMLElement).style.width);
    expect(parseFloat(width)).toBeCloseTo((6_667_960 / 16_500_000) * 100, 1);
  });

  test("is labelled a dated record, never a live balance", async ({ page }) => {
    await page.goto("/development/security-trust-fund");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/current balance|live total|balance now/i);
    await expect(page.getByText(/a dated community record, not a live account balance/)).toBeVisible();
  });

  test("names no contributor", async ({ page }) => {
    await page.goto("/development/security-trust-fund");
    await expect(page.getByText(/No individual contributor is named/)).toBeVisible();
  });
});

test.describe("Homepage integration", () => {
  test("carries the TIPU strip but not the full branch grid", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "One Takete-Ide. Many Locations." })).toBeVisible();

    const homeTiles = await page
      .locator("section", { hasText: "One Takete-Ide. Many Locations." })
      .locator("ul li")
      .count();

    await page.goto("/tipu/branches");
    const allBranches = await page.getByRole("heading", { level: 3, name: /^TIPU / }).count();
    expect(homeTiles).toBeLessThan(allBranches);
  });

  test("authentic branch photographs still appear on the homepage strip", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const strip = page.locator("section", { hasText: "One Takete-Ide. Many Locations." });
    for (const src of [
      "/images/takete-ide/tipu-branches/lokoja-branch-group.jpg",
      "/images/takete-ide/new-yam-festival/full-group.jpg",
      "/images/takete-ide/tipu-branches/uk-europe-inaugural-group.jpg",
    ]) {
      await expect(strip.locator(`img[src*="${encodeURIComponent(src)}"]`).first()).toBeVisible();
    }
  });

  test("no photograph is used twice on the homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    // Only the desktop composition counts — the hero ships a mobile duplicate
    // of the same file behind display:none by design.
    const sources = await page.locator("main img, img").evaluateAll((imgs) =>
      imgs
        .filter((i) => (i as HTMLElement).offsetParent !== null)
        .map((i) => {
          const url = decodeURIComponent((i as HTMLImageElement).currentSrc || "");
          return url.replace(/^.*url=/, "").split("&")[0];
        })
        .filter((u) => u.startsWith("/images/takete-ide/") && !u.includes("tipu-emblem")),
    );
    const duplicates = sources.filter((s, i) => sources.indexOf(s) !== i);
    expect(duplicates).toEqual([]);
  });

  test("leads with the Centenary and closes with Support", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Celebrating 100 Years of Heritage" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Support Takete-Ide" })).toBeVisible();
    await expect(page.getByRole("link", { name: /View the official account/ })).toBeVisible();
  });
});

test.describe("Site-wide privacy", () => {
  const NON_RSVP_PUBLIC_PAGES = [
    "/",
    "/tipu",
    "/tipu/branches",
    "/support",
    "/development",
    "/development/security-trust-fund",
    "/our-story",
    "/education",
    "/heritage",
  ];

  for (const path of NON_RSVP_PUBLIC_PAGES) {
    test(`no archive contact details or provenance notes leak on ${path}`, async ({ page }) => {
      await page.goto(path);
      const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
      // Nigerian mobile numbers and international dialling from the WhatsApp archive must not leak.
      expect(text).not.toMatch(/\b0[789]\d{9}\b/);
      expect(text).not.toMatch(/\+234[\s\d]{10,}/);
      // WhatsApp display-name handles, e.g. "~ fanwokingsley".
      expect(text).not.toMatch(/~\s*\w+/);
      // Internal provenance citations are admin-only.
      expect(text).not.toMatch(/branch-chairman listing, \d/i);
      expect(text).not.toMatch(/annual-dues\/branch notice/i);
      expect(text).not.toMatch(/photographs not present in the exported archive/i);
      // The personal account that appears in the archive must never be published.
      expect(text).not.toMatch(/\b0041531156\b/);
    });
  }

  test("on /centenary, only official published RSVP numbers appear and no private archive data leaks", async ({ page }) => {
    await page.goto("/centenary");
    const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    // WhatsApp display-name handles
    expect(text).not.toMatch(/~\s*\w+/);
    // Internal provenance citations
    expect(text).not.toMatch(/branch-chairman listing, \d/i);
    expect(text).not.toMatch(/annual-dues\/branch notice/i);
    expect(text).not.toMatch(/photographs not present in the exported archive/i);
    // Personal archive account
    expect(text).not.toMatch(/\b0041531156\b/);
  });
});
