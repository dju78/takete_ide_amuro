/**
 * Extracts a poster frame from each community video into
 * public/images/takete-ide/video-posters/.
 *
 * Posters matter for more than looks: with `preload="none"` on the players the
 * browser fetches no video bytes until someone presses play, so the poster is
 * the only thing that renders — without one the players would be black boxes.
 *
 * Run with: node scripts/extract-video-posters.mjs
 * Requires Google Chrome (Playwright's bundled Chromium has no H.264 decoder).
 * Re-run after adding a video; existing posters are overwritten.
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/images/takete-ide/video-posters");

/** `at` is a fraction of the clip's duration — picked to avoid fade-ins and black leader frames. */
const videos = [
  { file: "new-yam-ilorin-promo.mp4", at: 0.35 },
  { file: "new-yam-ilorin-award-presentation.mp4", at: 0.25 },
  { file: "community-at-work.mp4", at: 0.2 },
  { file: "king-palace-construction.mp4", at: 0.3 },
];

const MAX_WIDTH = 1280;
const QUALITY = 0.8;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
// Load a real same-origin page first: a video element on about:blank cannot fetch http:// media.
await page.goto("http://localhost:3000/");
mkdirSync(outDir, { recursive: true });

for (const { file, at } of videos) {
  const dataUrl = await page.evaluate(
    async ([src, fraction, maxWidth, quality]) => {
      const video = document.createElement("video");
      video.src = src;
      video.muted = true;
      video.crossOrigin = "anonymous";

      await new Promise((ok, fail) => {
        video.onloadedmetadata = ok;
        video.onerror = () => fail(new Error(`cannot load ${src}`));
      });
      await new Promise((ok, fail) => {
        video.onseeked = ok;
        video.onerror = () => fail(new Error(`cannot seek ${src}`));
        video.currentTime = Math.max(0.1, video.duration * fraction);
      });

      const scale = Math.min(1, maxWidth / video.videoWidth);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", quality);
    },
    [`http://localhost:3000/videos/takete-ide/${file}`, at, MAX_WIDTH, QUALITY],
  );

  const out = resolve(outDir, file.replace(/\.mp4$/, ".jpg"));
  const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
  writeFileSync(out, bytes);
  console.log(`${file} -> ${out} (${Math.round(bytes.length / 1024)} KB)`);
}

await browser.close();
