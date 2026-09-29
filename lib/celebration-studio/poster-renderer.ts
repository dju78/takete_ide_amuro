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

// In-memory image cache for fast re-renders
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
      // Fallback if image fails
      reject(new Error(`Failed to load asset: ${src}`));
    };
    img.src = src;
  });
}

/**
 * Master Takete-Ide Centenary Celebration Poster Renderer.
 * Reproduces the authentic 100th Centenary visual design with precision:
 * - Takete-Ide mountain landscape & sky background
 * - Official TIPU Centenary seal & header typography
 * - 100th Centenary laurel wreath monument & dates (29th–31st Oct 2026)
 * - Greetings to everyone felicitation text
 * - Celebrant photograph placement with smooth pan/zoom/rotation
 * - Emerald green & gold ribbon wave
 * - Traditional Yoruba cultural artifacts (Talking Drum, Ivory Horn, Beaded Staff, Leaves)
 * - Custom green & gold name plaque tailored to Personal, Family & Leadership templates
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
  const bottomWaveUrl = "/images/celebration-studio/templates/bottom-wave-full.png";
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
    getCachedImage(scriptMowaUrl).catch(() => null),
  ]);

  // 1. Draw Background
  if (backgroundImage && (template.category === "heritage" || personalisation.customOptions?.backgroundPhoto)) {
    // Custom selected heritage background
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);
    // Subtle gradient wash
    const wash = ctx.createLinearGradient(0, 0, width, 0);
    wash.addColorStop(0, "rgba(255, 255, 255, 0.1)");
    wash.addColorStop(0.55, "rgba(255, 255, 255, 0.6)");
    wash.addColorStop(1, "rgba(255, 255, 255, 0.9)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);
  } else if (bgAsset) {
    ctx.drawImage(bgAsset, 0, 0, width, height);
  } else {
    // Fallback procedural sky and landscape gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, "#a8d4f0");
    skyGrad.addColorStop(0.25, "#d9ecf8");
    skyGrad.addColorStop(0.5, "#ffffff");
    skyGrad.addColorStop(1, "#f4f8f3");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Draw Celebrant Photo in portrait placement (left half)
  if (photoImage) {
    const photoBoxX = 0;
    const photoBoxY = 150 * scaleY;
    const photoBoxW = 420 * scaleX;
    const photoBoxH = 630 * scaleY;

    ctx.save();
    // Clip to left area
    ctx.beginPath();
    ctx.rect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);
    ctx.clip();

    // Apply adjustments: Zoom, Pan, Rotation, Filter
    const centerX = photoBoxX + photoBoxW / 2 + (photoAdjustments.panX || 0) * scaleX;
    const centerY = photoBoxY + photoBoxH / 2 + (photoAdjustments.panY || 0) * scaleY;

    ctx.translate(centerX, centerY);

    if (photoAdjustments.rotation) {
      ctx.rotate((photoAdjustments.rotation * Math.PI) / 180);
    }

    // Apply filter
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
  } else {
    // Fallback header
    drawFallbackHeader(ctx, width, scaleX, scaleY, logoImage);
  }

  // 4. Draw Right Monument & Message Panel
  const rightX = 355 * scaleX;
  const rightY = 195 * scaleY;
  const rightW = width - rightX;
  const rightH = 565 * scaleY;

  if (rightPanelAsset) {
    ctx.drawImage(rightPanelAsset, rightX, rightY, rightW, rightH);
  }

  // If user customised felicitation message, render dynamic message text
  const defaultMsg = "As we celebrate 100 years of our great heritage, let us stand together in unity, love and progress for a brighter future of Takete-Ide.";
  const currentMsg = (personalisation.message || "").trim();
  const currentGreeting = (personalisation.greeting || "").trim();

  if (currentMsg && currentMsg !== defaultMsg) {
    drawCustomMessageText(ctx, rightX + rightW * 0.1, rightY + rightH * 0.58, rightW * 0.8, currentMsg, scale);
  }

  // 5. Draw Bottom Emerald Green & Gold Wave with Cultural Artefacts
  const waveY = 720 * scaleY;
  const waveH = height - waveY;
  if (bottomWaveAsset) {
    ctx.drawImage(bottomWaveAsset, 0, waveY, width, waveH);
  }

  // 6. Draw Name Plaque & Celebrant Name / Details
  const isLeadership = template.category === "leadership" || !!personalisation.title;
  const isFamily = template.category === "family";

  const plaqueX = 10 * scaleX;
  const plaqueW = 460 * scaleX;

  if (isLeadership) {
    // Leadership Plaque
    const plaqueY = 715 * scaleY;
    const plaqueH = 200 * scaleY;

    if (plaqueLeadAsset) {
      ctx.drawImage(plaqueLeadAsset, plaqueX, plaqueY, plaqueW, plaqueH);
    }

    const titleText = (personalisation.title || "ELDER").toUpperCase();
    const nameText = (personalisation.name || "ELEWA DARE").toUpperCase();
    const subline1 = (personalisation.signOff || "PAST CHAIRMAN").toUpperCase();
    const subline2 = (personalisation.localExpression || "TIPU ILORIN BRANCH").toUpperCase();

    const plaqueCenterX = plaqueX + plaqueW / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Title (e.g. ELDER)
    ctx.font = `900 ${Math.round(23 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 30, 10, 0.95)";
    ctx.shadowBlur = 4 * scale;
    ctx.shadowOffsetY = 2 * scale;
    ctx.fillText(titleText, plaqueCenterX, plaqueY + 48 * scaleY);

    // Name (e.g. ELEWA DARE)
    let nameSize = Math.round(38 * scale);
    ctx.font = `900 ${nameSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    while (ctx.measureText(nameText).width > plaqueW * 0.85 && nameSize > 20) {
      nameSize -= 2;
      ctx.font = `900 ${nameSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    }
    ctx.fillText(nameText, plaqueCenterX, plaqueY + 86 * scaleY);

    // Subtitle Line 1 (e.g. PAST CHAIRMAN)
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = "#f5cf47";
    ctx.font = `800 ${Math.round(18 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(subline1, plaqueCenterX, plaqueY + 118 * scaleY);

    // Subtitle Line 2 (e.g. TIPU ILORIN BRANCH)
    ctx.font = `800 ${Math.round(17 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(subline2, plaqueCenterX, plaqueY + 142 * scaleY);

    ctx.restore();
  } else {
    // Standard / Couple / Family Plaque
    const plaqueY = 730 * scaleY;
    const plaqueH = 185 * scaleY;

    if (plaqueStdAsset) {
      ctx.drawImage(plaqueStdAsset, plaqueX, plaqueY, plaqueW, plaqueH);
    }

    const plaqueCenterX = plaqueX + plaqueW / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 30, 10, 0.95)";
    ctx.shadowBlur = 4 * scale;
    ctx.shadowOffsetY = 2 * scale;

    if (isFamily) {
      // Couple / Family mode: Two lines
      const line1 = (personalisation.familyName || personalisation.name || "ATTEH TITILAYO &").toUpperCase();
      const line2 = (personalisation.signOff || (personalisation.familyName ? "FAMILY" : "ENGR FUNSHO")).toUpperCase();

      let size1 = Math.round(30 * scale);
      ctx.font = `900 ${size1}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      while (ctx.measureText(line1).width > plaqueW * 0.85 && size1 > 18) {
        size1 -= 2;
        ctx.font = `900 ${size1}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      }
      ctx.fillText(line1, plaqueCenterX, plaqueY + 70 * scaleY);

      let size2 = Math.round(38 * scale);
      ctx.font = `900 ${size2}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      while (ctx.measureText(line2).width > plaqueW * 0.85 && size2 > 20) {
        size2 -= 2;
        ctx.font = `900 ${size2}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      }
      ctx.fillText(line2, plaqueCenterX, plaqueY + 115 * scaleY);
    } else {
      // Individual mode
      const rawName = (personalisation.name || "MRS OMOLARA ESEYIN").trim().toUpperCase();
      const parts = rawName.split(" ");

      if (parts.length >= 2) {
        // e.g. "MRS OMOLARA" & "ESEYIN"
        const line1 = parts.length > 2 ? parts.slice(0, parts.length - 1).join(" ") : parts[0];
        const line2 = parts[parts.length - 1];

        let size1 = Math.round(34 * scale);
        ctx.font = `900 ${size1}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        while (ctx.measureText(line1).width > plaqueW * 0.85 && size1 > 20) {
          size1 -= 2;
          ctx.font = `900 ${size1}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        }
        ctx.fillText(line1, plaqueCenterX, plaqueY + 70 * scaleY);

        let size2 = Math.round(44 * scale);
        ctx.font = `900 ${size2}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        while (ctx.measureText(line2).width > plaqueW * 0.85 && size2 > 22) {
          size2 -= 2;
          ctx.font = `900 ${size2}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        }
        ctx.fillText(line2, plaqueCenterX, plaqueY + 115 * scaleY);
      } else {
        // Single name
        let size = Math.round(42 * scale);
        ctx.font = `900 ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        while (ctx.measureText(rawName).width > plaqueW * 0.85 && size > 20) {
          size -= 2;
          ctx.font = `900 ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        }
        ctx.fillText(rawName, plaqueCenterX, plaqueY + 92 * scaleY);
      }
    }
    ctx.restore();

    // Side Script: "Mo wa gbogbo Ile ooo!" or custom local expression
    const sideScriptX = 475 * scaleX;
    const sideScriptY = 780 * scaleY;
    const sideScriptW = 160 * scaleX;
    const sideScriptH = 75 * scaleY;

    const customExpr = (personalisation.localExpression || "").trim();
    if (!customExpr || customExpr === "Mo wa gbogbo Ile ooo!" || customExpr === "Agbagba Ide Agbe Wa O") {
      if (scriptMowaAsset) {
        ctx.drawImage(scriptMowaAsset, sideScriptX, sideScriptY, sideScriptW, sideScriptH);
      }
    } else {
      // Draw custom calligraphy text
      ctx.save();
      ctx.font = `italic 700 ${Math.round(20 * scale)}px "Playfair Display", Georgia, cursive, serif`;
      ctx.fillStyle = "#0c3b1e";
      ctx.textAlign = "left";
      ctx.fillText(customExpr, sideScriptX, sideScriptY + 30 * scaleY);
      ctx.restore();
    }
  }

  // 7. Safe Areas Guide
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
      ctx.filter = "grayscale(100%) contrast(105%)";
      break;
    case "sepia":
      ctx.filter = "sepia(80%) saturate(120%) contrast(105%)";
      break;
    case "warm":
      ctx.filter = "sepia(25%) saturate(135%) brightness(102%) contrast(105%)";
      break;
    case "vibrant":
      ctx.filter = "saturate(135%) contrast(110%) brightness(102%)";
      break;
    case "original":
    default:
      ctx.filter = "none";
      break;
  }
}

/**
 * Draws custom message text on the right felicitation panel.
 */
function drawCustomMessageText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxWidth: number,
  text: string,
  scale: number
) {
  ctx.save();
  ctx.font = `500 ${Math.round(15 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#0c3b1e";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const words = text.split(" ");
  let line = "";
  let lineY = y;
  const lineHeight = 20 * scale;

  // Background white box with rounded corners for legibility
  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.fillRect(x - maxWidth / 2 - 10 * scale, y - 5 * scale, maxWidth + 20 * scale, 100 * scale);

  ctx.fillStyle = "#0c3b1e";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, lineY);
      line = words[n] + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, lineY);
  ctx.restore();
}

/**
 * Fallback procedural header if graphic asset fails to load.
 */
function drawFallbackHeader(
  ctx: CanvasRenderingContext2D,
  width: number,
  scaleX: number,
  scaleY: number,
  logoImage: HTMLImageElement | null
) {
  ctx.save();
  if (logoImage) {
    ctx.drawImage(logoImage, 35 * scaleX, 12 * scaleY, 180 * scaleX, 180 * scaleY);
  }
  ctx.font = `900 ${Math.round(28 * scaleX)}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillStyle = "#0c3b1e";
  ctx.textAlign = "left";
  ctx.fillText("TAKETE IDE", 230 * scaleX, 55 * scaleY);
  ctx.fillText("PROGRESSIVE UNION", 230 * scaleX, 90 * scaleY);

  ctx.font = `bold ${Math.round(14 * scaleX)}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText("UNITY  ♦  LOVE  ♦  PROGRESS", 230 * scaleX, 125 * scaleY);
  ctx.restore();
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
