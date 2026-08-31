import { test, expect } from "@playwright/test";

/**
 * The branch network's defining requirement: a documented branch must appear on
 * the site whether or not anyone has photographed it yet. These tests exist to
 * stop a future change from quietly filtering photo-less branches out again.
 *
 * They assert on named, source-backed branches rather than a total count — the
 * network grows as the community archive is read, and a magic number would fail
 * for the wrong reason every time a branch is added.
 */

/** Branches attested repeatedly in TIPU dues notices, chairman listings and levy tables. */
const SOURCE_BACKED = [
  "TIPU Home Branch",
  "TIPU Abuja Branch",
  "TIPU Lokoja Branch",
  "TIPU Kaduna Branch",
  "TIPU Ilorin Branch",
  "TIPU Lagos Branch",
  "TIPU Ogun Branch",
  "TIPU Ekiti Branch",
  "TIPU Ore Branch",
  "TIPU Agbajogun Branch",
  "TIPU Port Harcourt Branch",
  "TIPU Minna Branch",
  "TIPU Osun Branch",
  "TIPU UK & Europe Chapter",
  "TIPU North America",
];

/** Recorded in the archive but with an open question — still published, still visible. */
const PENDING = ["TIPU Oyo Branch", "TIPU Ayeteju Branch", "TIPU Ondo", "TIPU Kano Branch"];

/** The three branches the community archive currently has photographs for. */
const AUTHENTIC_PHOTOS = [
  "/images/takete-ide/tipu-branches/lokoja-branch-group.jpg",
  "/images/takete-ide/new-yam-festival/full-group.jpg",
  "/images/takete-ide/tipu-branches/uk-europe-inaugural-group.jpg",
];

test.describe("TIPU Network page", () => {
  test("lists every source-backed branch, photographed or not", async ({ page }) => {
    await page.goto("/tipu/branches");
    for (const name of SOURCE_BACKED) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
  });

  test("branches awaiting confirmation are published, not hidden", async ({ page }) => {
    await page.goto("/tipu/branches");
    for (const name of PENDING) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
  });

  test("groups the network into Home, Nigeria, Global and Growing", async ({ page }) => {
    await page.goto("/tipu/branches");
    for (const heading of ["Home & Community", "Across Nigeria", "Global Community", "Growing Network"]) {
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    }
  });

  test("branches without photographs show the branded placeholder, not a gap", async ({ page }) => {
    await page.goto("/tipu/branches");
    const pending = page.getByText(/Community archive image coming soon|Branch information being documented/);
    // More branches than photographs, so at least one placeholder must render.
    expect(await pending.count()).toBeGreaterThan(0);
    // Never the language of a broken image.
    await expect(page.getByText(/no image|image missing|not available/i)).toHaveCount(0);
  });

  test("no branch card uses stock or AI imagery — only archive photographs", async ({ page }) => {
    await page.goto("/tipu/branches");
    const sources = await page.locator("main img").evaluateAll((imgs) =>
      imgs.map((i) => decodeURIComponent((i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src)),
    );
    for (const src of sources) {
      // Every image is either an imported archive photograph or the emblem the
      // placeholder is built from — nothing loaded from a third party.
      expect(src).toMatch(/\/images\/takete-ide\/|^data:/);
      expect(src).not.toMatch(/unsplash|pexels|shutterstock|getty|placeholder\.com|picsum/i);
    }
  });

  test("authentic branch photographs remain intact", async ({ page }) => {
    await page.goto("/tipu/branches");
    for (const src of AUTHENTIC_PHOTOS) {
      await expect(page.locator(`img[src*="${encodeURIComponent(src)}"]`).first()).toBeVisible();
    }
  });

  test("Kabba is presented as forming, never as an established branch", async ({ page }) => {
    await page.goto("/tipu/branches");
    const growing = page.locator("section", { hasText: "Growing Network" });
    await expect(growing.getByRole("heading", { name: "TIPU Kabba Branch", exact: true })).toBeVisible();
    // Carries the forming marker, and no activity that would imply it is running.
    await expect(growing.getByText("Forming").first()).toBeVisible();
    await expect(page.getByText(/Kabba.*(established|founded|since)/i)).toHaveCount(0);
  });

  test("only branches with real content link to a dedicated page", async ({ page }) => {
    await page.goto("/tipu/branches");
    for (const href of ["/tipu/branches/lokoja", "/tipu/branches/ilorin", "/diaspora/uk-europe"]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
    // No empty route was invented for a branch that has nothing to show yet.
    for (const href of ["/tipu/branches/kaduna", "/tipu/branches/kabba", "/tipu/branches/oyo"]) {
      await expect(page.locator(`a[href="${href}"]`)).toHaveCount(0);
    }
  });

  test("no branch claims an unverified establishment date", async ({ page }) => {
    await page.goto("/tipu/branches");
    await expect(page.getByText("Established", { exact: true })).toHaveCount(0);
  });

  test("pending records read neutrally, never as a warning", async ({ page }) => {
    await page.goto("/tipu/branches");
    await expect(page.getByText("Community record being updated").first()).toBeVisible();
    await expect(page.getByText(/unverified|unconfirmed branch|not verified/i)).toHaveCount(0);
  });

  test("no private contact details from the archive reach the public page", async ({ page }) => {
    await page.goto("/tipu/branches");
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    // Nigerian mobile numbers, international numbers, WhatsApp handles, emails.
    expect(text).not.toMatch(/\b0[789]\d{9}\b/);
    expect(text).not.toMatch(/\+234[\s\d]{10,}/);
    expect(text).not.toMatch(/~\s*\w+/);
    expect(text).not.toMatch(/[\w.]+@[\w.]+\.\w+/);
    // Internal provenance notes are for administrators only.
    expect(text).not.toMatch(/branch-chairman listing|annual-dues|levy status/i);
  });
});

test.describe("Homepage branch strip", () => {
  test("shows a selection and links to the full network", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "One Takete-Ide. Many Locations." })).toBeVisible();

    const strip = page.locator("section", { hasText: "One Takete-Ide. Many Locations." }).locator("ul li");
    const stripCount = await strip.count();
    expect(stripCount).toBeGreaterThan(4);

    await page.getByRole("link", { name: /Explore the TIPU Network/ }).click();
    await expect(page).toHaveURL(/\/tipu\/branches$/);

    // A selection, not the whole network.
    const total = await page.getByRole("heading", { level: 3, name: /^TIPU / }).count();
    expect(stripCount).toBeLessThan(total);
  });
});

test.describe("TIPU overview", () => {
  test("network statistics are derived, not hard-coded, and avoid overclaiming", async ({ page }) => {
    await page.goto("/tipu");
    await expect(page.getByRole("heading", { name: "A Union That Spans Continents" })).toBeVisible();

    // The headline figure must equal the number of branches the network page renders.
    const statText = await page
      .locator("dd", { hasText: "Documented branch and community records" })
      .innerText();
    const shown = Number(statText.match(/\d+/)?.[0]);
    expect(shown).toBeGreaterThan(15);

    await page.goto("/tipu/branches");
    const rendered = await page.getByRole("heading", { level: 3, name: /^TIPU / }).count();
    expect(shown).toBe(rendered);
  });

  test("the TIPU overview shows a curated few branches, not the whole network", async ({ page }) => {
    await page.goto("/tipu");
    const branchCards = await page.getByRole("heading", { level: 3, name: /^TIPU / }).count();
    expect(branchCards).toBeGreaterThan(0);
    expect(branchCards).toBeLessThan(6);
    await expect(page.getByRole("link", { name: /Explore the Full TIPU Network/ })).toBeVisible();
  });

  test("branches are never described as all active", async ({ page }) => {
    await page.goto("/tipu");
    await expect(page.getByText(/\d+ active branches/i)).toHaveCount(0);
  });
});
