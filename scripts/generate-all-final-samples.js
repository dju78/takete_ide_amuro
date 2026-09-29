const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateFinalSamples() {
  const templatesDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'templates');
  const samplesDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'samples');
  const outDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio-preview');

  const bgPath = path.join(templatesDir, 'poster-clean-background.png');
  const headerPath = path.join(templatesDir, 'header-bar.png');
  const rightPanelPath = path.join(templatesDir, 'right-monument-and-message.png');
  const bottomWavePath = path.join(templatesDir, 'bottom-wave-clean.png');
  const plaqueStdPath = path.join(templatesDir, 'clean-plaque-standard.png');
  const plaqueLeadPath = path.join(templatesDir, 'clean-plaque-leadership.png');
  const scriptMowaPath = path.join(templatesDir, 'script-mowa-gbogbo.png');

  // 1. Mrs Omolara Eseyin Sample
  const omolaraPortrait = await sharp(path.join(samplesDir, 'sample-mrs-omolara-eseyin.jpg'))
    .resize(390, 565, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  const omolaraPlaqueSvg = Buffer.from(`
    <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
      <style>
        .name-l1 {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          font-size: 32px;
          fill: #ffffff;
          text-anchor: middle;
          letter-spacing: 1px;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
        .name-l2 {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          font-size: 40px;
          fill: #ffffff;
          text-anchor: middle;
          letter-spacing: 2px;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
      </style>
      <text x="230" y="70" class="name-l1">MRS OMOLARA</text>
      <text x="230" y="116" class="name-l2">ESEYIN</text>
    </svg>
  `);

  const omolaraPlaque = await sharp(plaqueStdPath)
    .composite([{ input: omolaraPlaqueSvg, blend: 'over' }])
    .png()
    .toBuffer();

  const omolaraPoster = await sharp(bgPath)
    .composite([
      { input: omolaraPortrait, left: 0, top: 175, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 375, top: 190, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 724, blend: 'over' },
      { input: omolaraPlaque, left: 10, top: 730, blend: 'over' },
      { input: scriptMowaPath, left: 475, top: 780, blend: 'over' }
    ])
    .png()
    .toBuffer();

  await sharp(omolaraPoster).toFile(path.join(outDir, 'sample-poster-mrs-omolara.png'));
  await sharp(omolaraPoster).toFile(path.join(outDir, 'sample-poster-personal-celebration.png'));
  await sharp(omolaraPoster).resize(1200, 1600, { fit: 'cover' }).toFile(path.join(outDir, 'sample-poster-personal-celebration-1200x1600.png'));

  // 2. Couple Sample (Atteh Titilayo & Engr Funsho)
  const couplePortrait = await sharp(path.join(samplesDir, 'sample-couple-atteh-funsho.jpg'))
    .resize(390, 580, { fit: 'cover' })
    .png()
    .toBuffer();

  const couplePlaqueSvg = Buffer.from(`
    <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
      <style>
        .name-l1 {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          font-size: 28px;
          fill: #ffffff;
          text-anchor: middle;
          letter-spacing: 1px;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
        .name-l2 {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          font-size: 36px;
          fill: #ffffff;
          text-anchor: middle;
          letter-spacing: 1.5px;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
      </style>
      <text x="230" y="70" class="name-l1">ATTEH TITILAYO &amp;</text>
      <text x="230" y="116" class="name-l2">ENGR FUNSHO</text>
    </svg>
  `);

  const couplePlaque = await sharp(plaqueStdPath)
    .composite([{ input: couplePlaqueSvg, blend: 'over' }])
    .png()
    .toBuffer();

  const couplePoster = await sharp(bgPath)
    .composite([
      { input: couplePortrait, left: 0, top: 165, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 375, top: 190, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 724, blend: 'over' },
      { input: couplePlaque, left: 10, top: 730, blend: 'over' },
      { input: scriptMowaPath, left: 475, top: 780, blend: 'over' }
    ])
    .png()
    .toBuffer();

  await sharp(couplePoster).toFile(path.join(outDir, 'sample-poster-family-felicitation.png'));

  // 4. Elder Elewa Dare Sample (Leadership with explicit role)
  const elderPortrait = await sharp(path.join(samplesDir, 'sample-elder-elewa-dare.jpg'))
    .resize(390, 580, { fit: 'cover' })
    .png()
    .toBuffer();

  const elderPlaqueSvg = Buffer.from(`
    <svg width="460" height="200" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          font-size: 22px;
          fill: #ffffff;
          text-anchor: middle;
          letter-spacing: 1px;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
        .name {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 900;
          font-size: 34px;
          fill: #ffffff;
          text-anchor: middle;
          letter-spacing: 1px;
          filter: drop-shadow(0px 2px 4px rgba(0, 30, 10, 0.95));
        }
        .sub-gold {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 800;
          font-size: 17px;
          fill: #f5cf47;
          text-anchor: middle;
          letter-spacing: 1.5px;
        }
      </style>
      <text x="230" y="48" class="title">ELDER</text>
      <text x="230" y="85" class="name">ELEWA DARE</text>
      <text x="230" y="118" class="sub-gold">PAST CHAIRMAN</text>
      <text x="230" y="142" class="sub-gold">TIPU ILORIN BRANCH</text>
    </svg>
  `);

  const elderPlaque = await sharp(plaqueLeadPath)
    .composite([{ input: elderPlaqueSvg, blend: 'over' }])
    .png()
    .toBuffer();

  const elderPoster = await sharp(bgPath)
    .composite([
      { input: elderPortrait, left: 0, top: 165, blend: 'over' },
      { input: headerPath, left: 0, top: 0, blend: 'over' },
      { input: rightPanelPath, left: 375, top: 190, blend: 'over' },
      { input: bottomWavePath, left: 0, top: 724, blend: 'over' },
      { input: elderPlaque, left: 10, top: 715, blend: 'over' }
    ])
    .png()
    .toBuffer();

  await sharp(elderPoster).toFile(path.join(outDir, 'sample-poster-leadership-celebration.png'));

  // 5. Bidemi Omoyele Sample
  const bidemiPortrait = await sharp(path.join(process.cwd(), 'test_bidemi_portrait.png'))
    .resize(390, 565, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  const bidemiPlaqueSvg = Buffer.from(`
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
    .composite([{ input: bidemiPlaqueSvg, blend: 'over' }])
    .png()
    .toBuffer();

  const bidemiPoster = await sharp(bgPath)
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

  const bidemiPosterPath = path.join(outDir, 'sample-poster-bidemi-omoyele.png');
  await sharp(bidemiPoster).toFile(bidemiPosterPath);
  await sharp(bidemiPoster).resize(1080, 1350, { fit: 'cover' }).toFile(path.join(outDir, 'sample-poster-bidemi-omoyele-portrait.png'));
  await sharp(bidemiPoster).resize(1200, 1600, { fit: 'cover' }).toFile(path.join(outDir, 'sample-poster-bidemi-omoyele-1200x1600.png'));

  // Copy sample posters to current artifact directory
  const artifactDir = 'C:/Users/Inspiron/.gemini/antigravity/brain/54ce8c40-6ff3-4523-af7a-cbaa2019717c';
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(bidemiPosterPath, path.join(artifactDir, 'sample-poster-bidemi-omoyele.png'));
    fs.copyFileSync(path.join(outDir, 'sample-poster-bidemi-omoyele-portrait.png'), path.join(artifactDir, 'sample-poster-bidemi-omoyele-portrait.png'));
  }

  console.log('All final sample posters generated and copied to artifact directory!');
}

generateFinalSamples().catch(console.error);
