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
 * Generates rich, culturally authentic, celebratory centenary posters with strong visual density.
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

  // Normalize scale factors relative to 1080x1350 standard
  const scale = width / 1080;
  const aspect = height / width; // 1.0 (square), 1.25 (portrait), 1.33 (print), 1.77 (story)

  // 1. Draw Multi-Layer Background (Gradients, Textures, Sunrays, Heritage Backdrop)
  drawRichBackground(ctx, width, height, template, backgroundImage, personalisation, scale);

  // 2. Draw Multi-Tier Ceremonial Borders & Corner Embellishments
  drawGrandCeremonialBorders(ctx, width, height, scale, template);

  // 3. Calculate Cohesive Visual Zones (Header, Photo, Nameplate, Message, Foundation Footer)
  const zones = calculateBalancedZones(width, height, scale, aspect, template);

  // 4. Draw Header Section: 100-Year Milestone Crown, Emblem, and Event Dates
  drawGrandHeader(ctx, zones.header, scale, campaign, template, logoImage);

  // 5. Draw Enlarged Framed Photograph (30–45% larger)
  drawGrandPhoto(ctx, zones.photo, template, photoImage, photoAdjustments, scale, personalisation);

  // 6. Draw Ceremonial Nameplate Plaque & Optional Role
  drawStructuredNameplate(ctx, zones.nameplate, scale, template, personalisation);

  // 7. Draw Congratulatory Message & Quotations
  drawCongratulatoryMessage(ctx, zones.message, scale, template, personalisation);

  // 8. Draw Grand Ceremonial Foundation Ribbon & Footer
  drawCeremonialFoundation(ctx, zones.foundation, scale, campaign, template, personalisation);

  // 9. Safe Area Guides (Optional visual aid)
  if (showSafeAreas) {
    drawSafeAreaOverlay(ctx, width, height, scale);
  }
}

/**
 * Rich multi-layered background with sunrays, textile motifs, and authentic heritage images.
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
    overlay.addColorStop(0, "rgba(22, 8, 38, 0.90)");
    overlay.addColorStop(0.3, "rgba(35, 14, 60, 0.76)");
    overlay.addColorStop(0.65, "rgba(22, 8, 38, 0.85)");
    overlay.addColorStop(1, "rgba(14, 5, 25, 0.96)");

    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // Pure Procedural Ceremonial Gradient
  const bgStyle = template.backgroundStyle;
  const bgGradient = ctx.createRadialGradient(
    width / 2,
    height * 0.35,
    width * 0.05,
    width / 2,
    height * 0.5,
    width * 0.85
  );

  if (bgStyle === "heritage-green") {
    bgGradient.addColorStop(0, "#266d43");
    bgGradient.addColorStop(0.4, "#18492c");
    bgGradient.addColorStop(0.8, "#0e2d1b");
    bgGradient.addColorStop(1, "#07190e");
  } else if (bgStyle === "royal-gold") {
    bgGradient.addColorStop(0, "#481b7a");
    bgGradient.addColorStop(0.4, "#2a0f4a");
    bgGradient.addColorStop(0.8, "#17082a");
    bgGradient.addColorStop(1, "#0c0417");
  } else {
    // Default Ceremonial Deep Purple
    bgGradient.addColorStop(0, "#421674");
    bgGradient.addColorStop(0.4, "#2c0e4f");
    bgGradient.addColorStop(0.8, "#1a0730");
    bgGradient.addColorStop(1, "#0e031c");
  }

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Ceremonial Golden Sunburst / Ambient Rays
  ctx.save();
  ctx.translate(width / 2, height * 0.16);
  const rayCount = 28;
  const rayRadius = Math.max(width, height);
  for (let i = 0; i < rayCount; i++) {
    const angle = (i * 2 * Math.PI) / rayCount;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, rayRadius, angle, angle + Math.PI / rayCount / 2);
    ctx.fillStyle = i % 2 === 0 ? "rgba(212, 167, 44, 0.035)" : "rgba(255, 255, 255, 0.015)";
    ctx.fill();
  }
  ctx.restore();

  // Subtle Geometric Textile Watermark (Cultural Diamonds)
  ctx.save();
  ctx.strokeStyle = "rgba(232, 199, 102, 0.04)";
  ctx.lineWidth = 1;
  const step = Math.round(48 * scale);
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(x + step / 2, y);
      ctx.lineTo(x + step, y + step / 2);
      ctx.lineTo(x + step / 2, y + step);
      ctx.lineTo(x, y + step / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();
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
  const outerMargin = Math.round(24 * scale);
  const middleMargin = Math.round(34 * scale);
  const innerMargin = Math.round(42 * scale);
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
  const bracketSize = Math.round(44 * scale);
  const corners = [
    { x: innerMargin, y: innerMargin, dx: 1, dy: 1 },
    { x: width - innerMargin, y: innerMargin, dx: -1, dy: 1 },
    { x: innerMargin, y: height - innerMargin, dx: 1, dy: -1 },
    { x: width - innerMargin, y: height - innerMargin, dx: -1, dy: -1 },
  ];

  ctx.fillStyle = accentGold;
  corners.forEach(({ x, y, dx, dy }) => {
    // Corner L-Bracket
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + bracketSize * dx, y);
    ctx.lineTo(x + bracketSize * dx, y + 4 * dy * scale);
    ctx.lineTo(x + 4 * dx * scale, y + 4 * dy * scale);
    ctx.lineTo(x + 4 * dx * scale, y + bracketSize * dy);
    ctx.lineTo(x, y + bracketSize * dy);
    ctx.closePath();
    ctx.fill();

    // Corner Gold Diamond Stud
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
 * Calculates responsive, balanced visual zones for any aspect ratio (Square, Portrait, Story, Print).
 * Eliminates the empty lower space and ensures high visual balance.
 */
function calculateBalancedZones(
  width: number,
  height: number,
  scale: number,
  aspect: number,
  template: CelebrationTemplate
) {
  const isSquare = aspect <= 1.05;
  const isStory = aspect >= 1.6;

  // Header Zone
  const headerY = Math.round(52 * scale);
  const headerHeight = isSquare ? Math.round(180 * scale) : Math.round(220 * scale);

  // Photo Zone (Enlarged by 30–45%)
  let photoWidth = Math.round((isSquare ? 420 : isStory ? 560 : 540) * scale);
  let photoHeight = photoWidth;

  if (template.category === "family") {
    photoWidth = Math.round((isSquare ? 520 : isStory ? 680 : 660) * scale);
    photoHeight = Math.round(photoWidth * 0.75);
  } else if (template.photoConfig.shape === "arch") {
    photoHeight = Math.round(photoWidth * 1.15);
  }

  const photoY = headerY + headerHeight + (isSquare ? 6 * scale : 16 * scale);

  // Nameplate Zone
  const nameplateY = photoY + photoHeight + Math.round(14 * scale);
  const nameplateHeight = Math.round((isSquare ? 110 : 130) * scale);

  // Message Zone
  const messageY = nameplateY + nameplateHeight + Math.round(10 * scale);
  const messageHeight = Math.round((isSquare ? 110 : isStory ? 180 : 140) * scale);

  // Foundation Footer Zone
  const foundationY = height - Math.round((isSquare ? 140 : 165) * scale);
  const foundationHeight = Math.round((isSquare ? 120 : 140) * scale);

  return {
    header: { y: headerY, height: headerHeight, width, centerX: width / 2 },
    photo: {
      x: width / 2 - photoWidth / 2,
      y: photoY,
      width: photoWidth,
      height: photoHeight,
      centerX: width / 2,
      centerY: photoY + photoHeight / 2,
    },
    nameplate: { y: nameplateY, height: nameplateHeight, width: width - Math.round(120 * scale), centerX: width / 2 },
    message: { y: messageY, height: messageHeight, width: width - Math.round(140 * scale), centerX: width / 2 },
    foundation: { y: foundationY, height: foundationHeight, width, centerX: width / 2 },
  };
}

/**
 * Grand Header: 100-Year Milestone Crown, TIPU Emblem, and Centenary Heading.
 */
function drawGrandHeader(
  ctx: CanvasRenderingContext2D,
  headerZone: { y: number; height: number; width: number; centerX: number },
  scale: number,
  campaign: CampaignConfig,
  template: CelebrationTemplate,
  logoImage: HTMLImageElement | null
) {
  const { centerX, y } = headerZone;
  let currentY = y;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 1. Official Logo Emblem in Gold Filigree Roundel
  const logoSize = Math.round(68 * scale);
  if (logoImage) {
    ctx.save();
    // Glowing Outer Halo
    ctx.shadowColor = "rgba(212, 167, 44, 0.8)";
    ctx.shadowBlur = 14 * scale;

    ctx.beginPath();
    ctx.arc(centerX, currentY + logoSize / 2, logoSize / 2 + 5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.lineWidth = Math.max(2, Math.round(3.5 * scale));
    ctx.strokeStyle = "#d4a72c";
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.clip();
    ctx.drawImage(logoImage, centerX - logoSize / 2, currentY, logoSize, logoSize);
    ctx.restore();
  }

  currentY += logoSize + Math.round(18 * scale);

  // 2. 100-YEAR CENTENARY CROWN BANNER (Major Visual Element)
  const ribbonWidth = Math.round(480 * scale);
  const ribbonHeight = Math.round(32 * scale);
  const ribbonY = currentY - ribbonHeight / 2;

  // Gold Ribbon Background
  const ribbonGrad = ctx.createLinearGradient(centerX - ribbonWidth / 2, 0, centerX + ribbonWidth / 2, 0);
  ribbonGrad.addColorStop(0, "rgba(212, 167, 44, 0)");
  ribbonGrad.addColorStop(0.2, "#d4a72c");
  ribbonGrad.addColorStop(0.5, "#fae39b");
  ribbonGrad.addColorStop(0.8, "#d4a72c");
  ribbonGrad.addColorStop(1, "rgba(212, 167, 44, 0)");

  ctx.fillStyle = ribbonGrad;
  ctx.fillRect(centerX - ribbonWidth / 2, ribbonY, ribbonWidth, ribbonHeight);

  // Centennial Ribbon Text
  ctx.font = `900 ${Math.round(16 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#1b0730";
  ctx.letterSpacing = `${Math.round(3 * scale)}px`;
  ctx.fillText("★  100TH CENTENARY ANNIVERSARY (1926 – 2026)  ★", centerX, currentY);

  currentY += Math.round(26 * scale);

  // 3. Main Centenary Title (Commanding & Prominent)
  ctx.font = `900 ${Math.round(26 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
  ctx.shadowBlur = 10 * scale;
  ctx.letterSpacing = `${Math.round(1.5 * scale)}px`;
  ctx.fillText("TAKETE-IDE DAY & CENTENARY CELEBRATION", centerX, currentY);
  ctx.shadowBlur = 0;

  currentY += Math.round(22 * scale);

  // 4. Event Dates & Venue Badge
  const dateText = `${campaign.eventDates} · TAKETE-IDE, KOGI STATE`;
  ctx.font = `bold ${Math.round(12.5 * scale)}px Inter, -apple-system, sans-serif`;

  const dateWidth = ctx.measureText(dateText).width;
  const pillPadding = 18 * scale;
  const pillHeight = 24 * scale;

  ctx.fillStyle = "rgba(36, 92, 58, 0.7)"; // Community Green
  ctx.strokeStyle = "#e8c766";
  ctx.lineWidth = 1.5 * scale;
  roundRect(
    ctx,
    centerX - dateWidth / 2 - pillPadding,
    currentY - pillHeight / 2,
    dateWidth + pillPadding * 2,
    pillHeight,
    12 * scale
  );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fff9ef";
  ctx.fillText(dateText, centerX, currentY);

  ctx.restore();
}

/**
 * Grand Framed Photograph (Enlarged 30–45% with Gold Bevels and Ornaments).
 */
function drawGrandPhoto(
  ctx: CanvasRenderingContext2D,
  photoArea: { x: number; y: number; width: number; height: number; centerX: number; centerY: number },
  template: CelebrationTemplate,
  photoImage: HTMLImageElement | null,
  photoAdjustments: PhotoAdjustments,
  scale: number,
  personalisation: PersonalisationData
) {
  const { x, y, width, height, centerX, centerY } = photoArea;
  const shape = template.photoConfig.shape;
  const goldBorderWidth = Math.round(8 * scale);
  const accentGold = template.accentColor || "#d4a72c";

  ctx.save();

  // 1. Deep Radial Drop Shadow Behind Frame
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = Math.round(24 * scale);
  ctx.shadowOffsetY = Math.round(8 * scale);

  // Dark Velvet Canvas Base
  ctx.fillStyle = "#170827";
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.fill();
  ctx.restore();

  // 2. Render Uploaded Photo (Clipped with Pan/Zoom/Rotate/Filter)
  ctx.save();
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.clip();

  if (photoImage) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Apply Pan Offsets
    const panOffsetX = (photoAdjustments.panX / 100) * (width * 0.5);
    const panOffsetY = (photoAdjustments.panY / 100) * (height * 0.5);
    ctx.translate(panOffsetX, panOffsetY);

    // Apply Rotation
    ctx.rotate((photoAdjustments.rotation * Math.PI) / 180);

    // Apply Zoom
    const zoom = Math.max(1, photoAdjustments.zoom);

    // Calculate Aspect Cover
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

    // Apply Filters
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
    // High-Fidelity Dignified Placeholder
    const phGrad = ctx.createLinearGradient(x, y, x, y + height);
    phGrad.addColorStop(0, "rgba(50, 19, 87, 0.8)");
    phGrad.addColorStop(1, "rgba(23, 10, 41, 0.95)");
    ctx.fillStyle = phGrad;
    ctx.fillRect(x, y, width, height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.round(18 * scale)}px "Playfair Display", Georgia, serif`;
    ctx.fillStyle = "#e8c766";
    ctx.fillText("YOUR PHOTOGRAPH HERE", centerX, centerY - 14 * scale);

    ctx.font = `italic 500 ${Math.round(13 * scale)}px Inter, sans-serif`;
    ctx.fillStyle = "rgba(255, 249, 239, 0.75)";
    ctx.fillText("Upload in Step 2 of Celebration Studio", centerX, centerY + 14 * scale);
  }

  ctx.restore();

  // 3. Ornate Double Gold Foil Frame with Beveled Highlight
  ctx.save();
  ctx.lineWidth = goldBorderWidth;
  ctx.strokeStyle = accentGold;
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.stroke();

  // Inner Thin Light Highlight
  ctx.lineWidth = Math.max(1, Math.round(2 * scale));
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  clipPhotoShape(ctx, shape, x + 3 * scale, y + 3 * scale, width - 6 * scale, height - 6 * scale);
  ctx.stroke();

  // Outer Filigree Corner Clips (for rectangular frames)
  if (shape === "rounded-rect") {
    const cSize = Math.round(22 * scale);
    ctx.fillStyle = accentGold;
    // Top-left
    ctx.fillRect(x - 2 * scale, y - 2 * scale, cSize, 4 * scale);
    ctx.fillRect(x - 2 * scale, y - 2 * scale, 4 * scale, cSize);
    // Top-right
    ctx.fillRect(x + width - cSize + 2 * scale, y - 2 * scale, cSize, 4 * scale);
    ctx.fillRect(x + width - 2 * scale, y - 2 * scale, 4 * scale, cSize);
    // Bottom-left
    ctx.fillRect(x - 2 * scale, y + height - 2 * scale, cSize, 4 * scale);
    ctx.fillRect(x - 2 * scale, y + height - cSize + 2 * scale, 4 * scale, cSize);
    // Bottom-right
    ctx.fillRect(x + width - cSize + 2 * scale, y + height - 2 * scale, cSize, 4 * scale);
    ctx.fillRect(x + width - 2 * scale, y + height - cSize + 2 * scale, 4 * scale, cSize);
  }

  // Heritage Landmark Plaque (if Heritage Template)
  if (template.category === "heritage" || personalisation.customOptions?.backgroundPhoto) {
    const tagText = "TAKETE-IDE HERITAGE SCENERY";
    ctx.font = `bold ${Math.round(11 * scale)}px Inter, sans-serif`;
    const tagW = ctx.measureText(tagText).width + 16 * scale;
    ctx.fillStyle = "rgba(14, 5, 25, 0.85)";
    ctx.strokeStyle = "#d4a72c";
    ctx.lineWidth = 1;
    roundRect(ctx, centerX - tagW / 2, y + height - 16 * scale, tagW, 22 * scale, 6 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#e8c766";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tagText, centerX, y + height - 5 * scale);
  }

  ctx.restore();
}

/**
 * Structured Ceremonial Nameplate Plaque: Celebrant Name & Optional Title (Empty by Default).
 */
function drawStructuredNameplate(
  ctx: CanvasRenderingContext2D,
  nameplateZone: { y: number; height: number; width: number; centerX: number },
  scale: number,
  template: CelebrationTemplate,
  personalisation: PersonalisationData
) {
  const { centerX, y, width } = nameplateZone;
  let currentY = y;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 1. Salutation Banner
  const salutation = personalisation.greeting || template.defaultSalutation || "HAPPY CENTENARY CELEBRATION!";
  ctx.font = `italic 700 ${Math.round(15 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#e8c766";
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 4 * scale;
  ctx.fillText(salutation.toUpperCase(), centerX, currentY + 10 * scale);
  ctx.shadowBlur = 0;

  currentY += Math.round(28 * scale);

  // 2. Structured Nameplate Plaque (Velvet Dark with Gold Border)
  const displayName =
    template.category === "family"
      ? (personalisation.familyName || "The Daramola Family").trim()
      : (personalisation.name || "Chief Daramola Omoyele").trim();

  // Dynamic Font Size Clamping for Long Names
  let nameFontSize = Math.round(30 * scale);
  ctx.font = `900 ${nameFontSize}px "Playfair Display", Georgia, serif`;
  let nameMetrics = ctx.measureText(displayName).width;
  while (nameMetrics > width - 60 * scale && nameFontSize > 18 * scale) {
    nameFontSize -= 2;
    ctx.font = `900 ${nameFontSize}px "Playfair Display", Georgia, serif`;
    nameMetrics = ctx.measureText(displayName).width;
  }

  const plaqueW = Math.min(width, Math.max(nameMetrics + 60 * scale, 480 * scale));
  const plaqueH = Math.round(44 * scale);
  const plaqueY = currentY - plaqueH / 2;

  // Draw Plaque Card
  const plaqueGrad = ctx.createLinearGradient(centerX - plaqueW / 2, 0, centerX + plaqueW / 2, 0);
  plaqueGrad.addColorStop(0, "rgba(212, 167, 44, 0.1)");
  plaqueGrad.addColorStop(0.2, "rgba(35, 14, 60, 0.95)");
  plaqueGrad.addColorStop(0.5, "rgba(50, 19, 87, 0.98)");
  plaqueGrad.addColorStop(0.8, "rgba(35, 14, 60, 0.95)");
  plaqueGrad.addColorStop(1, "rgba(212, 167, 44, 0.1)");

  ctx.fillStyle = plaqueGrad;
  ctx.strokeStyle = "#d4a72c";
  ctx.lineWidth = 2 * scale;
  roundRect(ctx, centerX - plaqueW / 2, plaqueY, plaqueW, plaqueH, 8 * scale);
  ctx.fill();
  ctx.stroke();

  // Render Name
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = 8 * scale;
  ctx.fillText(displayName, centerX, currentY);
  ctx.shadowBlur = 0;

  currentY += Math.round(28 * scale);

  // 3. User-Entered Title / Role (DISPLAY ONLY IF ENTERED BY USER)
  const roleTitle = (personalisation.title || "").trim();
  if (roleTitle && template.category !== "family") {
    ctx.font = `bold ${Math.round(13 * scale)}px Inter, -apple-system, sans-serif`;
    ctx.fillStyle = "#e8c766";
    ctx.letterSpacing = `${Math.round(1.5 * scale)}px`;
    ctx.fillText(`◆  ${roleTitle.toUpperCase()}  ◆`, centerX, currentY);
    currentY += Math.round(18 * scale);
  }

  ctx.restore();
}

/**
 * Congratulatory Felicitation Message in an Ornamental Scroll Container.
 */
function drawCongratulatoryMessage(
  ctx: CanvasRenderingContext2D,
  messageZone: { y: number; height: number; width: number; centerX: number },
  scale: number,
  template: CelebrationTemplate,
  personalisation: PersonalisationData
) {
  const { centerX, y, width } = messageZone;
  const message = (personalisation.message || template.defaultMessage).trim();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const msgFontSize = Math.round(15 * scale);
  ctx.font = `500 ${msgFontSize}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#fff9ef";

  const maxLineWidth = width - 40 * scale;
  const lineHeight = Math.round(23 * scale);
  const lines = wrapText(ctx, `“${message}”`, maxLineWidth);

  const startY = y + 10 * scale;
  lines.slice(0, 4).forEach((line, idx) => {
    ctx.fillText(line, centerX, startY + idx * lineHeight);
  });

  ctx.restore();
}

/**
 * Grand Ceremonial Foundation Ribbon & Footer:
 * Replaces previous empty space with rich cultural mottos, event theme, and official credentials.
 */
function drawCeremonialFoundation(
  ctx: CanvasRenderingContext2D,
  foundationZone: { y: number; height: number; width: number; centerX: number },
  scale: number,
  campaign: CampaignConfig,
  template: CelebrationTemplate,
  personalisation: PersonalisationData
) {
  const { centerX, y, width } = foundationZone;
  let currentY = y;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 1. Cultural Expression / Motto Ribbon
  const expression =
    personalisation.localExpression ||
    personalisation.signOff ||
    template.defaultLocalExpression ||
    campaign.motto;

  const ribbonW = width - Math.round(160 * scale);
  const ribbonH = Math.round(34 * scale);

  const ribbonGrad = ctx.createLinearGradient(centerX - ribbonW / 2, 0, centerX + ribbonW / 2, 0);
  ribbonGrad.addColorStop(0, "rgba(212, 167, 44, 0.15)");
  ribbonGrad.addColorStop(0.25, "#d4a72c");
  ribbonGrad.addColorStop(0.5, "#fae39b");
  ribbonGrad.addColorStop(0.75, "#d4a72c");
  ribbonGrad.addColorStop(1, "rgba(212, 167, 44, 0.15)");

  ctx.fillStyle = ribbonGrad;
  roundRect(ctx, centerX - ribbonW / 2, currentY, ribbonW, ribbonH, 6 * scale);
  ctx.fill();

  ctx.font = `900 ${Math.round(14.5 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#1b0730";
  ctx.letterSpacing = `${Math.round(2 * scale)}px`;
  ctx.fillText(expression.toUpperCase(), centerX, currentY + ribbonH / 2);

  currentY += ribbonH + Math.round(16 * scale);

  // 2. Official Centenary Theme Pill
  const themeText = `THEME: ${campaign.theme}`;
  ctx.font = `bold ${Math.round(12 * scale)}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "#e8c766";
  ctx.fillText(themeText, centerX, currentY);

  currentY += Math.round(20 * scale);

  // 3. Official Civic Footer Credential
  ctx.font = `500 ${Math.round(11 * scale)}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText(
    `Takete-Ide Progressive Union (TIPU) · Centenary Celebration 2026 · takete-ide.org`,
    centerX,
    currentY
  );

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
