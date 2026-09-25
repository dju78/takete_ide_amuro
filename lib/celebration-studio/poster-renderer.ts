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
 * High-performance 2D Canvas poster rendering engine.
 * Generates print-ready, high-resolution commemorative posters.
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

  // Scale factors relative to standard 1080x1350 canvas
  const scaleX = width / 1080;
  const scaleY = height / 1350;
  const scale = Math.min(scaleX, scaleY);

  // 1. Draw Background
  drawBackground(ctx, width, height, template, backgroundImage, personalisation);

  // 2. Draw Ornamental Ceremonial Borders
  drawCeremonialBorders(ctx, width, height, scale, template);

  // 3. Draw Header Section (Logo, Centenary Badge, Date, Theme)
  const headerBottomY = drawHeader(ctx, width, height, scale, campaign, template, logoImage);

  // 4. Calculate Dynamic Photo and Text Area Layouts based on aspect ratio
  const layout = calculateLayout(width, height, scale, template, headerBottomY);

  // 5. Draw Photo in Framed Safe Zone
  drawFramedPhoto(ctx, layout.photo, template, photoImage, photoAdjustments, scale);

  // 6. Draw Personalisation Typography (Name, Role, Message, Local Expression)
  drawPersonalisationText(ctx, layout.text, scale, template, campaign, personalisation);

  // 7. Draw Footer Banner & Official Credentials
  drawFooter(ctx, width, height, scale, campaign);

  // 8. Safe Area Overlay (Optional preview guide)
  if (showSafeAreas) {
    drawSafeAreaOverlay(ctx, width, height, scale);
  }
}

/**
 * Background rendering with ceremonial gradients and subtle motifs.
 */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  template: CelebrationTemplate,
  backgroundImage: HTMLImageElement | null,
  personalisation: PersonalisationData
) {
  // If custom or heritage template with background photo
  if (backgroundImage && (template.category === "heritage" || personalisation.customOptions?.backgroundPhoto)) {
    // Draw background image scaled to cover
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

    // Dark ceremonial gradient overlay for legibility
    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    overlay.addColorStop(0, "rgba(23, 10, 41, 0.88)");
    overlay.addColorStop(0.35, "rgba(35, 16, 61, 0.78)");
    overlay.addColorStop(0.7, "rgba(23, 10, 41, 0.90)");
    overlay.addColorStop(1, "rgba(15, 6, 26, 0.96)");

    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // Pure procedural ceremonial backgrounds
  const bgStyle = template.backgroundStyle;
  const grad = ctx.createRadialGradient(
    width / 2,
    height * 0.4,
    width * 0.1,
    width / 2,
    height / 2,
    width * 0.9
  );

  if (bgStyle === "heritage-green") {
    grad.addColorStop(0, "#286842");
    grad.addColorStop(0.5, "#1c4a2f");
    grad.addColorStop(1, "#0d2618");
  } else if (bgStyle === "royal-gold") {
    grad.addColorStop(0, "#421a6e");
    grad.addColorStop(0.5, "#281044");
    grad.addColorStop(1, "#12071f");
  } else {
    // Default Ceremonial Purple
    grad.addColorStop(0, "#3d186b");
    grad.addColorStop(0.5, "#2a0f49");
    grad.addColorStop(1, "#150624");
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle geometric cultural pattern
  ctx.save();
  ctx.strokeStyle = "rgba(212, 167, 44, 0.05)";
  ctx.lineWidth = 1;
  const step = 40;
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      if ((x + y) % (step * 2) === 0) {
        ctx.strokeRect(x, y, step * 0.6, step * 0.6);
      }
    }
  }
  ctx.restore();
}

/**
 * Ornamental gold trim and ceremonial corner borders.
 */
function drawCeremonialBorders(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  template: CelebrationTemplate
) {
  const margin = Math.round(28 * scale);
  const innerMargin = Math.round(38 * scale);
  const accentGold = template.accentColor || "#d4a72c";

  ctx.save();

  // Outer Gold Border
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = Math.max(2, Math.round(3 * scale));
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner Thin Border
  ctx.strokeStyle = "rgba(232, 199, 102, 0.5)";
  ctx.lineWidth = Math.max(1, Math.round(1.5 * scale));
  ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

  // Ornate Corner Accents
  const cornerSize = Math.round(36 * scale);
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
    ctx.lineTo(x + cornerSize * dx, y);
    ctx.lineTo(x + cornerSize * dx, y + 3 * dy * scale);
    ctx.lineTo(x + 3 * dx * scale, y + 3 * dy * scale);
    ctx.lineTo(x + 3 * dx * scale, y + cornerSize * dy);
    ctx.lineTo(x, y + cornerSize * dy);
    ctx.closePath();
    ctx.fill();

    // Small corner diamond
    ctx.beginPath();
    ctx.arc(x + 12 * dx * scale, y + 12 * dy * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Top header containing TIPU emblem, Centenary milestone banner, and event date.
 */
function drawHeader(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  campaign: CampaignConfig,
  template: CelebrationTemplate,
  logoImage: HTMLImageElement | null
): number {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = width / 2;
  let currentY = Math.round(58 * scale);

  // Logo Badge
  const logoSize = Math.round(76 * scale);
  if (logoImage) {
    ctx.save();
    // Gold ring around logo
    ctx.beginPath();
    ctx.arc(centerX, currentY + logoSize / 2, logoSize / 2 + 4 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = "#d4a72c";
    ctx.stroke();

    // Clip logo to circle
    ctx.beginPath();
    ctx.arc(centerX, currentY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoImage, centerX - logoSize / 2, currentY, logoSize, logoSize);
    ctx.restore();
  }

  currentY += logoSize + Math.round(20 * scale);

  // Centenary Milestone Eyebrow
  ctx.font = `bold ${Math.round(15 * scale)}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "#e8c766";
  ctx.letterSpacing = `${Math.round(2 * scale)}px`;
  ctx.fillText("TAKETE-IDE DAY & CENTENARY CELEBRATION", centerX, currentY);

  currentY += Math.round(26 * scale);

  // 100 YEARS / 1926 - 2026 Crown Banner
  ctx.font = `900 ${Math.round(32 * scale)}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 8 * scale;
  ctx.fillText("100 YEARS OF HERITAGE", centerX, currentY);
  ctx.shadowBlur = 0;

  currentY += Math.round(22 * scale);

  // Gold Pill with Dates & Theme
  const dateText = `${campaign.eventDates} · TAKETE-IDE, KOGI STATE`;
  ctx.font = `600 ${Math.round(13 * scale)}px Inter, -apple-system, sans-serif`;
  
  const textWidth = ctx.measureText(dateText).width;
  const pillPaddingX = 18 * scale;
  const pillHeight = 26 * scale;
  const pillY = currentY - pillHeight / 2;

  ctx.fillStyle = "rgba(212, 167, 44, 0.2)";
  ctx.strokeStyle = "rgba(232, 199, 102, 0.6)";
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, centerX - textWidth / 2 - pillPaddingX, pillY, textWidth + pillPaddingX * 2, pillHeight, 13 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fff9ef";
  ctx.fillText(dateText, centerX, currentY);

  ctx.restore();
  return currentY + Math.round(24 * scale);
}

/**
 * Calculates adaptive layouts depending on the poster aspect ratio (Square, Portrait, Story, Print).
 */
function calculateLayout(
  width: number,
  height: number,
  scale: number,
  template: CelebrationTemplate,
  headerBottomY: number
) {
  const isSquare = height === width;
  const isStory = height / width > 1.6;

  const photoSize = isSquare ? Math.round(360 * scale) : isStory ? Math.round(440 * scale) : Math.round(420 * scale);
  const photoY = headerBottomY + (isSquare ? 10 * scale : 20 * scale);
  let photoHeight = photoSize;

  if (template.photoConfig.shape === "arch") {
    photoHeight = Math.round(photoSize * 1.15);
  }

  const photoArea = {
    x: width / 2 - photoSize / 2,
    y: photoY,
    width: photoSize,
    height: photoHeight,
    centerX: width / 2,
    centerY: photoY + photoHeight / 2,
  };

  const textArea = {
    topY: photoY + photoHeight + Math.round(20 * scale),
    bottomY: height - Math.round(75 * scale),
    width: width - Math.round(140 * scale),
    centerX: width / 2,
  };

  return { photo: photoArea, text: textArea };
}

/**
 * Draws the celebrant's photograph inside a ceremonial gold frame with pan/zoom/rotation.
 */
function drawFramedPhoto(
  ctx: CanvasRenderingContext2D,
  photoArea: { x: number; y: number; width: number; height: number; centerX: number; centerY: number },
  template: CelebrationTemplate,
  photoImage: HTMLImageElement | null,
  photoAdjustments: PhotoAdjustments,
  scale: number
) {
  const { x, y, width, height, centerX, centerY } = photoArea;
  const shape = template.photoConfig.shape;
  const goldBorderWidth = Math.round((template.photoConfig.borderWidth || 6) * scale);
  const accentGold = template.accentColor || "#d4a72c";

  ctx.save();

  // Draw Photo Frame Shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = Math.round(18 * scale);
  ctx.shadowOffsetY = Math.round(6 * scale);

  // Background base for photo slot
  ctx.fillStyle = "#201235";
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.fill();
  ctx.restore();

  // Draw Photo Content (Clipped)
  ctx.save();
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.clip();

  if (photoImage) {
    ctx.save();
    // Center transformations
    ctx.translate(centerX, centerY);

    // Apply Pan offsets
    const panOffsetX = (photoAdjustments.panX / 100) * (width * 0.5);
    const panOffsetY = (photoAdjustments.panY / 100) * (height * 0.5);
    ctx.translate(panOffsetX, panOffsetY);

    // Apply Rotation
    ctx.rotate((photoAdjustments.rotation * Math.PI) / 180);

    // Apply Zoom
    const zoom = Math.max(1, photoAdjustments.zoom);

    // Calculate aspect fit
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

    // Apply color filter
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
    // Placeholder Graphic
    ctx.fillStyle = "rgba(255, 249, 239, 0.08)";
    ctx.fillRect(x, y, width, height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.round(14 * scale)}px Inter, sans-serif`;
    ctx.fillStyle = "rgba(232, 199, 102, 0.7)";
    ctx.fillText("YOUR PHOTOGRAPH HERE", centerX, centerY - 15 * scale);
    ctx.font = `italic ${Math.round(12 * scale)}px Inter, sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("Upload in Step 2", centerX, centerY + 15 * scale);
  }

  ctx.restore();

  // Draw Ornate Gold Border Around Frame
  ctx.save();
  ctx.lineWidth = goldBorderWidth;
  ctx.strokeStyle = accentGold;
  clipPhotoShape(ctx, shape, x, y, width, height);
  ctx.stroke();

  // Inner subtle light highlight
  ctx.lineWidth = Math.max(1, Math.round(1.5 * scale));
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  clipPhotoShape(ctx, shape, x + 3 * scale, y + 3 * scale, width - 6 * scale, height - 6 * scale);
  ctx.stroke();

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
    roundRect(ctx, x, y, w, h, Math.min(24, Math.round(w * 0.08)));
  }
}

/**
 * Renders celebrant name, title, personalized congratulatory message and local expression.
 */
function drawPersonalisationText(
  ctx: CanvasRenderingContext2D,
  textArea: { topY: number; bottomY: number; width: number; centerX: number },
  scale: number,
  template: CelebrationTemplate,
  campaign: CampaignConfig,
  personalisation: PersonalisationData
) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const { centerX, topY, width } = textArea;
  let currentY = topY + Math.round(14 * scale);

  // 1. Salutation / Greeting
  const greeting = personalisation.greeting || template.defaultSalutation || "Happy Centenary Celebration!";
  if (greeting) {
    ctx.font = `italic 600 ${Math.round(14 * scale)}px "Playfair Display", Georgia, serif`;
    ctx.fillStyle = "#e8c766";
    ctx.fillText(greeting.toUpperCase(), centerX, currentY);
    currentY += Math.round(24 * scale);
  }

  // 2. Celebrant Name or Family Name
  const displayName =
    template.category === "family"
      ? personalisation.familyName || "The Daramola Family"
      : personalisation.name || "Chief Daramola Omoyele";

  // Dynamic font sizing for long names
  let nameFontSize = Math.round(28 * scale);
  ctx.font = `bold ${nameFontSize}px "Playfair Display", Georgia, serif`;
  let nameWidth = ctx.measureText(displayName).width;
  while (nameWidth > width && nameFontSize > 18 * scale) {
    nameFontSize -= 2;
    ctx.font = `bold ${nameFontSize}px "Playfair Display", Georgia, serif`;
    nameWidth = ctx.measureText(displayName).width;
  }

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 6 * scale;
  ctx.fillText(displayName, centerX, currentY);
  ctx.shadowBlur = 0;
  currentY += Math.round(26 * scale);

  // 3. Title / Role (if applicable)
  const roleTitle = personalisation.title || template.defaultTitle;
  if (roleTitle && template.category !== "family") {
    ctx.font = `600 ${Math.round(13 * scale)}px Inter, sans-serif`;
    ctx.fillStyle = "#e8c766";
    ctx.fillText(roleTitle, centerX, currentY);
    currentY += Math.round(20 * scale);
  }

  // Thin decorative separator
  ctx.strokeStyle = "rgba(212, 167, 44, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 80 * scale, currentY);
  ctx.lineTo(centerX + 80 * scale, currentY);
  ctx.stroke();
  currentY += Math.round(16 * scale);

  // 4. Felicitation Message with Word Wrap
  const message = personalisation.message || template.defaultMessage;
  const msgFontSize = Math.round(14 * scale);
  ctx.font = `400 ${msgFontSize}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#fff9ef";

  const lineHeight = Math.round(22 * scale);
  const maxLines = 4;
  const lines = wrapText(ctx, `“${message}”`, width - 40 * scale);

  lines.slice(0, maxLines).forEach((line) => {
    ctx.fillText(line, centerX, currentY);
    currentY += lineHeight;
  });

  currentY += Math.round(10 * scale);

  // 5. Sign-off or Local Expression
  const expression =
    personalisation.localExpression ||
    personalisation.signOff ||
    template.defaultLocalExpression ||
    campaign.motto;

  if (expression) {
    ctx.font = `bold ${Math.round(12 * scale)}px Inter, sans-serif`;
    ctx.fillStyle = "#d4a72c";
    ctx.letterSpacing = `${Math.round(1.5 * scale)}px`;
    ctx.fillText(expression.toUpperCase(), centerX, currentY);
  }

  ctx.restore();
}

/**
 * Bottom official footer banner.
 */
function drawFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  campaign: CampaignConfig
) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = width / 2;
  const footerY = height - Math.round(38 * scale);

  ctx.font = `500 ${Math.round(11 * scale)}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillText(
    `Official Centenary Celebration · ${campaign.tagline} · takete-ide.org`,
    centerX,
    footerY
  );

  ctx.restore();
}

/**
 * Visual safe areas guide overlay.
 */
function drawSafeAreaOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number
) {
  const safeMargin = Math.round(60 * scale);
  ctx.save();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(safeMargin, safeMargin, width - safeMargin * 2, height - safeMargin * 2);

  ctx.font = `bold ${Math.round(11 * scale)}px monospace`;
  ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
  ctx.fillText("SAFE PRINT / SOCIAL ZONE", safeMargin + 10, safeMargin + 20);
  ctx.restore();
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
