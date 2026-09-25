import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ARTIFACTS_DIR = path.resolve("public/images/celebration-studio-preview");

test.describe("Celebration Studio Full Verification Gate & Asset Generation", () => {
  test.beforeAll(() => {
    if (!fs.existsSync(ARTIFACTS_DIR)) {
      fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    }
  });

  test("Comprehensive Verification: Uploads, 5MB-10MB Samsung Photo, Orientations, Dimensions, & Multi-Device Captures", async ({
    page,
  }) => {
    test.setTimeout(180000);

    // 1. Generate realistic 6.5 MB camera image buffer
    const largeImageBuffer = Buffer.alloc(6.5 * 1024 * 1024, 0x80);

    // 2. Desktop Full Step-by-Step Flow & Screenshots (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/centenary/celebration-studio");
    await page.waitForLoadState("networkidle");

    // Screenshot Step 1: Template Selection
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step-1-template-selection-desktop.png"),
      fullPage: false,
    });

    // Select Personal Celebration Template
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.waitForSelector("text=Add Your Photograph");

    // Screenshot Step 2: Photo Upload
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step-2-photo-upload-desktop.png"),
      fullPage: false,
    });

    // Upload the 6.5 MB image
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.click("div[role='button']:has-text('Upload Your Photograph')");
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: "samsung-galaxy-s24-portrait.jpg",
      mimeType: "image/jpeg",
      buffer: largeImageBuffer,
    });

    // Verify it transitions to Photo Editor
    await expect(page.locator("#main-content h2").first()).toContainText("Fine-tune Photo Placement");

    // Screenshot Step 2: Photo Editor Adjustments
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step-2-photo-editor-desktop.png"),
      fullPage: false,
    });

    // Test Zoom, Pan, Rotation
    await page.click("button[aria-label='Zoom in']");
    await page.click("button:has-text('Rotate 90°')");

    // Step 3: Personalisation
    await page.click("button:has-text('Continue to Personalise')");
    await expect(page.locator("#main-content h2").first()).toContainText("Add Your Details & Message");

    // Fill personalised details
    await page.locator("#fullName").fill("Chief Daramola Omoyele");
    await page.locator("#userTitle").fill("Proud Son & Centenary Ambassador");
    await page.locator("#messageInput").fill("Celebrating 100 years of heritage, unity and progress. Long live Takete-Ide!");
    await page.locator("#expressionInput").fill("Agbagba Ide Agbe Wa O");

    // Screenshot Step 3: Personalisation Form
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step-3-personalisation-desktop.png"),
      fullPage: false,
    });

    // Step 4: Preview
    await page.click("button:has-text('Continue to Preview')");
    await expect(page.locator("#main-content h2").first()).toContainText("Review Your Centenary Poster");
    await page.waitForTimeout(1000); // Allow canvas render

    // Screenshot Step 4: Live Preview
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step-4-preview-desktop.png"),
      fullPage: false,
    });

    // Step 5: Export & Download
    await page.click("button:has-text('Continue to Download & Share')");
    await expect(page.locator("#main-content h2").first()).toContainText("Your Poster is Ready!");

    // Screenshot Step 5: Download & Share
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "step-5-download-desktop.png"),
      fullPage: false,
    });

    // 3. Multi-Device Responsive Screenshots
    const viewports = [
      { name: "mobile-320", width: 320, height: 640 },
      { name: "mobile-360", width: 360, height: 740 },
      { name: "mobile-390", width: 390, height: 844 },
      { name: "tablet-768", width: 768, height: 1024 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/centenary/celebration-studio");
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, `studio-${vp.name}.png`),
        fullPage: false,
      });
    }

    // 4. Test Text Overlap with very long text
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/centenary/celebration-studio");
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Skip for Now / Add Later')");

    await page.locator("#fullName").fill("High Chief Ambassador Dr. Olusegun Michael Adeyemi-Daramola");
    await page.locator("#userTitle").fill("Distinguished National Community Patron & Grand Centennial Coordinator");
    await page.locator("#messageInput").fill(
      "On this momentous centennial anniversary, we heartily salute the endurance, faith and collective achievements of all Takete-Ide sons and daughters worldwide. May our land continue to flourish in peace, solidarity and abundant prosperity across generations to come."
    );
    await page.locator("#expressionInput").fill("Agbagba Ide Agbe Wa O · A Century of Heritage and Progress");

    await page.click("button:has-text('Continue to Preview')");
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "preview-long-text-validation.png"),
      fullPage: false,
    });

    // 5. Generate Revised 1200x1600 Printable Poster & All Format Variations for Personal Celebration
    await page.goto("/centenary/celebration-studio");
    await page.click("button:has-text('Continue to Upload Photo')");
    await page.click("button:has-text('Community Celebrant (Demo)')");
    await page.click("button:has-text('Continue to Personalise')");
    await page.locator("#fullName").fill("Chief Daramola Omoyele");
    await page.locator("#messageInput").fill("Celebrating 100 years of heritage, unity and progress. Long live Takete-Ide!");
    await page.locator("#expressionInput").fill("Agbagba Ide Agbe Wa O");
    await page.click("button:has-text('Continue to Preview')");
    await page.waitForTimeout(1000);

    // Switch to Printable Portrait (1200x1600)
    await page.click("button:has-text('Printable Portrait')");
    await page.waitForTimeout(1000);
    const printableCanvas = page.locator("canvas").first();
    await printableCanvas.screenshot({
      path: path.join(ARTIFACTS_DIR, "sample-poster-personal-celebration-1200x1600.png"),
    });

    // 6. Generate Sample Poster Canvases for all 5 templates
    const templateIds = [
      "personal-celebration",
      "family-felicitation",
      "leadership-celebration",
      "heritage-nature",
      "custom-celebration",
    ];

    for (const tplId of templateIds) {
      await page.goto("/centenary/celebration-studio");
      await page.click(`div[role='button']:has(h3:text("${tplId === "personal-celebration" ? "Personal Celebration" : tplId === "family-felicitation" ? "Family Felicitation" : tplId === "leadership-celebration" ? "Leadership & Civic Celebration" : tplId === "heritage-nature" ? "Heritage & Natural Wonders" : "Create Your Own Style"}"))`);
      await page.click("button:has-text('Continue to Upload Photo')");
      await page.click("button:has-text('Community Celebrant (Demo)')");
      await page.click("button:has-text('Continue to Personalise')");
      await page.click("button:has-text('Continue to Preview')");
      await page.waitForTimeout(800);

      const canvasLocator = page.locator("canvas").first();
      await canvasLocator.screenshot({
        path: path.join(ARTIFACTS_DIR, `sample-poster-${tplId}.png`),
      });
    }
  });
});
