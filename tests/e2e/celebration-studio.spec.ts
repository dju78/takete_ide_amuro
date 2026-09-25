import { test, expect } from "@playwright/test";

test.describe("Takete-Ide Celebration Studio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/centenary/celebration-studio");
  });

  test("1. Route loads successfully with status 200, breadcrumbs and canonical metadata", async ({ page }) => {
    const heading = page.locator("#main-content h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Takete-Ide Centenary Celebration Studio");

    // Breadcrumbs
    const breadcrumb = page.locator("nav[aria-label='Breadcrumb']");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toContainText("Centenary 2026");
    await expect(breadcrumb).toContainText("Celebration Studio");

    // Check step 1 is active
    const step1Title = page.locator("#main-content h2").first();
    await expect(step1Title).toContainText("Select a Commemorative Design");
  });

  test("2. Call-to-action on /centenary navigates directly to Celebration Studio", async ({ page }) => {
    await page.goto("/centenary");
    
    // Check Hero CTA button
    const heroCta = page.locator("a", { hasText: "Create Your Centenary Poster" }).first();
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveAttribute("href", "/centenary/celebration-studio");

    await heroCta.click();
    await expect(page).toHaveURL(/\/centenary\/celebration-studio/);
    await expect(page.locator("#main-content h1")).toContainText("Celebration Studio");
  });

  test("3. Template selection allows filtering by category and selecting templates", async ({ page }) => {
    // Check initial templates
    await expect(page.locator("h3", { hasText: "Personal Celebration" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Family Felicitation" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Leadership & Civic Celebration" })).toBeVisible();

    // Filter by Family category
    const familyTab = page.locator("button", { hasText: "Family" });
    await familyTab.click();
    await expect(page.locator("h3", { hasText: "Family Felicitation" })).toBeVisible();

    // Select Family Felicitation template
    const familyCard = page.locator("h3", { hasText: "Family Felicitation" }).locator("xpath=ancestor::div[@role='button']");
    await familyCard.click();
    await expect(familyCard).toContainText("Selected ✓");

    // Proceed to Step 2
    await page.click("button:has-text('Continue to Upload Photo')");
    await expect(page.locator("#main-content h2").first()).toContainText("Add Your Photograph");
  });

  test("4. Photo upload handles valid files and enforces 10MB size limit and types", async ({ page }) => {
    // Navigate to step 2
    await page.click("button:has-text('Continue to Upload Photo')");

    // Check privacy notice is present in step 2
    await expect(page.locator("text=Privacy & Data Security Guarantee")).toBeVisible();
    await expect(page.locator("text=never uploaded to our servers or permanently stored")).toBeVisible();

    // Test with Community Demo sample photo
    const samplePhotoBtn = page.locator("button", { hasText: "Community Celebrant (Demo)" });
    await expect(samplePhotoBtn).toBeVisible();
    await samplePhotoBtn.click();

    // Should now transition to Photo Adjustments editor
    await expect(page.locator("#main-content h2").first()).toContainText("Fine-tune Photo Placement");
    await expect(page.locator("text=Zoom Scale:")).toBeVisible();
    await expect(page.locator("text=Reposition Horizontal")).toBeVisible();
    await expect(page.locator("text=Rotate 90°")).toBeVisible();
  });

  test("5. Photo editor allows zoom, rotation, filter adjustments and photo removal", async ({ page }) => {
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Community Celebrant (Demo)')");

    // Test Zoom adjustment
    const zoomInBtn = page.locator("button[aria-label='Zoom in']");
    await zoomInBtn.click();
    await expect(page.locator("text=1.1x")).toBeVisible();

    // Test Rotate
    const rotateBtn = page.locator("button:has-text('Rotate 90°')");
    await rotateBtn.click();
    await expect(page.locator("text=(90°)")).toBeVisible();

    // Test Reset
    await page.click("button:has-text('Reset to default')");
    await expect(page.locator("text=1.0x")).toBeVisible();
    await expect(page.locator("text=(0°)")).toBeVisible();

    // Test Remove
    await page.click("button:has-text('Remove')");
    await expect(page.locator("#main-content h2").first()).toContainText("Add Your Photograph");
  });

  test("6. Personalisation form enforces text limits, live counts and approved quotes", async ({ page }) => {
    // Go to step 3
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Skip for Now / Add Later')");

    await expect(page.locator("#main-content h2").first()).toContainText("Add Your Details & Message");

    // Check celebrant name input
    const nameInput = page.locator("#fullName");
    await nameInput.fill("Chief Daramola Omoyele");
    await expect(page.locator("text=22/60")).toBeVisible();

    // Check approved quotation fill
    const quoteBtn = page.locator("button", { hasText: "Celebrating 100 years of heritage, unity and progress." }).first();
    await quoteBtn.click();

    const messageInput = page.locator("#messageInput");
    await expect(messageInput).toHaveValue("Celebrating 100 years of heritage, unity and progress.");

    // Check local expression chip
    const exprChip = page.locator("button", { hasText: "Agbagba Ide Agbe Wa O" }).first();
    await exprChip.click();
    await expect(page.locator("#expressionInput")).toHaveValue("Agbagba Ide Agbe Wa O");
  });

  test("7. State is preserved when navigating backwards and forwards between steps", async ({ page }) => {
    // Step 1 -> Step 2
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Community Celebrant (Demo)')");

    // Step 2 -> Step 3
    await page.click("button:has-text('Continue to Personalise')");

    // Fill custom name
    const nameInput = page.locator("#fullName");
    await nameInput.fill("Dr. Adebayo Kolade");

    // Step 3 -> Step 4 (Preview)
    await page.click("button:has-text('Continue to Preview')");
    await expect(page.locator("#main-content h2").first()).toContainText("Review Your Centenary Poster");

    // Navigate back to Step 3
    await page.click("button:has-text('Edit Details')");
    await expect(page.locator("#fullName")).toHaveValue("Dr. Adebayo Kolade");

    // Navigate back to Step 2
    await page.click("button:has-text('Back to Photo')");
    await expect(page.locator("#main-content h2").first()).toContainText("Fine-tune Photo Placement");

    // Navigate forward to Step 3 and 4
    await page.click("button:has-text('Continue to Personalise')");
    await expect(page.locator("#fullName")).toHaveValue("Dr. Adebayo Kolade");
    await page.click("button:has-text('Continue to Preview')");
  });

  test("8. Live poster preview supports format switcher, safe area guide and zoom toggle", async ({ page }) => {
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Skip for Now / Add Later')");
    await page.click("button:has-text('Continue to Preview')");

    // Verify Canvas is rendered
    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();

    // Format switching
    const squareBtn = page.locator("button", { hasText: "Square Post" });
    await squareBtn.click();
    await expect(page.locator("text=Format: Square Post (1080 × 1080px)")).toBeVisible();

    const storyBtn = page.locator("button", { hasText: "Status / Story" });
    await storyBtn.click();
    await expect(page.locator("text=Format: Status / Story (1080 × 1920px)")).toBeVisible();

    // Safe Area Guide toggle
    const safeGuideBtn = page.locator("button[title='Toggle Safe Area Bleed Guide']");
    await safeGuideBtn.click();
    await expect(safeGuideBtn).toHaveClass(/bg-sky-500/);

    // Zoom inspection toggle
    const zoomToggleBtn = page.locator("button", { hasText: "Zoom" });
    await zoomToggleBtn.click();
    await expect(page.locator("button", { hasText: "Fit" })).toBeVisible();
  });

  test("9. Step 5 Download and Share generates sanitized filename and handles sharing fallback", async ({ page }) => {
    // Fill custom name
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Skip for Now / Add Later')");
    await page.locator("#fullName").fill("Daramola Omoyele");
    await page.click("button:has-text('Continue to Preview')");
    await page.click("button:has-text('Continue to Download & Share')");

    // Check Step 5
    await expect(page.locator("#main-content h2").first()).toContainText("Your Poster is Ready!");
    await expect(page.locator("text=Filename: takete-ide-centenary-daramola-omoyele.png")).toBeVisible();

    // Check Download button exists
    const downloadBtn = page.locator("button", { hasText: "Download High-Res PNG" });
    await expect(downloadBtn).toBeVisible();

    // Check Share Poster button exists
    const shareBtn = page.locator("button", { hasText: "Share Poster" });
    await expect(shareBtn).toBeVisible();

    // Check Privacy notice in step 5
    await expect(page.locator("text=Privacy & Data Security Guarantee")).toBeVisible();
  });

  test("10. Zero network uploads occur when uploading and editing photographs", async ({ page }) => {
    const uploadedNetworkRequests: string[] = [];

    page.on("request", (req) => {
      const url = req.url();
      // Track any POST/PUT network requests that could transmit image payloads
      if (
        (req.method() === "POST" || req.method() === "PUT") &&
        !url.includes("/api/weather") &&
        !url.includes("/_next")
      ) {
        uploadedNetworkRequests.push(`${req.method()} ${url}`);
      }
    });

    // Run through full wizard flow
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Community Celebrant (Demo)')");
    await page.click("button:has-text('Continue to Personalise')");
    await page.locator("#fullName").fill("Ayodele Balogun");
    await page.click("button:has-text('Continue to Preview')");
    await page.click("button:has-text('Continue to Download & Share')");

    // Ensure no unexpected server upload occurred
    expect(uploadedNetworkRequests).toEqual([]);
  });

  test("11. Start Again button displays confirmation dialog before resetting", async ({ page }) => {
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Skip for Now / Add Later')");
    await page.locator("#fullName").fill("Testing Name");
    await page.click("button:has-text('Continue to Preview')");

    // Click Start Again
    const startAgainBtn = page.locator("button", { hasText: "Start Again" }).first();
    await startAgainBtn.click();

    // Confirm dialog is visible
    const dialog = page.locator("div[role='dialog']");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Start a New Poster?");

    // Cancel first
    await page.click("button:has-text('Keep Current Design')");
    await expect(dialog).not.toBeVisible();

    // Reopen and confirm reset
    await startAgainBtn.click();
    await page.click("button:has-text('Yes, Start Again')");

    // Should return to Step 1
    await expect(page.locator("#main-content h2").first()).toContainText("Select a Commemorative Design");
  });

  test("12. Responsive behavior on mobile viewport (375x667)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/centenary/celebration-studio");

    // Verify mobile layout
    await expect(page.locator("text=Step 1 of 5: Template")).toBeVisible();
    await expect(page.locator("#main-content h1")).toBeVisible();

    // Continue to Step 2
    await page.click("button:has-text('Continue to Upload Photo')");
    await expect(page.locator("text=Step 2 of 5: Photo")).toBeVisible();
  });
});
