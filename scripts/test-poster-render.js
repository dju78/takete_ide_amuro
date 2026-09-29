const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testCompositePosters() {
  const outDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio-preview');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const templatesDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'templates');
  const samplesDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'samples');

  // Load base components
  const bgPath = path.join(templatesDir, 'poster-clean-background.png');
  const headerPath = path.join(templatesDir, 'header-bar.png');
  const rightPanelPath = path.join(templatesDir, 'right-monument-and-message.png');
  const bottomWavePath = path.join(templatesDir, 'bottom-wave-full.png');
  const plaqueStdPath = path.join(templatesDir, 'clean-plaque-standard.png');
  const plaqueLeadPath = path.join(templatesDir, 'clean-plaque-leadership.png');
  const scriptMowaPath = path.join(templatesDir, 'script-mowa-gbogbo.png');

  // Let's test Sample 2: Mrs Omolara Eseyin (682x1024)
  const photo2Path = path.join(samplesDir, 'sample-mrs-omolara-eseyin.jpg');
  const photo2 = await sharp(photo2Path).resize(420, 620, { fit: 'cover' }).toBuffer();

  // Draw name on standard plaque using SVG text overlay:
  const name2Svg = Buffer.from(`
    <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
      <style>
        .name-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 900;
          fill: #ffffff;
          text-anchor: middle;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
      </style>
      <text x="230" y="70" class="name-text" font-size="34" letter-spacing="1">MRS OMOLARA</text>
      <text x="230" y="115" class="name-text" font-size="44" letter-spacing="2">ESEYIN</text>
    </svg>
  `);

  const plaque2Rendered = await sharp(plaqueStdPath)
    .composite([{ input: name2Svg, blend: 'over' }])
    .png()
    .toBuffer();

  const poster2 = await sharp(bgPath)
    .composite([
      { input: photo2, left: 0, top: 160, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 355, top: 195, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 720, blend: 'over' },
      { input: plaque2Rendered, left: 10, top: 730, blend: 'over' },
      { input: scriptMowaPath, left: 475, top: 780, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'sample-poster-personal-celebration.png'));

  // Also create 1200x1600 export version:
  await sharp(path.join(outDir, 'sample-poster-personal-celebration.png'))
    .resize(1200, 1600, { fit: 'cover' })
    .png()
    .toFile(path.join(outDir, 'sample-poster-personal-celebration-1200x1600.png'));

  // Let's test Sample 1: Couple (Atteh Titilayo & Engr Funsho)
  const photo1Path = path.join(samplesDir, 'sample-couple-atteh-funsho.jpg');
  const photo1 = await sharp(photo1Path).resize(420, 600, { fit: 'cover' }).toBuffer();

  const name1Svg = Buffer.from(`
    <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
      <style>
        .name-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 900;
          fill: #ffffff;
          text-anchor: middle;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
      </style>
      <text x="230" y="70" class="name-text" font-size="30" letter-spacing="1">ATTEH TITILAYO &amp;</text>
      <text x="230" y="115" class="name-text" font-size="38" letter-spacing="1.5">ENGR FUNSHO</text>
    </svg>
  `);

  const plaque1Rendered = await sharp(plaqueStdPath)
    .composite([{ input: name1Svg, blend: 'over' }])
    .png()
    .toBuffer();

  await sharp(bgPath)
    .composite([
      { input: photo1, left: 0, top: 180, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 355, top: 195, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 720, blend: 'over' },
      { input: plaque1Rendered, left: 10, top: 730, blend: 'over' },
      { input: scriptMowaPath, left: 475, top: 780, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'sample-poster-family-felicitation.png'));

  // Let's test Sample 3: Elder Elewa Dare (Leadership)
  const photo3Path = path.join(samplesDir, 'sample-elder-elewa-dare.jpg');
  const photo3 = await sharp(photo3Path).resize(420, 600, { fit: 'cover' }).toBuffer();

  const name3Svg = Buffer.from(`
    <svg width="460" height="200" xmlns="http://www.w3.org/2000/svg">
      <style>
        .name-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 900;
          fill: #ffffff;
          text-anchor: middle;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
        .title-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 900;
          fill: #ffffff;
          text-anchor: middle;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
        .sub-gold {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 800;
          fill: #f5cf47;
          text-anchor: middle;
          letter-spacing: 1.5px;
        }
      </style>
      <text x="230" y="48" class="title-text" font-size="24">ELDER</text>
      <text x="230" y="85" class="name-text" font-size="38" letter-spacing="1">ELEWA DARE</text>
      <text x="230" y="118" class="sub-gold" font-size="19">PAST CHAIRMAN</text>
      <text x="230" y="142" class="sub-gold" font-size="18">TIPU ILORIN BRANCH</text>
    </svg>
  `);

  const plaque3Rendered = await sharp(plaqueLeadPath)
    .composite([{ input: name3Svg, blend: 'over' }])
    .png()
    .toBuffer();

  await sharp(bgPath)
    .composite([
      { input: photo3, left: 0, top: 175, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 355, top: 195, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 720, blend: 'over' },
      { input: plaque3Rendered, left: 10, top: 715, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'sample-poster-leadership-celebration.png'));

  console.log('Sample posters generated successfully in public/images/celebration-studio-preview/');
}

testCompositePosters().catch(console.error);
