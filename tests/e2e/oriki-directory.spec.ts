import { test, expect } from "@playwright/test";
import { getOrikiRecords, APPROVED_ORIKI_RECORDS } from "@/lib/data/oriki-records";

test.describe("Takete-Ide Family Oríkì Directory", () => {
  test("renders authoritative heading and full cultural introduction", async ({ page }) => {
    await page.goto("/oriki");

    // Main Page Heading
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Takete-Ide Family Oríkì");

    // Section Heading
    await expect(page.getByRole("heading", { level: 2, name: "Oríkì in Takete-Ide" })).toBeVisible();

    // Required Introduction Text
    await expect(page.getByText("Oríkì in Takete-Ide, Amuro, are traditional praise names and expressions")).toBeVisible();
    await expect(page.getByText("Within the community, families and ancestral groups have distinctive Oríkì")).toBeVisible();
    await expect(page.getByText("Oríkì may be spoken during greetings, family gatherings")).toBeVisible();
    await expect(page.getByText("Preserving these traditional names is essential")).toBeVisible();
    await expect(page.getByText("This collection is a developing community record.")).toBeVisible();
  });

  test("contains all 18 approved records exactly once with no duplicate Eseyin Meleun", async ({ page }) => {
    await page.goto("/oriki");

    const records = await getOrikiRecords({ publishedOnly: true });
    expect(records.length).toBe(18);

    const expectedFamilies = [
      "Eseha",
      "Attemogbe",
      "Attemoyi",
      "Eseyinmeleun",
      "Attejagbo",
      "Meleri",
      "Attemesami Olu",
      "Ako",
      "Eseyin Telu",
      "Anjaba",
      "Atte Meto",
      "Iyaloko",
      "Awinrin Mope",
      "Atte Lase",
      "Ota",
      "Atte Meya",
      "Eseyin Meta",
      "Obanro",
    ];

    for (const family of expectedFamilies) {
      const occurrences = records.filter((r) => r.family_origin.toLowerCase() === family.toLowerCase());
      expect(occurrences.length).toBe(1);
      await expect(page.getByText(family, { exact: true }).first()).toBeVisible();
    }

    // Explicit check: no duplicate Eseyin Meleun / Meleu
    const eseyinMeleun = records.filter((r) =>
      r.family_origin.toLowerCase().includes("eseyin") && r.family_origin.toLowerCase().includes("meleu")
    );
    expect(eseyinMeleun.length).toBe(1);
    expect(eseyinMeleun[0].family_origin).toBe("Eseyinmeleun");
    expect(eseyinMeleun[0].male_oriki).toBe("Eseyinmeleun");
    expect(eseyinMeleun[0].female_oriki).toBe("Omoeemeleu");
  });

  test("search by family name and praise name filters records in real time", async ({ page }) => {
    await page.goto("/oriki");

    const searchInput = page.getByPlaceholder("Search family name or Oríkì...");
    await searchInput.fill("Attemogbe");

    await expect(page.getByText("Attemogbe", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Anumogbe", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("1 Record")).toBeVisible();

    // Search by female praise name
    await searchInput.fill("Omosinla");
    await expect(page.getByText("Obanro", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Omosinla", { exact: true }).first()).toBeVisible();

    // Clear search
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(page.getByText("18 Records")).toBeVisible();
  });

  test("displays developing heritage notice note", async ({ page }) => {
    await page.goto("/oriki");

    await expect(
      page.getByText(
        "This is a developing community heritage record. Verified corrections and additional family Oríkì may be submitted for inclusion."
      )
    ).toBeVisible();
  });

  test("responsive layout on mobile has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/oriki");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Mobile cards should render family records clearly
    await expect(page.getByRole("heading", { name: "Eseha" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Attemogbe" })).toBeVisible();
  });
});
