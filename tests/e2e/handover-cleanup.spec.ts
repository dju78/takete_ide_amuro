import { test, expect, type Page } from "@playwright/test";
import { getPublishedEvents } from "@/lib/data/events";

// These checks run against the local build, which has no database configured, so the
// "empty" states below are the ones a visitor sees before any records are published.

async function mainText(page: Page) {
  return page.locator("main").innerText();
}

test.describe("Handover cleanup: no empty shells or unbuilt promises", () => {
  test("weather keeps the forecast link and drops the planning and farming sections", async ({ page }) => {
    await page.goto("/weather");
    const text = await mainText(page);
    expect(text).not.toContain("Planning Your Day");
    expect(text).not.toContain("Farming Weather");
    expect(text).not.toContain("will grow into");
    await expect(page.getByRole("link", { name: /AccuWeather/ }).first()).toHaveAttribute("href", /accuweather\.com/);
  });

  test("past Takete-Ide Day pages carry no forecast notice", async ({ page }) => {
    await page.goto("/takete-ide-day/2025");
    const text = await mainText(page);
    expect(text).not.toContain("Weather for Takete-Ide Day");
    expect(text).not.toContain("A weather forecast will appear closer to the event date.");
  });

  test("homepage hides the empty news section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Latest News" })).toHaveCount(0);
    expect(await mainText(page)).not.toContain("will appear here once published");
  });

  test("TIPU page hides empty roster, bulletin, project, notice and publication sections but keeps contact", async ({ page }) => {
    await page.goto("/tipu");
    for (const heading of [
      "Union Leadership",
      "Latest TIPU News & Bulletins",
      "TIPU Projects & Initiatives",
      "Union Notices & Announcements",
      "Constitutions, Documents & Reports",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toHaveCount(0);
    }
    const text = await mainText(page);
    expect(text).not.toMatch(/will appear here|will be accessible here|being compiled/);
    await expect(page.getByRole("heading", { name: "Contact the TIPU secretariat" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact Secretariat" })).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("heading", { name: "Featured Branches" })).toBeVisible();
  });

  test("development hides the empty register and filters but keeps history and contact routes", async ({ page }) => {
    await page.goto("/development");
    await expect(page.getByRole("heading", { name: "Community Development Projects" })).toHaveCount(0);
    await expect(page.getByText("Category:")).toHaveCount(0);
    expect(await mainText(page)).not.toContain("being compiled");
    await expect(page.getByRole("heading", { name: "Historical Development Milestones" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Submit a Project Update" })).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("link", { name: "Support Development" })).toHaveAttribute("href", "/support");
  });

  test("Our People links to pacesetters and traditional leadership without dead filters", async ({ page }) => {
    await page.goto("/our-people");
    await expect(page.getByRole("group", { name: "Filter profiles by category" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Pacesetters & Pioneers/ })).toHaveAttribute("href", "/heritage/pacesetters");
    await expect(page.getByRole("link", { name: /Traditional Leadership/ })).toHaveAttribute("href", "/heritage/traditional-institution");
    await expect(page.getByRole("link", { name: "Nominate a Community Member" })).toBeVisible();
    expect(await mainText(page)).not.toContain("being verified");
  });

  test("oral history is an invitation, and other pages do not claim recordings exist", async ({ page }) => {
    await page.goto("/archive/oral-history");
    await expect(page.getByRole("heading", { name: "Help Us Record Takete-Ide’s Voices" })).toBeVisible();
    await expect(page.getByText("No recordings have been published yet.", { exact: false })).toBeVisible();
    await expect(page.getByRole("link", { name: "Recommend an elder" }).first()).toBeVisible();

    for (const path of ["/archive", "/heritage", "/education", "/get-involved"]) {
      await page.goto(path);
      const text = await mainText(page);
      expect(text, path).not.toMatch(/Explore recorded oral histories|Listen to community oral testimonies|Oral history recordings from community elders|Community oral history recordings from/);
    }
  });

  test("UK & Europe page drops the missing-information note and offers the contact route", async ({ page }) => {
    await page.goto("/diaspora/uk-europe");
    expect(await mainText(page)).not.toContain("have not yet been supplied");
    await expect(page.getByRole("link", { name: "Contact the community" })).toHaveAttribute("href", "/contact");
  });

  test("archive summary matches the 13-ruler register", async ({ page }) => {
    await page.goto("/archive/takete-history-original");
    const text = await mainText(page);
    expect(text).not.toContain("12-ruler");
    expect(text).toContain("13 Olu’des in living memory");
  });

  test("community history overview replaces the chapter guide without editorial commentary", async ({ page }) => {
    const res = await page.goto("/archive/from-hilltops-to-the-valley");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Explore Takete-Ide’s history" })).toBeVisible();
    const text = await mainText(page);
    expect(text).not.toMatch(/not used for this website update|Editorial use of the manuscript|thirteen chapters|chapter-by-chapter/i);
    for (const href of ["/our-story", "/heritage/traditional-institution", "/education", "/heritage/pacesetters", "/development"]) {
      await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
    }
  });

  test("education explains the conflicting GDSS dates instead of choosing one", async ({ page }) => {
    await page.goto("/education");
    await expect(page.getByText("Dates differ between sources.")).toBeVisible();
    const text = await mainText(page);
    expect(text).not.toContain("Officially taken over by the defunct Oyi Local Government in 1980, becoming Government Day");
    expect(text).toContain("Government Day Secondary School");
    expect(text).toMatch(/1983/);
  });

  test("centenary updates are hidden until announcements exist; the archive view has no unsupported records", async ({ page }) => {
    await page.goto("/centenary");
    await expect(page.getByRole("heading", { name: "Latest Updates" })).toHaveCount(0);
    expect(await mainText(page)).not.toContain("Centenary updates will appear here");

    await page.goto("/centenary?view=archive");
    const text = await mainText(page);
    expect(text).not.toMatch(/being prepared|once compiled and approved|TIPU National Executive Council/);
  });

  test("accessibility statement is accurate and keeps the captions disclosure", async ({ page }) => {
    await page.goto("/accessibility");
    const text = await mainText(page);
    expect(text).not.toContain("As a actively");
    expect(text).not.toContain("Oral History archives");
    expect(text).toContain("does not yet have captions or transcripts");
  });
});

test.describe("Fundraising figures withheld pending approval", () => {
  test("no event exposes fundraising records without an approved year", async () => {
    const events = await getPublishedEvents();
    expect(events.map((e) => e.year)).toEqual(expect.arrayContaining([2024, 2025]));
    for (const event of events) expect(event.fundraising, String(event.year)).toEqual([]);
  });

  for (const year of [2025, 2024]) {
    test(`Takete-Ide Day ${year} keeps its history but shows no amounts, targets or progress`, async ({ page }) => {
      const res = await page.goto(`/takete-ide-day/${year}`);
      expect(res?.status()).toBe(200);
      const text = await mainText(page);
      expect(text).not.toMatch(/Development Fundraising|raised of|target|NGN|₦|18,500,000|50,000,000|12,000,000|30,000,000/);
      await expect(page.locator('[role="progressbar"], progress')).toHaveCount(0);
      if (year === 2025) {
        await expect(page.getByText("Cultural Ambassador of Takete-Ide").first()).toBeVisible();
        await expect(page.getByText("Address by the Deputy Governor of Kogi State")).toBeVisible();
      }
    });
  }

  test("the verified contribution account is still published", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByText("2023263187").first()).toBeVisible();
    await expect(page.getByText(/Takete.Ide Progressive Union/).first()).toBeVisible();
  });
});

test.describe("Live page before broadcast setup", () => {
  test("does not imply the broadcast has been configured", async ({ page }) => {
    await page.goto("/live");
    await expect(page.getByTestId("broadcast-status")).toHaveText("Not yet live");
    await expect(page.getByText("Status updated manually by the broadcast team")).toHaveCount(0);
    await expect(page.getByTestId("player-fallback")).toContainText("The broadcast link has not been published yet.");
    await expect(page.locator('iframe[src*="youtube"]')).toHaveCount(0);
  });
});
