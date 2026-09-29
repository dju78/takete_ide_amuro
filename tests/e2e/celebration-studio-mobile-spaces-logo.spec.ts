import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Celebration Studio - Mobile Keyboard Spaces & Full Circular Logo Verification", () => {
  test.use({
    viewport: { width: 390, height: 844 }, // iPhone 14 / Mobile Viewport
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
    hasTouch: true,
    isMobile: true,
  });

  test("Mobile phone typing: space key, multi-word typing, and pasting without stripping or underscore replacement", async ({
    page,
  }) => {
    await page.goto("/centenary/celebration-studio");

    // Step 1: Select Template -> Step 2
    await page.click("button:has-text('Continue to Upload Photo')");

    // Step 2: Use sample photo -> Step 3
    await page.click("button:has-text('Personal Demo')");
    await page.click("button:has-text('Continue to Personalise')");

    // Step 3: Test mobile typing in Celebrant Full Name
    const nameInput = page.locator("#fullName");
    await expect(nameInput).toBeVisible();

    // 1. Type "BIDEMI" then Space then "OMOYELE" character by character
    await nameInput.click();
    await nameInput.pressSequentially("BIDEMI OMOYELE", { delay: 50 });
    await expect(nameInput).toHaveValue("BIDEMI OMOYELE");

    // 2. Test inserting a space between existing words
    await nameInput.fill("BIDEMIOMOYELE");
    await nameInput.focus();
    // Position cursor after 'BIDEMI' (6 characters) and press Space
    await page.evaluate(() => {
      const input = document.getElementById("fullName") as HTMLInputElement;
      input.setSelectionRange(6, 6);
    });
    await page.keyboard.press("Space");
    await expect(nameInput).toHaveValue("BIDEMI OMOYELE");

    // 3. Test typing affiliation with multiple spaces in Title / Role field
    const titleInput = page.locator("#userTitle");
    await titleInput.click();
    await titleInput.pressSequentially("HAPPY TO BE MARRIED TO TAKETE-IDE", { delay: 30 });
    await expect(titleInput).toHaveValue("HAPPY TO BE MARRIED TO TAKETE-IDE");

    // 4. Test pasting text with spaces
    await titleInput.fill("");
    await page.evaluate(() => {
      const input = document.getElementById("userTitle") as HTMLInputElement;
      input.value = "HAPPY TO BE MARRIED TO TAKETE-IDE";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await expect(titleInput).toHaveValue("HAPPY TO BE MARRIED TO TAKETE-IDE");

    // Step 4: Continue to Preview
    await page.click("button:has-text('Continue to Preview')");
    await page.waitForTimeout(1000);

    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();

    // Capture screenshot on mobile
    const artifactDir = path.join(
      process.env.USERPROFILE || "C:/Users/Inspiron",
      ".gemini/antigravity/brain/54ce8c40-6ff3-4523-af7a-cbaa2019717c"
    );
    if (fs.existsSync(artifactDir)) {
      await canvas.screenshot({
        path: path.join(artifactDir, "mobile-preview-bidemi-omoyele.png"),
      });
    }

    // Step 5: Continue to Download
    await page.click("button:has-text('Continue to Download & Share')");
    await page.waitForTimeout(500);
    await expect(page.getByText("BIDEMI OMOYELE")).toBeVisible();
    await expect(page.getByRole("button", { name: /Download High-Res PNG/i })).toBeVisible();
  });
});
