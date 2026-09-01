import { test, expect } from "@playwright/test";
import {
  CENTENARY_GUESTS,
  CENTENARY_RSVP_CONTACTS,
  INDIVIDUAL_GUEST_COUNT,
  GROUP_ENTITY_COUNT,
  TOTAL_RECORD_COUNT,
} from "@/lib/media/centenary-guests";

test.describe("Centenary 2026 — Official Guests, Hosts, RSVP & Invitation Source Accuracy", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/centenary");
  });

  test("programmatic guest and host counts are verified", () => {
    expect(INDIVIDUAL_GUEST_COUNT).toBe(24);
    expect(GROUP_ENTITY_COUNT).toBe(1);
    expect(TOTAL_RECORD_COUNT).toBe(25);
    expect(CENTENARY_GUESTS.length).toBe(25);
  });

  test("renders Official Guests & Hosts with exact source-derived names, categories, and roles", async ({ page }) => {
    const guestsSection = page.locator("#guests");
    await expect(guestsSection).toBeVisible();
    await expect(guestsSection.getByRole("heading", { name: "Official Guests & Hosts" })).toBeVisible();

    // 1. Distinguished Special Guest of Honour
    await expect(guestsSection.getByText("His Excellency Alh. Ahmed Usman Ododo, FCA")).toBeVisible();
    await expect(guestsSection.getByText("The Chief Servant of Kogi State")).toBeVisible();

    // 2. Special Guests of Honour (6 individuals)
    await expect(guestsSection.getByText("Distinguished Senator Sunday Karimi")).toBeVisible();
    await expect(guestsSection.getByText("Senator Representing Kogi West Senatorial District")).toBeVisible();

    await expect(guestsSection.getByText("Hon. James Abiodun Faleke")).toBeVisible();
    await expect(guestsSection.getByText("Member Representing Ikeja Federal Constituency")).toBeVisible();

    await expect(guestsSection.getByText("Hon. Leke Abejide")).toBeVisible();
    await expect(guestsSection.getByText("Member Representing Yagba Federal Constituency")).toBeVisible();

    await expect(guestsSection.getByText("Hon. Salman Idris")).toBeVisible();
    await expect(guestsSection.getByText("Member Representing Kabba/Bunu/Ijumu Federal Constituency")).toBeVisible();

    // Prince Olusoji Olatunji: role is Chairman, Grosvenor Group (NOT Distinguished Guest of Honour)
    await expect(guestsSection.getByText("Prince Olusoji Olatunji")).toBeVisible();
    await expect(guestsSection.getByText("Chairman, Grosvenor Group")).toBeVisible();

    await expect(guestsSection.getByText("Hajia Habibat Onumoko")).toBeVisible();
    await expect(guestsSection.getByText("Kogi State Accountant General")).toBeVisible();

    // 3. Chairman of the Day: role is Managing Director, Ajaokuta Steel Company Limited
    await expect(guestsSection.getByText("Professor Nasir Naeem Abdulsalam")).toBeVisible();
    await expect(guestsSection.getByText("Managing Director, Ajaokuta Steel Company Limited")).toBeVisible();

    // 4. Lady Chairman: role is Business Tycoon
    await expect(guestsSection.getByText("Chief Mrs. Toyin Omole")).toBeVisible();
    await expect(guestsSection.getByText("Business Tycoon")).toBeVisible();

    // 5. Chief Launcher: Dr. Korede Adedayo (spelling Adedayo), Chairman and CEO, First Trust Mortgage Bank Plc
    await expect(guestsSection.getByText("Dr. Korede Adedayo, FCIB")).toBeVisible();
    await expect(guestsSection.getByText("Chairman and CEO, First Trust Mortgage Bank Plc")).toBeVisible();

    // 6. Co-Launchers (5 individuals)
    await expect(guestsSection.getByText("Engr. Fahad Mangal")).toBeVisible();
    await expect(guestsSection.getByText("Managing Director, Mangal Cement Company")).toBeVisible();

    await expect(guestsSection.getByText("Chief Dr. Yomi Charles Olarunisola")).toBeVisible();
    await expect(guestsSection.getByText("Chairman, Absolute Group, Abuja")).toBeVisible();

    await expect(guestsSection.getByText("Hon. Engr. Bashir Abubakar (Gegu)")).toBeVisible();
    await expect(guestsSection.getByText("Kogi State Commissioner for Solid Minerals and Natural Resources")).toBeVisible();

    await expect(guestsSection.getByText("Mukadam Asiwaju Idris Asiru")).toBeVisible();
    await expect(guestsSection.getByText("Kogi State Commissioner for Finance, Budget and Economic Planning")).toBeVisible();

    await expect(guestsSection.getByText("Engr. Friday Idachaba")).toBeVisible();
    await expect(guestsSection.getByText("Business Mogul")).toBeVisible();

    // 7. Special Hosts (2 individuals)
    await expect(guestsSection.getByText("Hon. Ademola Bello")).toBeVisible();
    await expect(guestsSection.getByText("Executive Chairman, Mopamuro Local Government Area")).toBeVisible();

    await expect(guestsSection.getByText("Hon. Olawumi Jacob")).toBeVisible();
    await expect(guestsSection.getByText("Member Rep. Mopamuro Constituency, Kogi State House of Assembly")).toBeVisible();

    // 8. Special Royal Guest: HRM Oba Solomon Owoniyi & Okun Area Traditional Council
    await expect(guestsSection.getByText("HRM Oba Solomon Owoniyi")).toBeVisible();
    await expect(guestsSection.getByText("The Obaro of Kabba and Chairman, Okun Area Traditional Council")).toBeVisible();

    // 9. Special Royal Hosts: HRM Oba Muyiwa Ibeun & HRM Engr. Alfred Modupe Ayedogbon
    await expect(guestsSection.getByText("HRM Oba Muyiwa Ibeun")).toBeVisible();
    await expect(guestsSection.getByText("The Elulu of Mopa and Chairman, Mopamuro LGA Traditional Council")).toBeVisible();

    await expect(guestsSection.getByText("HRM Engr. Alfred Modupe Ayedogbon")).toBeVisible();
    await expect(guestsSection.getByText("The Alamuro of Amuro and Vice Chairman, Mopamuro LGA Traditional Council")).toBeVisible();

    // 10. Royal Guest: HRH Ambassador Dr. Tolorunjuwon L. Ayo + All Members of the Mopamuro Traditional Council
    await expect(guestsSection.getByText("HRH Ambassador Dr. Tolorunjuwon L. Ayo")).toBeVisible();
    await expect(guestsSection.getByText("The Olu Agba III of Makutu, Isanlu")).toBeVisible();

    await expect(guestsSection.getByText("All Members of the Mopamuro Traditional Council")).toBeVisible();

    // 11. Royal Host: HRH Oba Philip Ebilakun
    await expect(guestsSection.getByText("HRH Oba Philip Ebilakun")).toBeVisible();
    await expect(guestsSection.getByText("The Olu'de of Takete Ide, Amuro")).toBeVisible();

    // 12. Chief Hosts: Prince (Buldr) Richard Fiki & Hon. Kingsley Femi Fanwo
    await expect(guestsSection.getByText("Prince (Buldr) Richard Fiki")).toBeVisible();
    await expect(guestsSection.getByText("National President, Takete-Ide Progressive Union (TIPU)")).toBeVisible();

    await expect(guestsSection.getByText("Hon. Kingsley Femi Fanwo")).toBeVisible();
    await expect(guestsSection.getByText("Kogi State Commissioner for Information and Communications")).toBeVisible();
  });

  test("incorrect records, extraneous titles and invented roles are completely absent", async ({ page }) => {
    const guestsSection = page.locator("#guests");

    // Absent incorrect records and roles
    await expect(guestsSection.getByText("Williams Ayodele Michael")).toHaveCount(0);
    await expect(guestsSection.getByText("Obagte of Orokere-Amuro")).toHaveCount(0);
    await expect(guestsSection.getByText("Dr. Korede Adebayo")).toHaveCount(0);
    await expect(guestsSection.getByText("Royal Guests & Custodians of Heritage")).toHaveCount(0);

    // No portrait images inside guest cards
    const guestImages = guestsSection.locator("img");
    await expect(guestImages).toHaveCount(0);
  });

  test("renders exact published RSVP contact numbers without invented role labels or protocol claim", async ({ page }) => {
    const rsvpSection = page.locator("#rsvp");
    await expect(rsvpSection).toBeVisible();
    await expect(rsvpSection.getByRole("heading", { name: "RSVP & Enquiries" })).toBeVisible();
    await expect(
      rsvpSection.getByText("For enquiries, confirmations, sponsorships, and participation, kindly contact:"),
    ).toBeVisible();

    // Verify all 4 exact published numbers
    const expectedNumbers = [
      { display: "08163376331", tel: "+2348163376331" },
      { display: "08050724351", tel: "+2348050724351" },
      { display: "08038308369", tel: "+2348038308369" },
      { display: "08038862295", tel: "+2348038862295" },
    ];

    for (const item of expectedNumbers) {
      await expect(rsvpSection.getByText(item.display)).toBeVisible();
      const link = rsvpSection.locator(`a[href="tel:${item.tel}"]`);
      await expect(link).toBeVisible();
    }

    // Previous incorrect numbers must be absent
    await expect(rsvpSection.getByText("0803 596 8202")).toHaveCount(0);
    await expect(rsvpSection.getByText("0803 358 1118")).toHaveCount(0);
    await expect(rsvpSection.getByText("0806 564 3535")).toHaveCount(0);
    await expect(rsvpSection.getByText("0803 331 4376")).toHaveCount(0);

    // Invented role labels and protocol claim must be absent
    await expect(rsvpSection.getByText("Centenary Planning Committee")).toHaveCount(0);
    await expect(rsvpSection.getByText("National Secretariat, TIPU")).toHaveCount(0);
    await expect(rsvpSection.getByText("Centenary Protocol & Media")).toHaveCount(0);
    await expect(rsvpSection.getByText("Centenary Sponsorships & Liaison")).toHaveCount(0);
    await expect(rsvpSection.getByText(/protocol/i)).toHaveCount(0);
  });

  test("renders Official Invitation section with single verified asset and modal viewer", async ({ page }) => {
    const invitationSection = page.locator("#invitation");
    await expect(invitationSection).toBeVisible();
    await expect(invitationSection.getByRole("heading", { name: "Official Invitation" })).toBeVisible();

    // Preview image is loaded
    const previewImg = invitationSection.locator("img").first();
    await expect(previewImg).toBeVisible();

    // Open fullscreen modal
    const fullscreenBtn = invitationSection.getByRole("button", { name: /View Fullscreen|Enlarge Invitation/ }).first();
    await fullscreenBtn.click();

    const dialog = page.getByRole("dialog", { name: "Official Centenary Invitation Viewer" });
    await expect(dialog).toBeVisible();

    // Close on Escape key
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("Centenary in-page navigation includes Guests & Hosts, Invitation and RSVP", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Centenary sections" });
    await expect(nav.getByRole("link", { name: "Guests & Hosts" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Official Invitation" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "RSVP & Enquiries" })).toBeVisible();
  });

  test("homepage Centenary section includes a link to Official Guests & Hosts", async ({ page }) => {
    await page.goto("/");
    const guestsLink = page.getByRole("link", { name: "Official Guests & Hosts →" });
    await expect(guestsLink).toBeVisible();
    await expect(guestsLink).toHaveAttribute("href", "/centenary#guests");
  });

  for (const viewport of [
    { width: 320, height: 600, label: "320px mobile" },
    { width: 375, height: 667, label: "375px mobile" },
    { width: 768, height: 1024, label: "768px tablet" },
    { width: 1280, height: 800, label: "desktop" },
  ]) {
    test(`renders without horizontal overflow at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/centenary");

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});
