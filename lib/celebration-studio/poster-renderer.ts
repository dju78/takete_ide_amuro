import {
  CampaignConfig,
  CelebrationTemplate,
  PersonalisationData,
  PhotoAdjustments,
  PosterFormat,
} from "@/types/celebration-studio";

export interface RenderPosterOptions {
  canvas: HTMLCanvasElement;
  campaign: CampaignConfig;
  template: CelebrationTemplate;
  format: PosterFormat;
  personalisation: PersonalisationData;
  photoImage: HTMLImageElement | null;
  photoAdjustments: PhotoAdjustments;
  logoImage: HTMLImageElement | null;
  backgroundImage: HTMLImageElement | null;
  showSafeAreas?: boolean;
}

// In-memory image cache for high-speed client-side rendering
const imageCache: Map<string, HTMLImageElement> = new Map();

function getCachedImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached && cached.complete) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error(`Failed to load asset: ${src}`));
    };
    img.src = src;
  });
}

/**
 * Master Takete-Ide Centenary Celebration Poster Rendering Engine.
 * Faithfully reproduces the authentic 100th Centenary visual design:
 * - Scenery background: Takete-Ide mountain landscape & sky
 * - Official TIPU Centenary emblem & header typography
 * - 100th Centenary laurel wreath monument & dates
 * - Unobstructed portrait placement with interactive zoom/pan/rotation
 * - Emerald green & gold ribbon wave with cultural artefacts (talking drum, horn, staff, leaves)
 * - Dynamic custom nameplate with zero pre-baked text or ghosting
 */
export async function renderCelebrationPoster({
  canvas,
  campaign,
  template,
  format,
  personalisation,
  photoImage,
  photoAdjustments,
  logoImage,
  backgroundImage,
  showSafeAreas = false,
}: RenderPosterOptions): Promise<void> {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const width = format.width;
  const height = format.height;

  canvas.width = width;
  canvas.height = height;

  const scaleX = width / 682;
  const scaleY = height / 1024;
  const scale = Math.min(scaleX, scaleY);

  // Asset URLs
  const bgUrl = "/images/celebration-studio/templates/poster-clean-background.png";
  const headerUrl = "/images/celebration-studio/templates/header-bar.png";
  const rightPanelUrl = "/images/celebration-studio/templates/right-monument-and-message.png";
  const bottomWaveUrl = "/images/celebration-studio/templates/bottom-wave-clean.png";
  const plaqueStdUrl = "/images/celebration-studio/templates/clean-plaque-standard.png";
  const plaqueLeadUrl = "/images/celebration-studio/templates/clean-plaque-leadership.png";
  const scriptMowaUrl = "/images/celebration-studio/templates/script-mowa-gbogbo.png";

  // Pre-load assets
  const [
    bgAsset,
    headerAsset,
    rightPanelAsset,
    bottomWaveAsset,
    plaqueStdAsset,
    plaqueLeadAsset,
    scriptMowaAsset,
  ] = await Promise.all([
    getCachedImage(bgUrl).catch(() => null),
    getCachedImage(headerUrl).catch(() => null),
    getCachedImage(rightPanelUrl).catch(() => null),
    getCachedImage(bottomWaveUrl).catch(() => null),
    getCachedImage(plaqueStdUrl).catch(() => null),
    getCachedImage(plaqueLeadUrl).catch(() => null),
    getCachedImage(scriptMowaAssetUrl(personalisation.localExpression)).catch(() => null),
  ]);

  function scriptMowaAssetUrl(expr?: string) {
    if (!expr || expr === "Mo wa gbogbo Ile ooo!" || expr.toLowerCase().includes("gbogbo ile")) {
      return scriptMowaUrl;
    }
    return scriptMowaUrl;
  }

  // 1. Draw Background
  if (backgroundImage && (template.category === "heritage" || personalisation.customOptions?.backgroundPhoto)) {
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);
    const wash = ctx.createLinearGradient(0, 0, width, 0);
    wash.addColorStop(0, "rgba(255, 255, 255, 0.1)");
    wash.addColorStop(0.55, "rgba(255, 255, 255, 0.6)");
    wash.addColorStop(1, "rgba(255, 255, 255, 0.9)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);
  } else if (bgAsset) {
    ctx.drawImage(bgAsset, 0, 0, width, height);
  } else {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, "#a8d4f0");
    skyGrad.addColorStop(0.25, "#d9ecf8");
    skyGrad.addColorStop(0.5, "#ffffff");
    skyGrad.addColorStop(1, "#f4f8f3");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Draw Celebrant Photo in portrait position (left half, unobstructed)
  if (photoImage) {
    const photoBoxX = 0;
    const photoBoxY = 155 * scaleY;
    const photoBoxW = 390 * scaleX;
    const photoBoxH = 585 * scaleY;

    ctx.save();
    ctx.beginPath();
    ctx.rect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);
    ctx.clip();

    const centerX = photoBoxX + photoBoxW / 2 + (photoAdjustments.panX || 0) * scaleX;
    const centerY = photoBoxY + photoBoxH / 2 + (photoAdjustments.panY || 0) * scaleY;

    ctx.translate(centerX, centerY);

    if (photoAdjustments.rotation) {
      ctx.rotate((photoAdjustments.rotation * Math.PI) / 180);
    }

    applyPhotoFilter(ctx, photoAdjustments.filter);

    const zoom = Math.max(0.5, photoAdjustments.zoom || 1.0);
    const imgRatio = photoImage.width / photoImage.height;
    const boxRatio = photoBoxW / photoBoxH;

    let drawW: number;
    let drawH: number;

    if (imgRatio > boxRatio) {
      drawH = photoBoxH * zoom;
      drawW = drawH * imgRatio;
    } else {
      drawW = photoBoxW * zoom;
      drawH = drawW / imgRatio;
    }

    ctx.drawImage(photoImage, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }

  // 3. Draw Top Header Bar
  if (headerAsset) {
    ctx.drawImage(headerAsset, 0, 0, width, 195 * scaleY);
  }

  // 4. Draw Right Monument & Felicitation Panel (strictly on the right, x >= 375)
  const rightX = 375 * scaleX;
  const rightY = 190 * scaleY;
  const rightW = width - rightX;
  const rightH = 570 * scaleY;

  if (rightPanelAsset) {
    ctx.drawImage(rightPanelAsset, rightX, rightY, rightW, rightH);
  }

  // 5. Draw Clean Bottom Wave & Cultural Artefacts (NO pre-baked text)
  const waveY = 724 * scaleY;
  const waveH = height - waveY;
  if (bottomWaveAsset) {
    ctx.drawImage(bottomWaveAsset, 0, waveY, width, waveH);
  }

  // 6. Draw Nameplate Plaque & Dynamic Personalized Text
  const plaqueX = 10 * scaleX;
  const plaqueY = 730 * scaleY;
  const plaqueW = 460 * scaleX;
  const plaqueH = 185 * scaleY;
  const plaqueCenterX = plaqueX + plaqueW / 2;

  const hasExplicitRole = !!(personalisation.title && (
    personalisation.title.toLowerCase().includes("chairman") ||
    personalisation.title.toLowerCase().includes("president") ||
    personalisation.title.toLowerCase().includes("patron") ||
    personalisation.title.toLowerCase().includes("elder") ||
    personalisation.title.toLowerCase().includes("chief")
  ));

  const plaqueAsset = (hasExplicitRole ? plaqueLeadAsset : plaqueStdAsset) || plaqueStdAsset;
  if (plaqueAsset) {
    ctx.drawImage(plaqueAsset, plaqueX, plaqueY, plaqueW, plaqueH);
  }

  // Text inside the plaque
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const rawName = (personalisation.name || personalisation.familyName || "DARAMOLA JOSEPH OMOYELE").trim().toUpperCase();
  const rawTitle = (personalisation.title || "").trim();
  const rawRole = (personalisation.signOff || "").trim();

  // Determine if title is an affiliation like "Proud Son of Takete-Ide"
  const isAffiliation = rawTitle.toLowerCase().includes("proud") || rawTitle.toLowerCase().includes("celebrant") || rawTitle.toLowerCase().includes("indigene");

  if (isAffiliation && rawTitle) {
    // 1. Affiliation Badge at top of plaque (e.g. "PROUD SON OF TAKETE-IDE")
    ctx.fillStyle = "#f5cf47";
    ctx.font = `800 ${Math.round(15 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.letterSpacing = `${Math.round(1.5 * scale)}px`;
    ctx.fillText(rawTitle.toUpperCase(), plaqueCenterX, plaqueY + 58 * scaleY);

    // 2. Name in center
    let nameSize = Math.round(27 * scale);
    ctx.font = `900 ${nameSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 30, 10, 0.95)";
    ctx.shadowBlur = 4 * scale;
    ctx.shadowOffsetY = 2 * scale;
    while (ctx.measureText(rawName).width > plaqueW * 0.88 && nameSize > 18) {
      nameSize -= 1.5;
      ctx.font = `900 ${nameSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    }
    ctx.fillText(rawName, plaqueCenterX, plaqueY + 100 * scaleY);
    ctx.shadowBlur = 0;
  } else if (rawTitle && !isAffiliation) {
    // Formal Title (e.g. "ELDER", "CHIEF", "DR")
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 30, 10, 0.95)";
    ctx.shadowBlur = 4 * scale;
    ctx.shadowOffsetY = 2 * scale;
    ctx.font = `900 ${Math.round(22 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(rawTitle.toUpperCase(), plaqueCenterX, plaqueY + 52 * scaleY);

    let nameSize = Math.round(32 * scale);
    ctx.font = `900 ${nameSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    while (ctx.measureText(rawName).width > plaqueW * 0.88 && nameSize > 20) {
      nameSize -= 2;
      ctx.font = `900 ${nameSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    }
    ctx.fillText(rawName, plaqueCenterX, plaqueY + 92 * scaleY);
    ctx.shadowBlur = 0;

    // Optional Role (e.g. "PAST CHAIRMAN") only if explicitly entered
    if (rawRole) {
      ctx.fillStyle = "#f5cf47";
      ctx.font = `800 ${Math.round(16 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(rawRole.toUpperCase(), plaqueCenterX, plaqueY + 130 * scaleY);
    }
  } else {
    // Standard Name formatting
    const nameWords = rawName.split(" ");
    if (nameWords.length >= 2 && !rawName.includes("&")) {
      // Split into two balanced lines (e.g. "MRS OMOLARA" / "ESEYIN" or "DARAMOLA JOSEPH" / "OMOYELE")
      const mid = Math.ceil(nameWords.length / 2);
      const line1 = nameWords.slice(0, mid).join(" ");
      const line2 = nameWords.slice(mid).join(" ");

      let size1 = Math.round(28 * scale);
      ctx.font = `900 ${size1}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 30, 10, 0.95)";
      ctx.shadowBlur = 4 * scale;
      ctx.shadowOffsetY = 2 * scale;
      while (ctx.measureText(line1).width > plaqueW * 0.86 && size1 > 18) {
        size1 -= 1.5;
        ctx.font = `900 ${size1}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      }
      ctx.fillText(line1, plaqueCenterX, plaqueY + 68 * scaleY);

      let size2 = Math.round(36 * scale);
      ctx.font = `900 ${size2}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      while (ctx.measureText(line2).width > plaqueW * 0.86 && size2 > 20) {
        size2 -= 2;
        ctx.font = `900 ${size2}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      }
      ctx.fillText(line2, plaqueCenterX, plaqueY + 112 * scaleY);
      ctx.shadowBlur = 0;
    } else {
      // Single line name (or couple name with &)
      let nameSize = Math.round(32 * scale);
      ctx.font = `900 ${nameSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 30, 10, 0.95)";
      ctx.shadowBlur = 4 * scale;
      ctx.shadowOffsetY = 2 * scale;
      while (ctx.measureText(rawName).width > plaqueW * 0.88 && nameSize > 18) {
        nameSize -= 2;
        ctx.font = `900 ${nameSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      }
      ctx.fillText(rawName, plaqueCenterX, plaqueY + 92 * scaleY);
      ctx.shadowBlur = 0;
    }
  }
  ctx.restore();

  // 7. Side Script (Yoruba Salutation) beside the plaque
  const customExpr = (personalisation.localExpression || "").trim();
  if (customExpr && (customExpr === "Mo wa gbogbo Ile ooo!" || customExpr.toLowerCase().includes("gbogbo ile"))) {
    if (scriptMowaAsset) {
      ctx.drawImage(scriptMowaAsset, 475 * scaleX, 780 * scaleY, 160 * scaleX, 75 * scaleY);
    }
  } else if (customExpr) {
    ctx.save();
    ctx.font = `italic 700 ${Math.round(18 * scale)}px "Playfair Display", Georgia, cursive, serif`;
    ctx.fillStyle = "#0c3b1e";
    ctx.textAlign = "left";
    ctx.fillText(customExpr, 475 * scaleX, 810 * scaleY);
    ctx.restore();
  }

  // 8. Safe Area Guides
  if (showSafeAreas) {
    drawSafeAreaOverlay(ctx, width, height, scale);
  }
}

/**
 * Helper to draw an image scaled to cover a destination rectangle without distortion.
 */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const imgRatio = img.width / img.height;
  const boxRatio = dw / dh;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

/**
 * Applies photographic visual filters.
 */
function applyPhotoFilter(ctx: CanvasRenderingContext2D, filterName?: string) {
  switch (filterName) {
    case "grayscale":
    case "classic-bw":
      ctx.filter = "grayscale(100%) contrast(105%)";
      break;
    case "sepia":
      ctx.filter = "sepia(80%) saturate(120%) contrast(105%)";
      break;
    case "warm":
      ctx.filter = "sepia(20%) saturate(130%) brightness(102%) contrast(105%)";
      break;
    case "vibrant":
      ctx.filter = "saturate(130%) contrast(108%) brightness(102%)";
      break;
    case "original":
    default:
      ctx.filter = "none";
      break;
  }
}

/**
 * Visual safe area overlay for design verification.
 */
function drawSafeAreaOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number
) {
  const margin = 40 * scale;
  ctx.save();
  ctx.strokeStyle = "rgba(255, 0, 0, 0.4)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  ctx.font = `bold ${Math.round(12 * scale)}px sans-serif`;
  ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
  ctx.fillText("SAFE AREA / PRINT BOUNDARY", margin + 10, margin + 20);
  ctx.restore();
}
