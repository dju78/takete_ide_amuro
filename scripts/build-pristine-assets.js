const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildPristineTemplateAssets() {
  const ref2Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707650275.jpg';
  const ref3Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707677623.jpg';
  const outDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'templates');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Top Header Bar (x: 0 to 682, y: 0 to 195)
  // Transparent everywhere below y: 195
  await sharp(ref2Path)
    .extract({ left: 0, top: 0, width: 682, height: 195 })
    .png()
    .toFile(path.join(outDir, 'header-bar.png'));

  // 2. Right Monument & Message (x: 375 to 682, y: 190 to 760)
  // Strictly bounded to right side so it never touches the left photo area (x: 0 to 375)
  await sharp(ref2Path)
    .extract({ left: 375, top: 190, width: 307, height: 570 })
    .png()
    .toFile(path.join(outDir, 'right-monument-and-message.png'));

  // 3. Cultural Artefacts Cluster on bottom right (x: 470 to 682, y: 740 to 1024)
  await sharp(ref2Path)
    .extract({ left: 470, top: 740, width: 212, height: 284 })
    .png()
    .toFile(path.join(outDir, 'cultural-artefacts.png'));

  // 4. Create a completely clean Bottom Wave across width 682, height 300 (y: 724 to 1024)
  // We extract the green wave background from ref2/ref3, and cleanly paint over the entire left/center
  // with the deep emerald green and gold ribbon gradient:
  const waveBase = await sharp(ref2Path)
    .extract({ left: 0, top: 724, width: 682, height: 300 })
    .png()
    .toBuffer();

  // Create an SVG overlay to fill the plaque area (x: 0 to 480) with deep emerald green wave gradient
  const cleanWaveSvg = Buffer.from(`
    <svg width="682" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#093f1d" />
          <stop offset="30%" stop-color="#073016" />
          <stop offset="70%" stop-color="#04200e" />
          <stop offset="100%" stop-color="#021408" />
        </linearGradient>
        <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#d4a72c" />
          <stop offset="30%" stop-color="#fdf3b0" />
          <stop offset="60%" stop-color="#e2b43b" />
          <stop offset="100%" stop-color="#8a6308" />
        </linearGradient>
      </defs>
      <!-- Base wave body covering all old text -->
      <path d="M 0,20 Q 240,60 480,20 L 480,300 L 0,300 Z" fill="url(#waveGrad)" />
      <!-- Gold ribbon accent curve -->
      <path d="M 0,55 Q 240,95 480,55" fill="none" stroke="url(#goldRibbon)" stroke-width="4" />
      <path d="M 0,65 Q 240,105 480,65" fill="none" stroke="url(#goldRibbon)" stroke-width="1.5" opacity="0.7" />
    </svg>
  `);

  await sharp(waveBase)
    .composite([
      { input: cleanWaveSvg, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'bottom-wave-clean.png'));

  // 5. Create a Pristine Blank Standard Plaque (width: 460, height: 185)
  // Perfectly smooth emerald green radial gradient with the double gold border and bottom gold flourish:
  const plaqueBase = await sharp(ref2Path)
    .extract({ left: 10, top: 730, width: 460, height: 185 })
    .png()
    .toBuffer();

  const cleanPlaqueSvg = Buffer.from(`
    <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pGradClean" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#0c4e27" />
          <stop offset="50%" stop-color="#08381c" />
          <stop offset="85%" stop-color="#042210" />
          <stop offset="100%" stop-color="#021509" />
        </radialGradient>
      </defs>
      <!-- Smooth inner plaque fill that covers all old text while leaving gold border intact -->
      <path d="M 38,20 Q 230,2 422,20 L 422,148 Q 230,170 38,148 Z" fill="url(#pGradClean)" />
    </svg>
  `);

  await sharp(plaqueBase)
    .composite([
      { input: cleanPlaqueSvg, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'clean-plaque-standard.png'));

  // 6. Create a Pristine Blank Leadership Plaque (width: 460, height: 200)
  const plaqueLeadBase = await sharp(ref3Path)
    .extract({ left: 10, top: 715, width: 460, height: 200 })
    .png()
    .toBuffer();

  const cleanPlaqueLeadSvg = Buffer.from(`
    <svg width="460" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pLeadGradClean" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#0c4e27" />
          <stop offset="50%" stop-color="#08381c" />
          <stop offset="85%" stop-color="#042210" />
          <stop offset="100%" stop-color="#021509" />
        </radialGradient>
      </defs>
      <!-- Smooth inner plaque fill covering all old text -->
      <path d="M 36,18 Q 230,-2 424,18 L 424,168 Q 230,188 36,168 Z" fill="url(#pLeadGradClean)" />
    </svg>
  `);

  await sharp(plaqueLeadBase)
    .composite([
      { input: cleanPlaqueLeadSvg, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'clean-plaque-leadership.png'));

  console.log('Pristine template assets created successfully!');
}

buildPristineTemplateAssets().catch(console.error);
