const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function main() {
  const templatesDir = path.join(__dirname, '..', 'public', 'images', 'celebration-studio', 'templates');
  const ref3Path = 'C:/Users/Inspiron/.gemini/antigravity/brain/11ce0e0f-16e5-4a79-af3f-858cd34088a6/.user_uploaded/media_1790707677623.jpg';
  const emblemPath = path.join(__dirname, '..', 'public', 'images', 'takete-ide', 'tipu-emblem.png');

  // 1. Create a pristine transparent circular emblem (530px radius = 1060px)
  const size = 1060;
  const cx = 626.5;
  const cy = 601;
  const radius = 530;

  const croppedEmblem = await sharp(emblemPath)
    .extract({
      left: Math.round(cx - radius),
      top: Math.round(cy - radius),
      width: size,
      height: size,
    })
    .png()
    .toBuffer();

  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#ffffff"/></svg>`
  );

  const cleanEmblem = await sharp(croppedEmblem)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(cleanEmblem).toFile(path.join(templatesDir, 'tipu-emblem-clean.png'));
  console.log('Created tipu-emblem-clean.png');

  // 2. Build full header bar (682 x 195)
  // From ref3 (where top header is pristine and circular emblem is complete)
  // Let's extract 0, 0, 682, 195
  const headerBuf = await sharp(ref3Path)
    .extract({ left: 0, top: 0, width: 682, height: 195 })
    .png()
    .toBuffer();

  // Let's create an alpha fade at the bottom (y: 180..195) so it seamlessly blends into the sky/clouds background
  const headerFadeSvg = Buffer.from(`
    <svg width="682" height="195" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="headerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="90%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.85" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="682" height="195" fill="url(#headerGrad)" />
    </svg>
  `);

  await sharp(headerBuf)
    .composite([
      { input: headerFadeSvg, top: 0, left: 0, blend: 'dest-in' }
    ])
    .png()
    .toFile(path.join(templatesDir, 'header-bar.png'));

  console.log('Created header-bar.png (682x195) with complete circular logo');
}

main().catch(console.error);
