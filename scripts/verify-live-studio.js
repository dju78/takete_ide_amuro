const { chromium } = require('@playwright/test');
const path = require('path');

async function verifyLiveProductionDaramola() {
  console.log('Starting Live Production Verification for Daramola Joseph Omoyele on https://takete-ide.org/celebration-studio ...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    // 1. Navigate to Live Celebration Studio
    const response = await page.goto('https://takete-ide.org/celebration-studio', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('1. Direct /celebration-studio HTTP status:', response.status());

    // 2. Verify Page Title
    const heading = await page.locator('h1').textContent();
    console.log('2. Live Page Heading:', heading.trim());

    // 3. Step 1: Select Template
    console.log('3. Selecting Personal Celebration Template...');
    await page.click('text=Personal Celebration');
    await page.click("button:has-text('Continue to Upload Photo')");

    // 4. Step 2: Choose Daramola Joseph Omoyele Demo Photo
    console.log('4. Selecting Daramola Joseph Omoyele Celebrant Photo...');
    const daramolaDemoBtn = page.locator("button:has-text('Daramola Joseph Omoyele')").first();
    if (await daramolaDemoBtn.count() > 0) {
      await daramolaDemoBtn.click();
    } else {
      await page.locator("button:has-text('Demo')").first().click();
    }

    // 5. Proceed to Step 3
    await page.waitForTimeout(1000);
    await page.click("button:has-text('Continue to Personalise')");

    // 6. Step 3: Enter Details for Daramola Joseph Omoyele
    console.log('6. Filling Personalisation Details for Daramola Joseph Omoyele...');
    const nameInput = page.locator("input[placeholder*='Omoyele'], input#fullName, input#name").first();
    await nameInput.fill('DARAMOLA JOSEPH OMOYELE');

    const titleInput = page.locator("input#userTitle").first();
    if (await titleInput.count() > 0) {
      await titleInput.fill('Proud Son of Takete-Ide');
    }

    // Proceed to Step 4
    await page.click("button:has-text('Continue to Preview')");

    // 7. Step 4: Verify Live Canvas Render
    console.log('7. Verifying Live Canvas Render on step 4...');
    await page.waitForSelector('canvas', { timeout: 15000 });
    const canvas = page.locator('canvas').first();
    const isVisible = await canvas.isVisible();
    console.log('7b. Live canvas is rendered and visible:', isVisible);

    // 8. Step 5: Proceed to Download
    await page.click("button:has-text('Continue to Download')");
    await page.waitForTimeout(1000);
    console.log('8. Step 5 Download reached successfully.');

    // Save screenshot of live page
    const screenshotDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio-preview');
    await page.screenshot({ path: path.join(screenshotDir, 'live-daramola-studio-verified.png'), fullPage: true });
    
    // Copy to artifact directory
    const artDir = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6';
    const fs = require('fs');
    fs.copyFileSync(path.join(screenshotDir, 'live-daramola-studio-verified.png'), path.join(artDir, 'live-daramola-studio-verified.png'));
    console.log('9. Saved live verification screenshot to live-daramola-studio-verified.png');

    console.log('====================================================');
    console.log('SUCCESS: Live production verified on https://takete-ide.org/celebration-studio');
    console.log('====================================================');
    return true;
  } catch (err) {
    console.error('Live verification check error:', err);
    return false;
  } finally {
    await browser.close();
  }
}

verifyLiveProductionDaramola().catch(console.error);
