const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testDaramolaPoster() {
  const templatesDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'templates');
  const samplesDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'samples');
  const outDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio-preview');

  const bgPath = path.join(templatesDir, 'poster-clean-background.png');
  const headerPath = path.join(templatesDir, 'header-bar.png');
  const rightPanelPath = path.join(templatesDir, 'right-monument-and-message.png');
  const bottomWavePath = path.join(templatesDir, 'bottom-wave-clean.png');
  const plaquePath = path.join(templatesDir, 'clean-plaque-standard.png');
  const scriptMowaPath = path.join(templatesDir, 'script-mowa-gbogbo.png');

  // Load Daramola's portrait
  const portraitPath = path.join(samplesDir, 'sample-daramola-joseph-omoyele.jpg');
  const portrait = await sharp(portraitPath)
    .resize(390, 580, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  // Create plaque text for DARAMOLA JOSEPH OMOYELE
  // Optional badge: "PROUD SON OF TAKETE-IDE"
  // Name: "DARAMOLA JOSEPH OMOYELE"
  // NO prefilled PAST CHAIRMAN or TIPU ILORIN BRANCH!
  const plaqueSvg = Buffer.from(`
    <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
      <style>
        .badge {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 800;
          font-size: 16px;
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
      <text x="230" y="65" class="badge">PROUD SON OF TAKETE-IDE</text>
      <text x="230" y="105" class="name">DARAMOLA JOSEPH OMOYELE</text>
    </svg>
  `);

  const plaqueRendered = await sharp(plaquePath)
    .composite([{ input: plaqueSvg, blend: 'over' }])
    .png()
    .toBuffer();

  // Composite the full poster (682 x 1024)
  const poster = await sharp(bgPath)
    .composite([
      { input: portrait, left: 0, top: 165, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 375, top: 190, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 724, blend: 'over' },
      { input: plaqueRendered, left: 10, top: 730, blend: 'over' },
      { input: scriptMowaPath, left: 475, top: 780, blend: 'over' }
    ])
    .png()
    .toBuffer();

  // Save 682x1024 and 1200x1600 export
  await sharp(poster).toFile(path.join(outDir, 'sample-poster-daramola.png'));
  await sharp(poster).resize(1200, 1600, { fit: 'cover' }).toFile(path.join(outDir, 'sample-poster-daramola-1200x1600.png'));

  console.log('Generated test Daramola poster successfully!');
}

testDaramolaPoster().catch(console.error);
