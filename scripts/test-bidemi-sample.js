const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testBidemiPoster() {
  const templatesDir = path.join(__dirname, '..', 'public', 'images', 'celebration-studio', 'templates');
  const bgPath = path.join(templatesDir, 'poster-clean-background.png');
  const headerPath = path.join(templatesDir, 'header-bar.png');
  const rightPanelPath = path.join(templatesDir, 'right-monument-and-message.png');
  const bottomWavePath = path.join(templatesDir, 'bottom-wave-clean.png');
  const plaqueStdPath = path.join(templatesDir, 'clean-plaque-standard.png');
  const scriptMowaPath = path.join(templatesDir, 'script-mowa-gbogbo.png');

  // Portrait from test_bidemi_portrait.png
  const bidemiPortrait = await sharp('test_bidemi_portrait.png')
    .resize(390, 565, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  const plaqueSvg = Buffer.from(`
    <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
      <style>
        .badge {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 800;
          font-size: 13.5px;
          fill: #f5cf47;
          text-anchor: middle;
          letter-spacing: 1px;
          filter: drop-shadow(0px 1px 3px rgba(0, 30, 10, 0.95));
        }
        .name {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          font-size: 28px;
          fill: #ffffff;
          text-anchor: middle;
          letter-spacing: 1px;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
      </style>
      <text x="230" y="58" class="badge">HAPPY TO BE MARRIED TO TAKETE-IDE</text>
      <text x="230" y="102" class="name">BIDEMI OMOYELE</text>
    </svg>
  `);

  const bidemiPlaque = await sharp(plaqueStdPath)
    .composite([{ input: plaqueSvg, blend: 'over' }])
    .png()
    .toBuffer();

  const fullPoster = await sharp(bgPath)
    .composite([
      { input: bidemiPortrait, left: 0, top: 175, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 375, top: 190, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 724, blend: 'over' },
      { input: bidemiPlaque, left: 10, top: 730, blend: 'over' },
      { input: scriptMowaPath, left: 475, top: 780, blend: 'over' }
    ])
    .png()
    .toBuffer();

  const outPath = path.join(process.cwd(), 'public', 'images', 'celebration-studio-preview', 'sample-poster-bidemi-omoyele.png');
  await sharp(fullPoster).toFile(outPath);
  await sharp(fullPoster).resize(1080, 1350, { fit: 'cover' }).toFile(path.join(process.cwd(), 'public', 'images', 'celebration-studio-preview', 'sample-poster-bidemi-omoyele-portrait.png'));
  console.log('Generated Bidemi Omoyele sample poster at:', outPath);
}

testBidemiPoster().catch(console.error);
