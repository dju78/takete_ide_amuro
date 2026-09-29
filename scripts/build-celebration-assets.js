const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildTemplateAssets() {
  const ref1Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707627239.jpg';
  const ref2Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707650275.jpg';
  const ref3Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707677623.jpg';
  const outDir = path.join(process.cwd(), 'public', 'images', 'celebration-studio', 'templates');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Extract Top Header Bar (0, 0, 682, 195)
  await sharp(ref2Path)
    .extract({ left: 0, top: 0, width: 682, height: 195 })
    .png()
    .toFile(path.join(outDir, 'header-bar.png'));

  // 2. Extract Right Column (355, 195, 327, 565)
  await sharp(ref2Path)
    .extract({ left: 355, top: 195, width: 327, height: 565 })
    .png()
    .toFile(path.join(outDir, 'right-monument-and-message.png'));

  // 3. Extract Bottom Wave & Cultural Artifacts (0, 720, 682, 304)
  // Let's create a clean bottom wave without the old names, or clean plaques:
  await sharp(ref2Path)
    .extract({ left: 0, top: 720, width: 682, height: 304 })
    .png()
    .toFile(path.join(outDir, 'bottom-wave-full.png'));

  // 4. Extract Cultural artifacts cluster (drum, horn, staff, leaves)
  await sharp(ref2Path)
    .extract({ left: 470, top: 750, width: 212, height: 274 })
    .png()
    .toFile(path.join(outDir, 'cultural-artefacts.png'));

  // 5. Build clean master background:
  // Mountain landscape from obasoro-hill / places, blended with sky and warm right wash:
  const mountainSrc = path.join(process.cwd(), 'public', 'images', 'takete-ide', 'places', 'obasoro-hill.jpg');
  
  // We can construct a pristine background image (1200 x 1600 or 1080 x 1620)
  console.log('Building base assets complete.');
}

buildTemplateAssets().catch(console.error);
