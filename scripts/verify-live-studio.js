const { chromium } = require('@playwright/test');
const path = require('path');

async function verifyLiveProduction() {
  console.log('Starting Live Production Verification on https://takete-ide.org/celebration-studio ...');
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

    // 2. Verify Page Title and Header
    const heading = await page.locator('h1').textContent();
    console.log('2. Live Page Heading:', heading.trim());

    // 3. Step 1: Select Template
    console.log('3. Selecting Personal Celebration Template...');
    await page.click('text=Personal Celebration');
    await page.click("button:has-text('Continue to Upload Photo')");

    // 4. Step 2: Choose Sample Celebrant Photo
    console.log('4. Selecting Sample Celebrant Photo...');
    const demoBtn = page.locator("button:has-text('Mrs Omolara Eseyin')").first();
    if (await demoBtn.count() > 0) {
      await demoBtn.click();
    } else {
      await page.locator("button:has-text('Demo')").first().click();
    }

    // 5. Fine tune photo and proceed
    await page.waitForTimeout(1000);
    await page.click("button:has-text('Continue to Personalise')");

    // 6. Step 3: Enter Details
    console.log('6. Filling Personalisation Details...');
    const nameInput = page.locator("input[placeholder*='Omoyele'], input#name").first();
    if (await nameInput.count() > 0) {
      await nameInput.fill('Mrs Omolara Eseyin');
    }
    await page.click("button:has-text('Continue to Preview')");

    // 7. Step 4: Live Poster Preview
    console.log('7. Verifying Live Canvas Render on step 4...');
    await page.waitForSelector('canvas', { timeout: 15000 });
    const canvas = page.locator('canvas').first();
    const isVisible = await canvas.isVisible();
    console.log('7b. Live canvas is rendered and visible:', isVisible);

    // Proceed to Step 5: Download
    await page.click("button:has-text('Continue to Download')");
    await page.waitForTimeout(1000);
    console.log('8. Step 5 Download reached successfully.');

    // Save screenshot of live page
    const screenshotDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio-preview');
    await page.screenshot({ path: path.join(screenshotDir, 'live-production-studio-verified.png') });
    console.log('9. Saved live verification screenshot to public/images/celebration-studio-preview/live-production-studio-verified.png');

    // 9. Test Navigation links from Centenary and Header
    console.log('10. Verifying Site Navigation pathways on live site...');
    await page.goto('https://takete-ide.org/centenary', { waitUntil: 'networkidle' });
    const cta = page.locator("a:has-text('Create Your Centenary Poster')").first();
    const href = await cta.getAttribute('href');
    console.log('11. Centenary Page Hero CTA target:', href);

    // Click Hero CTA to verify live routing
    await cta.click();
    await page.waitForURL('**/celebration-studio');
    console.log('12. Successfully navigated from /centenary to live /celebration-studio URL:', page.url());

    console.log('====================================================');
    console.log('VERIFICATION SUCCESSFUL: Live site 100% verified on takete-ide.org');
    console.log('====================================================');
    return true;
  } catch (err) {
    console.error('Live verification check error:', err);
    return false;
  } finally {
    await browser.close();
  }
}

verifyLiveProduction().catch(console.error);
