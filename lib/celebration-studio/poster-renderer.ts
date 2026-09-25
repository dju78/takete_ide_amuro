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

/**
 * Master High-Resolution 2D Canvas Poster Rendering Engine.
 * Features a powerful split composition for Personal Celebration,
 * enlarged photo frames (50-60% height), bold centenary monument graphics,
 * structured nameplates, and full-canvas ceremonial density.
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

  // Set physical canvas dimensions
  canvas.width = width;
  canvas.height = height;

  const scale = width / 1080;
  const aspect = height / width; // 1.0 (square), 1.25 (portrait), 1.33 (print 1200x1600), 1.77 (story)

  // 1. Draw Multi-Layer Background (Gradients, Sunrays, Landscape Silhouette, Textile Borders)
  drawRichBackground(ctx, width, height, template, backgroundImage, personalisation, scale);

  // 2. Draw Multi-Tier Ceremonial Borders & Corner Embellishments
  drawGrandCeremonialBorders(ctx, width, height, scale, template);

  // 3. Render Template-Specific High-Density Layout
  if (template.id === "personal-celebration" || template.id === "leadership-celebration") {
    // Strong Split Composition (55% photo on left/off-center, 20% 100-year monument, 15% name/message, 10% foundation)
    drawSplitCelebrationLayout(
      ctx,
      width,
      height,
      scale,
      aspect,
      campaign,
      template,
      personalisation,
      photoImage,
      photoAdjustments,
      logoImage
    );
  } else {
    // Centered / Wide Full-Canvas Composition (for Family, Heritage & Custom)
    drawBalancedFullCanvasLayout(
      ctx,
      width,
      height,
      scale,
      aspect,
      campaign,
      template,
      personalisation,
      photoImage,
      photoAdjustments,
      logoImage
    );
  }

  // 4. Safe Area Guides (Optional visual aid)
  if (showSafeAreas) {
    drawSafeAreaOverlay(ctx, width, height, scale);
  }
}

/**
 * Rich multi-layered background with sunrays, textile motifs, and authentic heritage hill silhouette.
 */
function drawRichBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  template: CelebrationTemplate,
  backgroundImage: HTMLImageElement | null,
  personalisation: PersonalisationData,
  scale: number
) {
  // If template is heritage or custom with background photo selected
  if (backgroundImage && (template.category === "heritage" || personalisation.customOptions?.backgroundPhoto)) {
    const imgRatio = backgroundImage.width / backgroundImage.height;
    const canvasRatio = width / height;
    let renderW = width;
    let renderH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      renderH = height;
      renderW = height * imgRatio;
      offsetX = (width - renderW) / 2;
    } else {
      renderW = width;
      renderH = width / imgRatio;
      offsetY = (height - renderH) / 2;
    }

    ctx.drawImage(backgroundImage, offsetX, offsetY, renderW, renderH);

    // Deep ceremonial vignette overlay for legibility while keeping scenery visible
    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    overlay.addColorStop(0, "rgba(22, 8, 38, 0.92)");
    overlay.addColorStop(0.3, "rgba(35, 14, 60, 0.78)");
    overlay.addColorStop(0.65, "rgba(22, 8, 38, 0.88)");
    overlay.addColorStop(1, "rgba(14, 5, 25, 0.97)");

    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // Procedural Ceremonial Gradient
  const bgStyle = template.backgroundStyle;
  const bgGradient = ctx.createRadialGradient(
    width / 2,
    height * 0.32,
    width * 0.05,
    width / 2,
    height * 0.5,
    width * 0.88
  );

  if (bgStyle === "heritage-green") {
    bgGradient.addColorStop(0, "#266d43");
    bgGradient.addColorStop(0.4, "#18492c");
    bgGradient.addColorStop(0.8, "#0e2d1b");
    bgGradient.addColorStop(1, "#07190e");
  } else if (bgStyle === "royal-gold") {
    bgGradient.addColorStop(0, "#4a1c7c");
    bgGradient.addColorStop(0.4, "#2a0f4a");
    bgGradient.addColorStop(0.8, "#17082a");
    bgGradient.addColorStop(1, "#0c0417");
  } else {
    // Default Ceremonial Deep Purple
    bgGradient.addColorStop(0, "#431776");
    bgGradient.addColorStop(0.4, "#2d0f50");
    bgGradient.addColorStop(0.8, "#1a0730");
    bgGradient.addColorStop(1, "#0e031c");
  }

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Ceremonial Golden Sunburst Rays from Top Emblem
  ctx.save();
  ctx.translate(width / 2, height * 0.12);
  const rayCount = 32;
  const rayRadius = Math.max(width, height) * 1.2;
  for (let i = 0; i < rayCount; i++) {
    const angle = (i * 2 * Math.PI) / rayCount;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, rayRadius, angle, angle + Math.PI / rayCount / 2.2);
    ctx.fillStyle = i % 2 === 0 ? "rgba(212, 167, 44, 0.04)" : "rgba(255, 255, 255, 0.018)";
    ctx.fill();
  }
  ctx.restore();

  // Clearly Visible Takete-Ide Obasoro Hill & Mountain Landscape Silhouette (Lower 30%)
  ctx.save();
  // 1. Back Ridge (Obasoro Range)
  ctx.beginPath();
  const backHillY = height - Math.round(360 * scale);
  ctx.moveTo(0, height);
  ctx.lineTo(0, backHillY);
  ctx.bezierCurveTo(
    width * 0.22,
    backHillY - 100 * scale,
    width * 0.42,
    backHillY + 30 * scale,
    width * 0.60,
    backHillY - 80 * scale
  );
  ctx.bezierCurveTo(
    width * 0.78,
    backHillY - 140 * scale,
    width * 0.90,
    backHillY - 20 * scale,
    width,
    backHillY - 70 * scale
  );
  ctx.lineTo(width, height);
  ctx.closePath();

  const backHillGrad = ctx.createLinearGradient(0, backHillY - 140 * scale, 0, height);
  backHillGrad.addColorStop(0, "rgba(212, 167, 44, 0.28)");
  backHillGrad.addColorStop(0.3, "rgba(24, 75, 45, 0.45)");
  backHillGrad.addColorStop(1, "rgba(10, 30, 18, 0.75)");
  ctx.fillStyle = backHillGrad;
  ctx.fill();

  // Back Ridge Gold Rim Highlight
  ctx.strokeStyle = "rgba(250, 227, 155, 0.45)";
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 2. Front Ridge (Valley & Foothills)
  ctx.beginPath();
  const frontHillY = height - Math.round(240 * scale);
  ctx.moveTo(0, height);
  ctx.lineTo(0, frontHillY);
  ctx.bezierCurveTo(
    width * 0.28,
    frontHillY - 60 * scale,
    width * 0.55,
    frontHillY + 40 * scale,
    width * 0.75,
    frontHillY - 50 * scale
  );
  ctx.bezierCurveTo(
    width * 0.88,
    frontHillY - 70 * scale,
    width * 0.95,
    frontHillY - 10 * scale,
    width,
    frontHillY - 40 * scale
  );
  ctx.lineTo(width, height);
  ctx.closePath();

  const frontHillGrad = ctx.createLinearGradient(0, frontHillY - 70 * scale, 0, height);
  frontHillGrad.addColorStop(0, "rgba(232, 199, 102, 0.35)");
  frontHillGrad.addColorStop(0.4, "rgba(18, 55, 33, 0.65)");
  frontHillGrad.addColorStop(1, "rgba(8, 22, 14, 0.90)");
  ctx.fillStyle = frontHillGrad;
  ctx.fill();

  // Front Ridge Gold Rim Highlight
  ctx.strokeStyle = "rgba(250, 227, 155, 0.55)";
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();
  ctx.restore();

  // Cultural Traditional Textile Diamond Pattern Borders along Sides
  ctx.save();
  ctx.strokeStyle = "rgba(232, 199, 102, 0.18)";
  ctx.lineWidth = 1.8;
  const diamondStep = Math.round(38 * scale);
  // Left border strip (Double diamond columns)
  for (let y = Math.round(60 * scale); y < height - Math.round(60 * scale); y += diamondStep) {
    drawTextileDiamond(ctx, Math.round(44 * scale), y, Math.round(12 * scale));
  }
  // Right border strip
  for (let y = Math.round(60 * scale); y < height - Math.round(60 * scale); y += diamondStep) {
    drawTextileDiamond(ctx, width - Math.round(44 * scale), y, Math.round(12 * scale));
  }
  ctx.restore();
}

/**
 * Draws a subtle traditional textile diamond motif.
 */
function drawTextileDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.stroke();

  // Inner dot
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(232, 199, 102, 0.25)";
  ctx.fill();
}

/**
 * Multi-tiered ceremonial gold borders, filigree corner brackets and accent studs.
 */
function drawGrandCeremonialBorders(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  template: CelebrationTemplate
) {
  const outerMargin = Math.round(22 * scale);
  const middleMargin = Math.round(32 * scale);
  const innerMargin = Math.round(40 * scale);
  const accentGold = template.accentColor || "#d4a72c";

  ctx.save();

  // 1. Heavy Outer Gold Border
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = Math.max(3, Math.round(4 * scale));
  ctx.strokeRect(outerMargin, outerMargin, width - outerMargin * 2, height - outerMargin * 2);

  // 2. Middle Micro-Dotted Gold Ribbon
  ctx.strokeStyle = "rgba(232, 199, 102, 0.6)";
  ctx.lineWidth = Math.max(1, Math.round(1.5 * scale));
  ctx.strokeRect(middleMargin, middleMargin, width - middleMargin * 2, height - middleMargin * 2);

  // 3. Inner Fine Border Line
  ctx.strokeStyle = "rgba(212, 167, 44, 0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

  // 4. Ornate Corner Medallions & Acanthus Brackets
  const bracketSize = Math.round(46 * scale);
  const corners = [
    { x: innerMargin, y: innerMargin, dx: 1, dy: 1 },
    { x: width - innerMargin, y: innerMargin, dx: -1, dy: 1 },
    { x: innerMargin, y: height - innerMargin, dx: 1, dy: -1 },
    { x: width - innerMargin, y: height - innerMargin, dx: -1, dy: -1 },
  ];

  ctx.fillStyle = accentGold;
  corners.forEach(({ x, y, dx, dy }) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + bracketSize * dx, y);
    ctx.lineTo(x + bracketSize * dx, y + 4 * dy * scale);
    ctx.lineTo(x + 4 * dx * scale, y + 4 * dy * scale);
    ctx.lineTo(x + 4 * dx * scale, y + bracketSize * dy);
    ctx.lineTo(x, y + bracketSize * dy);
    ctx.closePath();
    ctx.fill();

    // Corner Diamond
    ctx.beginPath();
    const cx = x + 14 * dx * scale;
    const cy = y + 14 * dy * scale;
    const r = 5 * scale;
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Powerful Split Composition for Personal Celebration & Leadership:
 * Left side: ~55% height photo.
 * Right side: Massive "100" centenary graphic monument + structured nameplate + felicitation scroll.
 * Bottom 20-25%: Curved ceremonial foundation ribbons, event date, and "Heritage • Unity • Progress".
 */
function drawSplitCelebrationLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  aspect: number,
  campaign: CampaignConfig,
  template: CelebrationTemplate,
  personalisation: PersonalisationData,
  photoImage: HTMLImageElement | null,
  photoAdjustments: PhotoAdjustments,
  logoImage: HTMLImageElement | null
) {
  const isSquare = aspect <= 1.05;

  // ── 1. Top Header (Y: ~40px to ~205px, ~11% of poster) ─────────────────────
  let currentY = Math.round(44 * scale);
  const centerX = width / 2;

  // Logo in gold filigree roundel
  const logoSize = Math.round((isSquare ? 60 : 70) * scale);
  if (logoImage) {
    ctx.save();
    ctx.shadowColor = "rgba(212, 167, 44, 0.9)";
    ctx.shadowBlur = 14 * scale;
    ctx.beginPath();
    ctx.arc(centerX, currentY + logoSize / 2, logoSize / 2 + 4 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3.5 * scale;
    ctx.strokeStyle = "#d4a72c";
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.clip();
    ctx.drawImage(logoImage, centerX - logoSize / 2, currentY, logoSize, logoSize);
    ctx.restore();
  }

  currentY += logoSize + Math.round(12 * scale);

  // Top Tracking Header: "TAKETE-IDE CENTENARY 1926–2026"
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.round(15 * scale)}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "#fae39b";
  ctx.letterSpacing = `${Math.round(3 * scale)}px`;
  ctx.fillText("TAKETE-IDE CENTENARY 1926–2026", centerX, currentY);

  currentY += Math.round(24 * scale);

  // Main Centenary Title (Enlarged for WhatsApp & Thumbnail Readability)
  ctx.font = `900 ${Math.round((isSquare ? 26 : 30) * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = 10 * scale;
  ctx.shadowOffsetY = 2 * scale;
  ctx.fillText("TAKETE-IDE DAY & CENTENARY CELEBRATION", centerX, currentY);
  ctx.shadowBlur = 0;

  currentY += Math.round(22 * scale);

  // Header Sub-Pill
  const dateText = `${campaign.eventDates} · TAKETE-IDE, KOGI STATE`;
  ctx.font = `bold ${Math.round(13 * scale)}px Inter, sans-serif`;
  const dateW = ctx.measureText(dateText).width;
  const pillPadding = 18 * scale;
  const pillH = 26 * scale;
  ctx.fillStyle = "rgba(36, 92, 58, 0.85)";
  ctx.strokeStyle = "#e8c766";
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, centerX - dateW / 2 - pillPadding, currentY - pillH / 2, dateW + pillPadding * 2, pillH, 13 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff9ef";
  ctx.fillText(dateText, centerX, currentY);
  ctx.restore();

  // ── 2. Mid Section Split Composition (Y: ~215px to ~1140px, ~58% of poster) ──
  const midTopY = currentY + Math.round(16 * scale);
  const midBottomY = height - Math.round(360 * scale);
  const midHeight = midBottomY - midTopY;

  // Left Column: Portrait dominating the left (width: ~50%, height: ~56% of poster)
  const photoW = Math.round(width * 0.50);
  const photoH = midHeight;
  const photoX = Math.round(48 * scale);
  const photoY = midTopY;

  // Draw Grand Framed Portrait on Left
  drawFramedPhotoBox(
    ctx,
    photoX,
    photoY,
    photoW,
    photoH,
    template.photoConfig.shape,
    photoImage,
    photoAdjustments,
    scale,
    template.accentColor || "#d4a72c"
  );

  // Right Column: Three tightly stacked ceremonial sections (width: ~42%)
  const rightX = photoX + photoW + Math.round(24 * scale);
  const rightW = width - rightX - Math.round(48 * scale);
  const rightCenterX = rightX + rightW / 2;
  let rightY = photoY;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // ── Section A: Giant Monumental Gold "100" (Enlarged by ~85%) ─────────────
  const numFontSize = Math.round((isSquare ? 120 : 175) * scale);
  ctx.font = `900 ${numFontSize}px "Playfair Display", Georgia, serif`;

  // Multi-stop brilliant gold foil gradient
  const numGrad = ctx.createLinearGradient(0, rightY, 0, rightY + numFontSize);
  numGrad.addColorStop(0, "#ffffff");
  numGrad.addColorStop(0.2, "#fff0a8");
  numGrad.addColorStop(0.45, "#e8bc38");
  numGrad.addColorStop(0.75, "#b8860b");
  numGrad.addColorStop(1, "#6b4e04");

  ctx.fillStyle = numGrad;
  ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
  ctx.shadowBlur = 18 * scale;
  ctx.shadowOffsetY = 6 * scale;
  ctx.fillText("100", rightCenterX, rightY + numFontSize * 0.40);
  ctx.shadowBlur = 0;

  // Attached Golden Banner: "CELEBRATING 100 YEARS"
  rightY += numFontSize * 0.76 + Math.round(2 * scale);
  const tagH = Math.round(34 * scale);
  const tagW = rightW;
  const tagGrad = ctx.createLinearGradient(rightCenterX - tagW / 2, 0, rightCenterX + tagW / 2, 0);
  tagGrad.addColorStop(0, "rgba(212, 167, 44, 0.4)");
  tagGrad.addColorStop(0.2, "#d4a72c");
  tagGrad.addColorStop(0.5, "#fff3b8");
  tagGrad.addColorStop(0.8, "#d4a72c");
  tagGrad.addColorStop(1, "rgba(212, 167, 44, 0.4)");

  ctx.fillStyle = tagGrad;
  ctx.strokeStyle = "#fae39b";
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, rightCenterX - tagW / 2, rightY, tagW, tagH, 6 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.font = `900 ${Math.round(15 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#18062b";
  ctx.letterSpacing = `${Math.round(1.5 * scale)}px`;
  ctx.fillText("CELEBRATING 100 YEARS", rightCenterX, rightY + tagH / 2);

  rightY += tagH + Math.round(14 * scale);

  // ── Section B: Salutation & Prominent Velvet Nameplate Plaque ──────────────
  const salutation = personalisation.greeting || template.defaultSalutation || "HAPPY CENTENARY CELEBRATION!";
  ctx.font = `italic 700 ${Math.round(14 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#fae39b";
  ctx.letterSpacing = `${Math.round(1 * scale)}px`;
  ctx.fillText(salutation.toUpperCase(), rightCenterX, rightY);

  rightY += Math.round(16 * scale);

  const displayName = (personalisation.name || "Chief Daramola Omoyele").trim();
  const roleTitle = (personalisation.title || "").trim();

  let nameFontSize = Math.round(30 * scale);
  ctx.font = `900 ${nameFontSize}px "Playfair Display", Georgia, serif`;
  let nameMetrics = ctx.measureText(displayName).width;
  while (nameMetrics > rightW - 28 * scale && nameFontSize > 18 * scale) {
    nameFontSize -= 2;
    ctx.font = `900 ${nameFontSize}px "Playfair Display", Georgia, serif`;
    nameMetrics = ctx.measureText(displayName).width;
  }

  const nameplateH = Math.round((roleTitle ? 74 : 58) * scale);
  const nameplateW = rightW;
  const nameplateGrad = ctx.createLinearGradient(rightCenterX - nameplateW / 2, 0, rightCenterX + nameplateW / 2, 0);
  nameplateGrad.addColorStop(0, "rgba(42, 16, 73, 0.98)");
  nameplateGrad.addColorStop(0.5, "rgba(75, 28, 130, 0.98)");
  nameplateGrad.addColorStop(1, "rgba(42, 16, 73, 0.98)");

  ctx.fillStyle = nameplateGrad;
  ctx.strokeStyle = "#d4a72c";
  ctx.lineWidth = 3 * scale;
  roundRect(ctx, rightCenterX - nameplateW / 2, rightY, nameplateW, nameplateH, 8 * scale);
  ctx.fill();
  ctx.stroke();

  // Nameplate Corner Gold Diamond Accents
  ctx.fillStyle = "#fae39b";
  ctx.fillRect(rightCenterX - nameplateW / 2 + 5 * scale, rightY + 5 * scale, 4 * scale, 4 * scale);
  ctx.fillRect(rightCenterX + nameplateW / 2 - 9 * scale, rightY + 5 * scale, 4 * scale, 4 * scale);
  ctx.fillRect(rightCenterX - nameplateW / 2 + 5 * scale, rightY + nameplateH - 9 * scale, 4 * scale, 4 * scale);
  ctx.fillRect(rightCenterX + nameplateW / 2 - 9 * scale, rightY + nameplateH - 9 * scale, 4 * scale, 4 * scale);

  if (roleTitle) {
    // Title inside nameplate top
    ctx.font = `bold ${Math.round(12 * scale)}px Inter, -apple-system, sans-serif`;
    ctx.fillStyle = "#e8c766";
    ctx.letterSpacing = `${Math.round(1.5 * scale)}px`;
    ctx.fillText(roleTitle.toUpperCase(), rightCenterX, rightY + Math.round(18 * scale));

    // Full Name
    ctx.font = `900 ${nameFontSize}px "Playfair Display", Georgia, serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 8 * scale;
    ctx.fillText(displayName, rightCenterX, rightY + Math.round(48 * scale));
    ctx.shadowBlur = 0;
  } else {
    // Name centered in plaque
    ctx.font = `900 ${nameFontSize}px "Playfair Display", Georgia, serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 8 * scale;
    ctx.fillText(displayName, rightCenterX, rightY + nameplateH / 2);
    ctx.shadowBlur = 0;
  }

  rightY += nameplateH + Math.round(14 * scale);

  // ── Section C: Larger Message Plaque (Zero Empty Void) ─────────────────────
  const scrollW = rightW;
  const scrollH = photoY + photoH - rightY;
  if (scrollH > 100 * scale) {
    const scrollGrad = ctx.createLinearGradient(0, rightY, 0, rightY + scrollH);
    scrollGrad.addColorStop(0, "rgba(35, 12, 60, 0.92)");
    scrollGrad.addColorStop(1, "rgba(20, 6, 36, 0.96)");

    ctx.fillStyle = scrollGrad;
    ctx.strokeStyle = "rgba(212, 167, 44, 0.65)";
    ctx.lineWidth = 2 * scale;
    roundRect(ctx, rightCenterX - scrollW / 2, rightY, scrollW, scrollH, 8 * scale);
    ctx.fill();
    ctx.stroke();

    // Inner fine gold filigree border
    ctx.strokeStyle = "rgba(250, 227, 155, 0.25)";
    ctx.lineWidth = 1;
    roundRect(ctx, rightCenterX - scrollW / 2 + 5 * scale, rightY + 5 * scale, scrollW - 10 * scale, scrollH - 10 * scale, 5 * scale);
    ctx.stroke();

    const message = (personalisation.message || template.defaultMessage).trim();
    const msgFontSize = Math.round(26 * scale);
    ctx.font = `italic 600 ${msgFontSize}px Georgia, "Playfair Display", serif`;
    ctx.fillStyle = "#fffdf7";
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.shadowBlur = 6 * scale;

    const lines = wrapText(ctx, `“${message}”`, scrollW - 36 * scale);
    const lineHeight = Math.round(40 * scale);
    const totalTextH = lines.length * lineHeight;
    const textStartY = rightY + Math.round((scrollH - totalTextH) / 2) + Math.round(lineHeight * 0.35);

    lines.slice(0, 5).forEach((line, idx) => {
      ctx.fillText(line, rightCenterX, textStartY + idx * lineHeight);
    });
    ctx.shadowBlur = 0;

    // Top Felicitation Header inside plaque
    ctx.font = `bold ${Math.round(13 * scale)}px Inter, -apple-system, sans-serif`;
    ctx.fillStyle = "#fae39b";
    ctx.letterSpacing = `${Math.round(2 * scale)}px`;
    ctx.fillText("❖  FELICITATION  ❖", rightCenterX, rightY + Math.round(22 * scale));

    // Celebratory Centenary Emblem below message
    ctx.fillText("★  1926 — CENTENARY — 2026  ★", rightCenterX, rightY + scrollH - Math.round(20 * scale));
  }

  ctx.restore();

  // ── 3. Lower Section - Broad Ceremonial Foundation (Bottom 30%) ──────────────
  const foundationY = height - Math.round((isSquare ? 260 : 330) * scale);
  drawGrandFoundationRibbons(
    ctx,
    centerX,
    foundationY,
    width,
    height,
    scale,
    campaign,
    template,
    personalisation
  );
}

/**
 * Balanced Full-Canvas Composition for Family, Heritage, and Custom templates.
 */
function drawBalancedFullCanvasLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  aspect: number,
  campaign: CampaignConfig,
  template: CelebrationTemplate,
  personalisation: PersonalisationData,
  photoImage: HTMLImageElement | null,
  photoAdjustments: PhotoAdjustments,
  logoImage: HTMLImageElement | null
) {
  const isSquare = aspect <= 1.05;
  const centerX = width / 2;
  let currentY = Math.round(50 * scale);

  // Top Header with Logo
  const logoSize = Math.round((isSquare ? 56 : 64) * scale);
  if (logoImage) {
    ctx.save();
    ctx.shadowColor = "rgba(212, 167, 44, 0.85)";
    ctx.shadowBlur = 12 * scale;
    ctx.beginPath();
    ctx.arc(centerX, currentY + logoSize / 2, logoSize / 2 + 4 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = "#d4a72c";
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.clip();
    ctx.drawImage(logoImage, centerX - logoSize / 2, currentY, logoSize, logoSize);
    ctx.restore();
  }

  currentY += logoSize + Math.round(14 * scale);

  // Centenary Title Banner
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.round(14 * scale)}px Inter, sans-serif`;
  ctx.fillStyle = "#e8c766";
  ctx.letterSpacing = `${Math.round(2.5 * scale)}px`;
  ctx.fillText("TAKETE-IDE CENTENARY 1926–2026", centerX, currentY);

  currentY += Math.round(22 * scale);

  ctx.font = `900 ${Math.round((isSquare ? 22 : 25) * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 8 * scale;
  ctx.fillText("TAKETE-IDE DAY & CENTENARY CELEBRATION", centerX, currentY);
  ctx.shadowBlur = 0;

  currentY += Math.round(20 * scale);

  const dateText = `${campaign.eventDates} · TAKETE-IDE, KOGI STATE`;
  ctx.font = `bold ${Math.round(12 * scale)}px Inter, sans-serif`;
  const dateW = ctx.measureText(dateText).width;
  const pillPadding = 16 * scale;
  const pillH = 22 * scale;
  ctx.fillStyle = "rgba(36, 92, 58, 0.75)";
  ctx.strokeStyle = "#e8c766";
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, centerX - dateW / 2 - pillPadding, currentY - pillH / 2, dateW + pillPadding * 2, pillH, 11 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff9ef";
  ctx.fillText(dateText, centerX, currentY);
  ctx.restore();

  // Grand Photo Box (Wide Panoramic for Family, Arched for Heritage)
  const photoY = currentY + Math.round(16 * scale);
  const photoW =
    template.category === "family"
      ? Math.round(width * 0.78)
      : Math.round(width * 0.58);
  const photoH =
    template.category === "family"
      ? Math.round(photoW * 0.68)
      : Math.round(photoW * 1.15);
  const photoX = centerX - photoW / 2;

  drawFramedPhotoBox(
    ctx,
    photoX,
    photoY,
    photoW,
    photoH,
    template.photoConfig.shape,
    photoImage,
    photoAdjustments,
    scale,
    template.accentColor || "#d4a72c"
  );

  // Nameplate & Message Plaque
  const nameplateY = photoY + photoH + Math.round(16 * scale);
  const nameplateW = Math.round(width * 0.84);

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const salutation = personalisation.greeting || template.defaultSalutation || "HAPPY CENTENARY CELEBRATION!";
  ctx.font = `italic 700 ${Math.round(14 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#e8c766";
  ctx.fillText(salutation.toUpperCase(), centerX, nameplateY);

  const displayName =
    template.category === "family"
      ? (personalisation.familyName || "The Daramola Family").trim()
      : (personalisation.name || "Chief Daramola Omoyele").trim();

  let nameFontSize = Math.round(28 * scale);
  ctx.font = `900 ${nameFontSize}px "Playfair Display", Georgia, serif`;
  let nameMetrics = ctx.measureText(displayName).width;
  while (nameMetrics > nameplateW - 40 * scale && nameFontSize > 16 * scale) {
    nameFontSize -= 2;
    ctx.font = `900 ${nameFontSize}px "Playfair Display", Georgia, serif`;
    nameMetrics = ctx.measureText(displayName).width;
  }

  const plaqueH = Math.round(44 * scale);
  const plaqueY = nameplateY + Math.round(14 * scale);
  const plaqueGrad = ctx.createLinearGradient(centerX - nameplateW / 2, 0, centerX + nameplateW / 2, 0);
  plaqueGrad.addColorStop(0, "rgba(35, 14, 60, 0.95)");
  plaqueGrad.addColorStop(0.5, "rgba(50, 19, 87, 0.98)");
  plaqueGrad.addColorStop(1, "rgba(35, 14, 60, 0.95)");

  ctx.fillStyle = plaqueGrad;
  ctx.strokeStyle = "#d4a72c";
  ctx.lineWidth = 2 * scale;
  roundRect(ctx, centerX - nameplateW / 2, plaqueY, nameplateW, plaqueH, 8 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = 6 * scale;
  ctx.fillText(displayName, centerX, plaqueY + plaqueH / 2);
  ctx.shadowBlur = 0;

  // Role/Title if entered
  let nextMsgY = plaqueY + plaqueH + Math.round(14 * scale);
  const roleTitle = (personalisation.title || "").trim();
  if (roleTitle && template.category !== "family") {
    ctx.font = `bold ${Math.round(12.5 * scale)}px Inter, sans-serif`;
    ctx.fillStyle = "#e8c766";
    ctx.fillText(`◆  ${roleTitle.toUpperCase()}  ◆`, centerX, nextMsgY);
    nextMsgY += Math.round(18 * scale);
  }

  // Felicitation Message
  const message = (personalisation.message || template.defaultMessage).trim();
  ctx.font = `italic 600 ${Math.round(18 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#fffbf2";
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 4 * scale;
  const lines = wrapText(ctx, `“${message}”`, nameplateW - 40 * scale);
  const lineHeight = Math.round(26 * scale);
  lines.slice(0, 3).forEach((line, idx) => {
    ctx.fillText(line, centerX, nextMsgY + idx * lineHeight);
  });
  ctx.shadowBlur = 0;

  ctx.restore();

  // Foundation Ribbons
  const foundationY = height - Math.round((isSquare ? 200 : 240) * scale);
  drawGrandFoundationRibbons(
    ctx,
    centerX,
    foundationY,
    width,
    height,
    scale,
    campaign,
    template,
    personalisation
  );
}

/**
 * Draws the lower ceremonial foundation ribbons, event date, and "Heritage • Unity • Progress".
 */
function drawGrandFoundationRibbons(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  startY: number,
  width: number,
  height: number,
  scale: number,
  campaign: CampaignConfig,
  template: CelebrationTemplate,
  personalisation: PersonalisationData
) {
  let currentY = startY;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 1. Broad Gold Ceremonial Ribbon with Editable Local Expression / Motto
  const expression = (
    personalisation.localExpression ||
    personalisation.signOff ||
    template.defaultLocalExpression ||
    ""
  ).trim();

  if (expression) {
    const ribbonW = width - Math.round(96 * scale);
    const ribbonH = Math.round(46 * scale);

    const ribbonGrad = ctx.createLinearGradient(centerX - ribbonW / 2, 0, centerX + ribbonW / 2, 0);
    ribbonGrad.addColorStop(0, "rgba(212, 167, 44, 0.25)");
    ribbonGrad.addColorStop(0.18, "#d4a72c");
    ribbonGrad.addColorStop(0.5, "#fff3b8");
    ribbonGrad.addColorStop(0.82, "#d4a72c");
    ribbonGrad.addColorStop(1, "rgba(212, 167, 44, 0.25)");

    ctx.fillStyle = ribbonGrad;
    ctx.strokeStyle = "#fae39b";
    ctx.lineWidth = 1.5 * scale;
    roundRect(ctx, centerX - ribbonW / 2, currentY, ribbonW, ribbonH, 8 * scale);
    ctx.fill();
    ctx.stroke();

    ctx.font = `900 ${Math.round(18 * scale)}px "Playfair Display", Georgia, serif`;
    ctx.fillStyle = "#150426";
    ctx.letterSpacing = `${Math.round(2.5 * scale)}px`;
    ctx.fillText(expression.toUpperCase(), centerX, currentY + ribbonH / 2);

    currentY += ribbonH + Math.round(20 * scale);
  } else {
    currentY += Math.round(12 * scale);
  }

  // 2. Confirmed Event Date: "29–31 OCTOBER 2026" (Enlarged & Prominent)
  ctx.font = `900 ${Math.round(21 * scale)}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
  ctx.shadowBlur = 6 * scale;
  ctx.fillText("29–31 OCTOBER 2026", centerX, currentY);
  ctx.shadowBlur = 0;

  currentY += Math.round(26 * scale);

  // 3. Motto: "HERITAGE • UNITY • PROGRESS" (Enlarged Gold Banner)
  ctx.font = `900 ${Math.round(19 * scale)}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "#fae39b";
  ctx.letterSpacing = `${Math.round(3.5 * scale)}px`;
  ctx.fillText("HERITAGE  •  UNITY  •  PROGRESS", centerX, currentY);

  currentY += Math.round(24 * scale);

  // 4. Community Portal Link
  ctx.font = `bold ${Math.round(13 * scale)}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.letterSpacing = "1.5px";
  ctx.fillText("takete-ide.org", centerX, currentY);

  ctx.restore();
}

/**
 * Draws an enlarged, high-contrast framed photograph box with gold bevels and drop shadows.
 */
function drawFramedPhotoBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  shape: "circle" | "arch" | "rounded-rect" | "oval" | "full-bleed",
  photoImage: HTMLImageElement | null,
  photoAdjustments: PhotoAdjustments,
  scale: number,
  accentGold: string
) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const goldBorderWidth = Math.round(8 * scale);

  ctx.save();

  // 1. Deep Shadow Behind Photo Frame
  ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
  ctx.shadowBlur = Math.round(26 * scale);
  ctx.shadowOffsetY = Math.round(10 * scale);

  ctx.fillStyle = "#170827";
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.fill();
  ctx.restore();

  // 2. Render Photo Content (Clipped)
  ctx.save();
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.clip();

  if (photoImage) {
    ctx.save();
    ctx.translate(centerX, centerY);

    const panOffsetX = (photoAdjustments.panX / 100) * (width * 0.5);
    const panOffsetY = (photoAdjustments.panY / 100) * (height * 0.5);
    ctx.translate(panOffsetX, panOffsetY);

    ctx.rotate((photoAdjustments.rotation * Math.PI) / 180);

    const zoom = Math.max(1, photoAdjustments.zoom);
    const imgRatio = photoImage.width / photoImage.height;
    const targetRatio = width / height;
    let drawW = width * zoom;
    let drawH = height * zoom;

    if (imgRatio > targetRatio) {
      drawH = height * zoom;
      drawW = drawH * imgRatio;
    } else {
      drawW = width * zoom;
      drawH = drawW / imgRatio;
    }

    if (photoAdjustments.filter === "warm") {
      ctx.filter = "sepia(0.2) contrast(1.05) saturate(1.15)";
    } else if (photoAdjustments.filter === "vibrant") {
      ctx.filter = "saturate(1.25) contrast(1.08)";
    } else if (photoAdjustments.filter === "classic-bw") {
      ctx.filter = "grayscale(1) contrast(1.15)";
    }

    ctx.drawImage(photoImage, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  } else {
    const phGrad = ctx.createLinearGradient(x, y, x, y + height);
    phGrad.addColorStop(0, "rgba(50, 19, 87, 0.85)");
    phGrad.addColorStop(1, "rgba(23, 10, 41, 0.98)");
    ctx.fillStyle = phGrad;
    ctx.fillRect(x, y, width, height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.round(20 * scale)}px "Playfair Display", Georgia, serif`;
    ctx.fillStyle = "#e8c766";
    ctx.fillText("YOUR PHOTOGRAPH HERE", centerX, centerY - 14 * scale);

    ctx.font = `italic 500 ${Math.round(13 * scale)}px Inter, sans-serif`;
    ctx.fillStyle = "rgba(255, 249, 239, 0.75)";
    ctx.fillText("Upload in Step 2 of Celebration Studio", centerX, centerY + 14 * scale);
  }

  ctx.restore();

  // 3. Double Gold Foil Frame with Beveled Highlight
  ctx.save();
  ctx.lineWidth = goldBorderWidth;
  ctx.strokeStyle = accentGold;
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.stroke();

  ctx.lineWidth = Math.max(1, Math.round(2 * scale));
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  clipPhotoShape(ctx, shape, x + 3 * scale, y + 3 * scale, width - 6 * scale, height - 6 * scale);
  ctx.stroke();

  // Corner filigree accents on frame
  if (shape === "rounded-rect" || shape === "arch") {
    const cSize = Math.round(24 * scale);
    ctx.fillStyle = accentGold;
    ctx.fillRect(x - 2 * scale, y + height - 2 * scale, cSize, 4 * scale);
    ctx.fillRect(x - 2 * scale, y + height - cSize + 2 * scale, 4 * scale, cSize);
    ctx.fillRect(x + width - cSize + 2 * scale, y + height - 2 * scale, cSize, 4 * scale);
    ctx.fillRect(x + width - 2 * scale, y + height - cSize + 2 * scale, 4 * scale, cSize);
  }

  ctx.restore();
}

/**
 * Visual safe area overlay guide for inspection.
 */
function drawSafeAreaOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number
) {
  const safeMargin = Math.round(50 * scale);
  ctx.save();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(safeMargin, safeMargin, width - safeMargin * 2, height - safeMargin * 2);

  ctx.font = `bold ${Math.round(11 * scale)}px monospace`;
  ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
  ctx.fillText("SAFE PRINT / SOCIAL ZONE", safeMargin + 10, safeMargin + 20);
  ctx.restore();
}

/**
 * Creates clipping paths for circle, arch, rounded-rect, and oval frames.
 */
function clipPhotoShape(
  ctx: CanvasRenderingContext2D,
  shape: "circle" | "arch" | "rounded-rect" | "oval" | "full-bleed",
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.beginPath();
  if (shape === "circle") {
    const radius = Math.min(w, h) / 2;
    ctx.arc(x + w / 2, y + h / 2, radius, 0, Math.PI * 2);
  } else if (shape === "arch") {
    const radius = w / 2;
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + radius);
    ctx.arc(x + radius, y + radius, radius, Math.PI, 0);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  } else if (shape === "oval") {
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  } else {
    // rounded-rect
    roundRect(ctx, x, y, w, h, Math.min(24, Math.round(w * 0.06)));
  }
}

/**
 * Utility: wraps text into lines fitting within a specified maxWidth.
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Utility: Draws a rounded rectangle path.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
