const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testFullRendererWithCutout() {
  const templatesDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'templates');
  const samplesDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'samples');
  const outDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio-preview');

  const bgPath = path.join(templatesDir, 'poster-clean-background.png');
  const headerPath = path.join(templatesDir, 'header-bar.png');
  const rightPanelPath = path.join(templatesDir, 'right-monument-and-message.png');
  const bottomWavePath = path.join(templatesDir, 'bottom-wave-clean.png');
  const plaquePath = path.join(templatesDir, 'clean-plaque-standard.png');

  // Load transparent cutout of Daramola Joseph Omoyele
  const cutoutPath = path.join(samplesDir, 'sample-daramola-joseph-omoyele-cutout.png');
  const portraitCutout = await sharp(cutoutPath)
    .resize(360, 520, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create clean dynamic plaque for DARAMOLA JOSEPH OMOYELE
  const plaqueSvg = Buffer.from(`
    <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
      <style>
        .badge {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 800;
          font-size: 15px;
          fill: #f5cf47;
          text-anchor: middle;
          letter-spacing: 1.5px;
        }
        .name {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          font-size: 26px;
          fill: #ffffff;
          text-anchor: middle;
          letter-spacing: 1px;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
      </style>
      <text x="230" y="62" class="badge">PROUD SON OF TAKETE-IDE</text>
      <text x="230" y="104" class="name">DARAMOLA JOSEPH OMOYELE</text>
    </svg>
  `);

  const plaqueRendered = await sharp(plaquePath)
    .composite([{ input: plaqueSvg, blend: 'over' }])
    .png()
    .toBuffer();

  // Composite the final poster (682 x 1024)
  // Layer 1: Clean Takete-Ide mountain landscape & sky
  // Layer 2: Daramola Joseph Omoyele transparent cutout against the mountains
  // Layer 3: Header bar
  // Layer 4: Right monument & message (clean ivory backdrop with ZERO Ankara dress)
  // Layer 5: Clean bottom emerald wave with gold ribbons and cultural artifacts
  // Layer 6: Dynamic plaque
  const finalPoster = await sharp(bgPath)
    .composite([
      { input: portraitCutout, left: 15, top: 220, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 370, top: 190, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 730, blend: 'over' },
      { input: plaqueRendered, left: 10, top: 730, blend: 'over' }
    ])
    .png()
    .toBuffer();

  // Save 682x1024 and 1200x1600 export
  await sharp(finalPoster).toFile(path.join(outDir, 'sample-poster-daramola.png'));
  await sharp(finalPoster).resize(1200, 1600, { fit: 'cover' }).toFile(path.join(outDir, 'sample-poster-daramola-1200x1600.png'));
  await sharp(finalPoster).resize(1200, 1600, { fit: 'cover' }).toFile(path.join(outDir, 'sample-poster-personal-celebration-1200x1600.png'));
  await sharp(finalPoster).toFile(path.join(outDir, 'sample-poster-personal-celebration.png'));

  // Copy to brain artifact directory for user review
  fs.copyFileSync(path.join(outDir, 'sample-poster-daramola-1200x1600.png'), 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/sample-poster-daramola-1200x1600.png');
  fs.copyFileSync(path.join(outDir, 'sample-poster-daramola.png'), 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/sample-poster-daramola.png');

  console.log('Final composite with clean cutout generated successfully!');
}

testFullRendererWithCutout().catch(console.error);
