const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createCleanPlaquesAndOverlays() {
  const ref1Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707627239.jpg';
  const ref2Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707650275.jpg';
  const ref3Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707677623.jpg';
  const outDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'templates');

  // Let's create high-res clean background:
  // We extract the top-left sky & mountain from ref3 (where background is unobscured at the top)
  // and blend it across the portrait area:
  const bgWidth = 682;
  const bgHeight = 1024;

  // Let's create an alpha-transparent template frame overlay:
  // The frame overlay has:
  // 1. Top header (y: 0 to 190)
  // 2. Right panel (x: 355 to 682, y: 190 to 740)
  // 3. Bottom wave and cultural artefacts (y: 730 to 1024, except the nameplate area if rendered separately, or including the blank plaque!)

  // Let's create a clean blank standard plaque (for individual & couple/family)
  // In ref2, the plaque is located at left: 5, top: 730, width: 465, height: 185
  // We can fill the text area with deep emerald green (#0a4422) gradient matching the plaque background:
  
  const plaqueStandardSvg = `
    <svg width="465" height="185" viewBox="0 0 465 185" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="plaqueGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#0f522a" />
          <stop offset="60%" stop-color="#09381c" />
          <stop offset="100%" stop-color="#041f0f" />
        </radialGradient>
      </defs>
      <!-- We can composite this over the inner text region of the plaque to make it clean -->
      <rect x="25" y="25" width="415" height="135" rx="15" fill="url(#plaqueGrad)" />
    </svg>
  `;

  // Let's extract the clean base plaque from ref2:
  const plaque2Extract = await sharp(ref2Path)
    .extract({ left: 10, top: 730, width: 460, height: 185 })
    .png()
    .toBuffer();

  // Composite the inner fill to remove the old text cleanly while preserving the double gold border and bottom gold flourish:
  await sharp(plaque2Extract)
    .composite([
      {
        input: Buffer.from(`
          <svg width="460" height="185" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="pGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#0a4623" />
                <stop offset="70%" stop-color="#06351a" />
                <stop offset="100%" stop-color="#032010" />
              </radialGradient>
            </defs>
            <path d="M 45,28 Q 230,12 415,28 L 415,145 Q 230,165 45,145 Z" fill="url(#pGrad)" />
          </svg>
        `),
        blend: 'over'
      }
    ])
    .png()
    .toFile(path.join(outDir, 'clean-plaque-standard.png'));

  // Let's extract the leadership plaque from ref3 (Elder Elewa Dare):
  const plaque3Extract = await sharp(ref3Path)
    .extract({ left: 10, top: 715, width: 460, height: 200 })
    .png()
    .toBuffer();

  await sharp(plaque3Extract)
    .composite([
      {
        input: Buffer.from(`
          <svg width="460" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="pGrad3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#0a4623" />
                <stop offset="70%" stop-color="#06351a" />
                <stop offset="100%" stop-color="#032010" />
              </radialGradient>
            </defs>
            <path d="M 40,25 Q 230,10 420,25 L 420,165 Q 230,185 40,165 Z" fill="url(#pGrad3)" />
          </svg>
        `),
        blend: 'over'
      }
    ])
    .png()
    .toFile(path.join(outDir, 'clean-plaque-leadership.png'));

  // Extract the side calligraphy "Mo wa gbogbo Ile ooo!" from ref2
  await sharp(ref2Path)
    .extract({ left: 470, top: 780, width: 160, height: 75 })
    .png()
    .toFile(path.join(outDir, 'script-mowa-gbogbo.png'));

  // Let's create a clean background base for the poster (sky + mountain hills):
  // We can construct it from ref3 upper region (sky + mountain hills) and extend/blend it across
  const landscapeSample = await sharp(ref3Path)
    .extract({ left: 0, top: 0, width: 682, height: 450 })
    .toBuffer();

  await sharp({
    create: {
      width: 682,
      height: 1024,
      channels: 4,
      background: { r: 245, g: 248, b: 242, alpha: 1 }
    }
  })
    .composite([
      {
        input: landscapeSample,
        top: 0,
        left: 0
      },
      {
        input: Buffer.from(`
          <svg width="682" height="1024" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#a8d4f0" />
                <stop offset="25%" stop-color="#d9ecf8" />
                <stop offset="45%" stop-color="#fdfefe" />
                <stop offset="75%" stop-color="#f6f9f4" />
                <stop offset="100%" stop-color="#edf5eb" />
              </linearGradient>
              <radialGradient id="sunGlow" cx="80%" cy="35%" r="60%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
                <stop offset="50%" stop-color="#fff9e6" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="682" height="1024" fill="url(#skyGrad)" opacity="0.5" />
            <rect x="0" y="0" width="682" height="1024" fill="url(#sunGlow)" />
          </svg>
        `),
        top: 0,
        left: 0,
        blend: 'over'
      }
    ])
    .png()
    .toFile(path.join(outDir, 'poster-clean-background.png'));

  console.log('Clean plaques and overlays created successfully!');
}

createCleanPlaquesAndOverlays().catch(console.error);
