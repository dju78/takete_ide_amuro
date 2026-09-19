import { test, expect } from "@playwright/test";
import { getOrikiRecords } from "@/lib/data/oriki-records";

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
    await expect(page.getByText(/This collection preserves the traditional praise names/i)).toBeVisible();
  });

  test("contains all approved fallback records with no duplicate Eseyin Meleun", async ({ page }) => {
    await page.goto("/oriki");

    const records = await getOrikiRecords({ publishedOnly: true });
    // Verify fallback or live dataset has at least the 18 approved community records
    expect(records.length).toBeGreaterThanOrEqual(18);

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
      const occurrences = records.filter((r) => r.family_origin.toLowerCase().includes(family.toLowerCase()));
      expect(occurrences.length).toBeGreaterThanOrEqual(1);
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

    const searchInput = page.getByRole("searchbox", { name: "Search Oríkì records" });
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
    await expect(page.locator("span", { hasText: /Records?/i }).first()).toBeVisible();
  });

  test("does not display developing heritage research disclaimer notice", async ({ page }) => {
    await page.goto("/oriki");

    await expect(
      page.getByText(
        "This is a developing community heritage record. Verified corrections and additional family Oríkì may be submitted for inclusion."
      )
    ).toHaveCount(0);
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

  test("resolves approved audio correctly for live Supabase UUID records and name variations without collision", async () => {
    const { resolveApprovedAudio, withApprovedAudio } = await import("@/lib/data/oriki-records");

    // 1. Live Supabase-style UUID records for Eseha variations
    const esehaRecord = withApprovedAudio({
      id: "d71b3e8c-5a9e-4c74-8840-08709e17b351",
      family_origin: "Eseha",
      male_oriki: "Eseha",
      female_oriki: "Eha",
      display_order: 1,
      published: true,
    });
    expect(esehaRecord.audio_url).toBe("/audio/oriki/eseha-jare.ogg");
    expect(esehaRecord.audio_title).toBe("Oríkì Eseha Jare");

    const esehaJareRecord = withApprovedAudio({
      id: "f83a2190-1122-4433-8899-aabbccddeeff",
      family_origin: "Eseha Jare",
      male_oriki: "Eseha Jare",
      female_oriki: "Eha",
      display_order: 1,
      published: true,
    });
    expect(esehaJareRecord.audio_url).toBe("/audio/oriki/eseha-jare.ogg");

    const esehaJareeRecord = withApprovedAudio({
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      family_origin: "Eseha Jaree",
      male_oriki: "Eseha Jaree",
      female_oriki: "Eha",
      display_order: 1,
      published: true,
    });
    expect(esehaJareeRecord.audio_url).toBe("/audio/oriki/eseha-jare.ogg");

    // 2. Live Supabase-style UUID records for Mesami Olu variations
    const attemesamiRecord = withApprovedAudio({
      id: "b5c6d7e8-f9a0-1234-5678-9abcdef01234",
      family_origin: "Attemesami Olu",
      male_oriki: "Attemesami Olu",
      female_oriki: "Anumesami Olu",
      display_order: 7,
      published: true,
    });
    expect(attemesamiRecord.audio_url).toBe("/audio/oriki/mesami-olu.ogg");
    expect(attemesamiRecord.audio_title).toBe("Oríkì Mesami Olu");

    const mesamiRecord = withApprovedAudio({
      id: "c9d0e1f2-a3b4-5678-9012-3456789abcde",
      family_origin: "Mesami Olu",
      male_oriki: "Mesami Olu",
      female_oriki: "Anumesami Olu",
      display_order: 7,
      published: true,
    });
    expect(mesamiRecord.audio_url).toBe("/audio/oriki/mesami-olu.ogg");

    // 3. Live Supabase-style UUID records for Eseyin Telu
    const eseyinTeluRecord = withApprovedAudio({
      id: "e4f5a6b7-c8d9-0123-4567-89abcdef0123",
      family_origin: "Eseyin Telu",
      male_oriki: "Eseyin Telu",
      female_oriki: "Omoe Telu",
      display_order: 9,
      published: true,
    });
    expect(eseyinTeluRecord.audio_url).toBe("/audio/oriki/eseyin-telu.ogg");
    expect(eseyinTeluRecord.audio_title).toBe("Oríkì Eseyin Telu");

    // 4. Strict isolation: Ensure other Atte and Eseyin families NEVER get audio
    const nonAudioFamilies = [
      { id: "uuid-1", family_origin: "Attemogbe", male_oriki: "Attemogbe", female_oriki: "Anumogbe" },
      { id: "uuid-2", family_origin: "Attemoyi", male_oriki: "Attemoyi", female_oriki: "Anumoyi" },
      { id: "uuid-3", family_origin: "Eseyinmeleun", male_oriki: "Eseyinmeleun", female_oriki: "Omoeemeleu" },
      { id: "uuid-4", family_origin: "Attejagbo", male_oriki: "Attejagbo", female_oriki: "Anujagbo" },
      { id: "uuid-5", family_origin: "Meleri", male_oriki: "Meleri", female_oriki: "Iyemeleri" },
      { id: "uuid-6", family_origin: "Ako", male_oriki: "Ako", female_oriki: "Ako" },
      { id: "uuid-7", family_origin: "Anjaba", male_oriki: "Anjaba", female_oriki: "Anjaba" },
      { id: "uuid-8", family_origin: "Atte Meto", male_oriki: "Atte Meto", female_oriki: "Anu Meto" },
      { id: "uuid-9", family_origin: "Iyaloko", male_oriki: "Iyaloko", female_oriki: "Iyaloko" },
      { id: "uuid-10", family_origin: "Awinrin Mope", male_oriki: "Awinrin Mope", female_oriki: "Awinrin Mope" },
      { id: "uuid-11", family_origin: "Atte Lase", male_oriki: "Atte Lase", female_oriki: "Anu Lase" },
      { id: "uuid-12", family_origin: "Ota", male_oriki: "Ota", female_oriki: "Onanra" },
      { id: "uuid-13", family_origin: "Atte Meya", male_oriki: "Atte Meya", female_oriki: "Anu Meya" },
      { id: "uuid-14", family_origin: "Eseyin Meta", male_oriki: "Eseyin Meta", female_oriki: "Anu Meta" },
      { id: "uuid-15", family_origin: "Obanro", male_oriki: "Obanro", female_oriki: "Omosinla" },
    ];

    for (const item of nonAudioFamilies) {
      const res = resolveApprovedAudio({ id: item.id, family_origin: item.family_origin, male_oriki: item.male_oriki, audio_url: null, audio_title: null });
      expect(res).toBeNull();
    }
  });

  test("loads verified audio players for Eseha Jare, Attemesami Olu, and Eseyin Telu on desktop and mobile", async ({ page, request }) => {
    // 1. Verify audio static assets resolve over HTTP with 200 OK
    const esehaRes = await request.get("/audio/oriki/eseha-jare.ogg");
    expect(esehaRes.status()).toBe(200);
    expect(Number(esehaRes.headers()["content-length"])).toBe(23187);

    const mesamiRes = await request.get("/audio/oriki/mesami-olu.ogg");
    expect(mesamiRes.status()).toBe(200);
    expect(Number(mesamiRes.headers()["content-length"])).toBe(24672);

    const eseyinRes = await request.get("/audio/oriki/eseyin-telu.ogg");
    expect(eseyinRes.status()).toBe(200);
    expect(Number(eseyinRes.headers()["content-length"])).toBe(14021);

    // 2. Desktop verification
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/oriki");

    const desktopEsehaAudio = page.locator('table audio[aria-label="Oríkì Eseha Jare"]');
    await expect(desktopEsehaAudio).toBeVisible();
    await expect(desktopEsehaAudio.locator("source")).toHaveAttribute("src", "/audio/oriki/eseha-jare.ogg");

    const desktopMesamiAudio = page.locator('table audio[aria-label="Oríkì Mesami Olu"]');
    await expect(desktopMesamiAudio).toBeVisible();
    await expect(desktopMesamiAudio.locator("source")).toHaveAttribute("src", "/audio/oriki/mesami-olu.ogg");

    const desktopEseyinAudio = page.locator('table audio[aria-label="Oríkì Eseyin Telu"]');
    await expect(desktopEseyinAudio).toBeVisible();
    await expect(desktopEseyinAudio.locator("source")).toHaveAttribute("src", "/audio/oriki/eseyin-telu.ogg");

    // Records without audio omit the audio player cleanly without missing-media messaging
    await expect(page.getByText("Text only")).toHaveCount(0);
    await expect(page.getByText("Not yet recorded")).toHaveCount(0);

    // 3. Mobile verification
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/oriki");

    const mobileEsehaAudio = page.locator('.space-y-3 audio[aria-label="Oríkì Eseha Jare"]');
    await expect(mobileEsehaAudio).toBeVisible();
    await expect(mobileEsehaAudio.locator("source")).toHaveAttribute("src", "/audio/oriki/eseha-jare.ogg");

    const mobileMesamiAudio = page.locator('.space-y-3 audio[aria-label="Oríkì Mesami Olu"]');
    await expect(mobileMesamiAudio).toBeVisible();
    await expect(mobileMesamiAudio.locator("source")).toHaveAttribute("src", "/audio/oriki/mesami-olu.ogg");

    const mobileEseyinAudio = page.locator('.space-y-3 audio[aria-label="Oríkì Eseyin Telu"]');
    await expect(mobileEseyinAudio).toBeVisible();
    await expect(mobileEseyinAudio.locator("source")).toHaveAttribute("src", "/audio/oriki/eseyin-telu.ogg");

    // 4. Search filter maintains audio playback affordance
    const searchInput = page.getByRole("searchbox", { name: "Search Oríkì records" });
    await searchInput.fill("Eseha");
    await expect(page.locator('.space-y-3 audio[aria-label="Oríkì Eseha Jare"]')).toBeVisible();
  });

  test("audio filter toggle filters directory to records with audio", async ({ page }) => {
    await page.goto("/oriki");
    const initialBadge = page.locator("span", { hasText: /Records?/i }).first();
    const initialText = await initialBadge.innerText();

    const audioFilterBtn = page.getByRole("button", { name: /Audio Available/i });
    await audioFilterBtn.click();
    await expect(page.getByText("3 Records")).toBeVisible();
    await expect(page.getByText(/Eseha/).first()).toBeVisible();
    await expect(page.getByText(/Attemesami Olu|Mesami Olu/).first()).toBeVisible();
    await expect(page.getByText(/Eseyin Telu/).first()).toBeVisible();

    const allRecordsBtn = page.getByRole("button", { name: /All Records/i });
    await allRecordsBtn.click();
    await expect(initialBadge).toHaveText(initialText);
  });
});
