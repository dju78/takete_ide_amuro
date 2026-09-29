const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function rebuildAllPristineAssets() {
  const ref2Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707650275.jpg';
  const ref3Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707677623.jpg';
  const outDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'templates');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Top Header Bar (height 142px, with clean sky gradient at bottom)
  const rawHeader = await sharp(ref2Path)
    .extract({ left: 0, top: 0, width: 682, height: 142 })
    .png()
    .toBuffer();

  const cleanHeaderBottomSvg = Buffer.from(`
    <svg width="682" height="155" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="70%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="130" width="682" height="25" fill="url(#skyGrad)" />
    </svg>
  `);

  await sharp({
    create: {
      width: 682,
      height: 155,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  })
    .composite([
      { input: rawHeader, top: 0, left: 0 }
    ])
    .png()
    .toFile(path.join(outDir, 'header-bar.png'));

  // 2. Right Monument & Message Panel from ref3 (clean ivory backdrop with ZERO Ankara dress, ZERO suit, and ZERO box artifacts)
  const rawRight = await sharp(ref3Path)
    .extract({ left: 375, top: 190, width: 307, height: 570 })
    .png()
    .toBuffer();

  const cleanRightMaskSvg = Buffer.from(`
    <svg width="307" height="570" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ivoryFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="15%" stop-color="#fffef7" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <!-- Overwrite any suit/box/collar remnant on the extreme left edge of the right panel from y=250 to 570 -->
      <rect x="0" y="250" width="48" height="320" fill="url(#ivoryFade)" />
    </svg>
  `);

  await sharp(rawRight)
    .composite([
      { input: cleanRightMaskSvg, top: 0, left: 0, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'right-monument-and-message.png'));

  // 3. Side Script "Mo wa gbogbo Ile ooo!"
  await sharp(ref2Path)
    .extract({ left: 470, top: 780, width: 160, height: 75 })
    .png()
    .toFile(path.join(outDir, 'script-mowa-gbogbo.png'));

  // 4. Cultural Artefacts Cluster
  await sharp(ref2Path)
    .extract({ left: 470, top: 740, width: 212, height: 284 })
    .png()
    .toFile(path.join(outDir, 'cultural-artefacts.png'));

  // 5. Clean Background Backdrop (682 x 1024)
  // Use pure authentic Obasoro Hill scenery of Takete-Ide - 100% free of any reference persons!
  const obasoroPath = path.join(process.cwd(), 'public', 'images', 'takete-ide', 'places', 'obasoro-hill.jpg');
  const sceneryBuffer = await sharp(obasoroPath)
    .resize(682, 480, { fit: 'cover', position: 'top' })
    .toBuffer();

  const cleanBackdropSvg = Buffer.from(`
    <svg width="682" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sceneryFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="35%" stop-color="#ffffff" stop-opacity="0.2" />
          <stop offset="55%" stop-color="#f8faf5" stop-opacity="0.85" />
          <stop offset="75%" stop-color="#eef5eb" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#e5f0e1" stop-opacity="1" />
        </linearGradient>
        <radialGradient id="rightGlow" cx="80%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="682" height="1024" fill="#f6f9f3" />
      <rect x="0" y="0" width="682" height="1024" fill="url(#sceneryFade)" />
      <rect x="0" y="0" width="682" height="1024" fill="url(#rightGlow)" />
    </svg>
  `);

  await sharp({
    create: {
      width: 682,
      height: 1024,
      channels: 4,
      background: { r: 246, g: 249, b: 243, alpha: 1 }
    }
  })
    .composite([
      { input: sceneryBuffer, top: 0, left: 0 },
      { input: cleanBackdropSvg, top: 0, left: 0, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'poster-clean-background.png'));

  // 6. Clean Bottom Wave (width: 682, height: 294)
  // Reconstruct smooth organic wave curves with golden metallic ribbons and cultural artifacts
  const artifacts = await sharp(path.join(outDir, 'cultural-artefacts.png')).toBuffer();
  const sideScript = await sharp(path.join(outDir, 'script-mowa-gbogbo.png')).toBuffer();

  const waveVectorSvg = Buffer.from(`
    <svg width="682" height="294" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="emeraldWave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0e4b25" />
          <stop offset="25%" stop-color="#0a3d1d" />
          <stop offset="60%" stop-color="#062913" />
          <stop offset="100%" stop-color="#03160a" />
        </linearGradient>
        <linearGradient id="goldShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#d4a72c" />
          <stop offset="25%" stop-color="#fff4b8" />
          <stop offset="50%" stop-color="#e5b83e" />
          <stop offset="75%" stop-color="#fff4b8" />
          <stop offset="100%" stop-color="#9a710b" />
        </linearGradient>
      </defs>

      <!-- Organic curved emerald wave -->
      <path d="M 0,22 C 160,55 360,55 520,18 C 580,4 630,0 682,8 L 682,294 L 0,294 Z" fill="url(#emeraldWave)" />
      
      <!-- Upper gold metallic trim line -->
      <path d="M 0,22 C 160,55 360,55 520,18 C 580,4 630,0 682,8" fill="none" stroke="url(#goldShine)" stroke-width="4.5" />
      
      <!-- Inner subtle gold ribbon accent -->
      <path d="M 0,34 C 160,67 360,67 520,30 C 580,16 630,12 682,20" fill="none" stroke="url(#goldShine)" stroke-width="1.8" opacity="0.85" />
      
      <!-- Lower gold sweeping flourish ribbon -->
      <path d="M 0,110 C 180,140 380,135 530,95 C 600,75 640,65 682,75" fill="none" stroke="url(#goldShine)" stroke-width="3" opacity="0.7" />
    </svg>
  `);

  await sharp(waveVectorSvg)
    .composite([
      { input: sideScript, left: 470, top: 50, blend: 'over' },
      { input: artifacts, left: 470, top: 10, blend: 'over' }
    ])
    .png()
    .toFile(path.join(outDir, 'bottom-wave-clean.png'));

  // 7. Clean Pristine Standard Plaque (width: 460, height: 185)
  // Double gold border, scalloped corners, bottom gold fleur filigree, smooth emerald interior
  const plaqueVectorSvg = Buffer.from(`
    <svg width="460" height="185" viewBox="0 0 460 185" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="plaqueInner" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#0f5429" />
          <stop offset="45%" stop-color="#09391a" />
          <stop offset="80%" stop-color="#052410" />
          <stop offset="100%" stop-color="#021409" />
        </radialGradient>
        <linearGradient id="plaqueGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e8bf48" />
          <stop offset="25%" stop-color="#fff6c2" />
          <stop offset="50%" stop-color="#d4a72c" />
          <stop offset="75%" stop-color="#fff6c2" />
          <stop offset="100%" stop-color="#9a710b" />
        </linearGradient>
        <filter id="plaqueShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6" />
        </filter>
      </defs>

      <!-- Outer drop shadow and base -->
      <g filter="url(#plaqueShadow)">
        <!-- Outer scalloped arched plaque path -->
        <path d="M 35,28 Q 230,12 425,28 C 438,32 445,42 442,56 L 435,130 C 432,144 420,152 405,154 Q 230,172 55,154 C 40,152 28,144 25,130 L 18,56 C 15,42 22,32 35,28 Z" fill="url(#plaqueInner)" stroke="url(#plaqueGold)" stroke-width="5" />
        
        <!-- Inner gold border -->
        <path d="M 42,35 Q 230,20 418,35 C 428,38 434,46 431,58 L 425,124 C 422,135 412,142 400,144 Q 230,161 60,144 C 48,142 38,135 35,124 L 29,58 C 26,46 32,38 42,35 Z" fill="none" stroke="url(#plaqueGold)" stroke-width="2" opacity="0.85" />
      </g>

      <!-- Bottom center gold flourish emblem -->
      <g transform="translate(230, 162)">
        <path d="M -18,-4 Q 0,-12 18,-4 Q 0,10 -18,-4 Z" fill="url(#plaqueGold)" />
        <circle cx="0" cy="-2" r="3.5" fill="#fff6c2" />
        <path d="M -30,-6 Q -15,-2 -5,-4 Q -15,-10 -30,-6 Z" fill="url(#plaqueGold)" />
        <path d="M 30,-6 Q 15,-2 5,-4 Q 15,-10 30,-6 Z" fill="url(#plaqueGold)" />
      </g>
    </svg>
  `);

  await sharp(plaqueVectorSvg)
    .png()
    .toFile(path.join(outDir, 'clean-plaque-standard.png'));

  // 8. Clean Pristine Leadership Plaque (taller, width: 460, height: 200)
  const plaqueLeadVectorSvg = Buffer.from(`
    <svg width="460" height="200" viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="plaqueLeadInner" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#0f5429" />
          <stop offset="45%" stop-color="#09391a" />
          <stop offset="80%" stop-color="#052410" />
          <stop offset="100%" stop-color="#021409" />
        </radialGradient>
        <linearGradient id="plaqueLeadGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e8bf48" />
          <stop offset="25%" stop-color="#fff6c2" />
          <stop offset="50%" stop-color="#d4a72c" />
          <stop offset="75%" stop-color="#fff6c2" />
          <stop offset="100%" stop-color="#9a710b" />
        </linearGradient>
        <filter id="plaqueLeadShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6" />
        </filter>
      </defs>

      <g filter="url(#plaqueLeadShadow)">
        <path d="M 35,26 Q 230,8 425,26 C 438,30 445,40 442,54 L 434,142 C 431,156 419,165 404,167 Q 230,186 56,167 C 41,165 29,156 26,142 L 18,54 C 15,40 22,30 35,26 Z" fill="url(#plaqueLeadInner)" stroke="url(#plaqueLeadGold)" stroke-width="5" />
        <path d="M 42,33 Q 230,16 418,33 C 428,36 434,44 431,56 L 424,136 C 421,147 411,155 399,157 Q 230,175 61,157 C 49,155 39,147 36,136 L 29,56 C 26,44 32,36 42,33 Z" fill="none" stroke="url(#plaqueLeadGold)" stroke-width="2" opacity="0.85" />
      </g>

      <g transform="translate(230, 176)">
        <path d="M -18,-4 Q 0,-12 18,-4 Q 0,10 -18,-4 Z" fill="url(#plaqueLeadGold)" />
        <circle cx="0" cy="-2" r="3.5" fill="#fff6c2" />
        <path d="M -30,-6 Q -15,-2 -5,-4 Q -15,-10 -30,-6 Z" fill="url(#plaqueLeadGold)" />
        <path d="M 30,-6 Q 15,-2 5,-4 Q 15,-10 30,-6 Z" fill="url(#plaqueLeadGold)" />
      </g>
    </svg>
  `);

  await sharp(plaqueLeadVectorSvg)
    .png()
    .toFile(path.join(outDir, 'clean-plaque-leadership.png'));

  console.log('All rebuilt pristine template assets generated successfully!');
}

rebuildAllPristineAssets().catch(console.error);
