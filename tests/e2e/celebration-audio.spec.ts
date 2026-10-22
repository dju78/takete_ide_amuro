import { test, expect, type Page } from "@playwright/test";
import type { PublicBroadcast } from "../../lib/live/broadcast";

/**
 * Celebration audio on /live: a self-hosted MP3 beside the centenary poster
 * that plays only on request and never overlaps the YouTube broadcast.
 *
 * The broadcast state used to render a YouTube player is pushed through the
 * polled status endpoint with a placeholder video ID; YouTube itself is stubbed
 * so no real stream is contacted.
 */

const AUDIO_PATH = "/audio/centenary/takete-ide-centenary-celebration.mp3";
const AUDIO_BYTES = 2_625_052;
const VIDEO_PATH = "/videos/takete-ide/Takete_Ide_Centenary_Celebration_Audio.mp4";
const FAKE_ID = "AbCdEfGhIjK";

const audioState = (page: Page) =>
  page.getByTestId("celebration-audio-element").evaluate((el: HTMLAudioElement) => ({
    paused: el.paused,
    currentTime: el.currentTime,
    loop: el.loop,
    volume: el.volume,
    muted: el.muted,
    autoplay: el.autoplay,
  }));

async function expectPlaying(page: Page) {
  await expect.poll(async () => (await audioState(page)).paused, { timeout: 15_000 }).toBe(false);
  await expect.poll(async () => (await audioState(page)).currentTime, { timeout: 15_000 }).toBeGreaterThan(0);
}

async function pushLiveStatus(page: Page) {
  const b: PublicBroadcast = {
    title: "Takete-Ide Centenary Celebration — Live",
    videoId: FAKE_ID,
    status: "live",
    statusMessage: null,
    scheduledStart: null,
    chatEnabled: false,
    links: { youtube: "https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw", facebook: null, instagram: null, tiktok: null },
    replays: [],
    updatedAt: null,
  };
  let served = false;
  await page.route("**/api/live/status", (route) => {
    served = true;
    return route.fulfill({ json: b });
  });
  await expect(async () => {
    await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(served).toBe(true);
  }).toPass({ timeout: 15_000, intervals: [200, 500, 1000] });
}

test.describe("Celebration audio on /live", () => {
  test("is labelled, sits beside the poster and does not autoplay", async ({ page }) => {
    await page.goto("/live");
    await expect(page.getByRole("heading", { name: "Celebration audio — listen before the event." })).toBeVisible();
    await expect(page.getByTestId("celebration-poster")).toBeVisible();
    await expect(page.getByRole("button", { name: "Play celebration audio" })).toBeVisible();
    // Give any (forbidden) autoplay a chance to start before asserting.
    await page.waitForTimeout(1000);
    const state = await audioState(page);
    expect(state.autoplay).toBe(false);
    expect(state.paused).toBe(true);
    expect(state.currentTime).toBe(0);
  });

  test("keeps the scheduled broadcast status unchanged", async ({ page }) => {
    await page.goto("/live");
    await expect(page.getByTestId("broadcast-status")).toHaveAttribute("data-status", "scheduled");
  });

  test("serves the audio and MP4 as permanent same-origin assets", async ({ request }) => {
    const audio = await request.get(AUDIO_PATH);
    expect(audio.status()).toBe(200);
    expect(audio.headers()["content-type"]).toContain("audio/mpeg");
    expect((await audio.body()).length).toBe(AUDIO_BYTES);

    const video = await request.head(VIDEO_PATH);
    expect(video.status()).toBe(200);
    expect(video.headers()["content-type"]).toContain("video/mp4");
  });

  test("play/pause, progress, volume and repeat controls work", async ({ page }) => {
    await page.goto("/live");
    await page.getByRole("button", { name: "Play celebration audio" }).click();
    await expectPlaying(page);

    const progress = page.getByTestId("celebration-audio-progress");
    await expect(progress).toBeEnabled();
    await expect.poll(async () => Number(await progress.getAttribute("max"))).toBeGreaterThan(100);
    await progress.fill("60");
    await expect.poll(async () => (await audioState(page)).currentTime).toBeGreaterThanOrEqual(60);

    await page.getByTestId("celebration-audio-volume").fill("0.5");
    expect((await audioState(page)).volume).toBeCloseTo(0.5);
    await page.getByRole("button", { name: "Mute celebration audio" }).click();
    expect((await audioState(page)).muted).toBe(true);
    await expect(page.getByRole("button", { name: "Mute celebration audio" })).toHaveAttribute("aria-pressed", "true");

    const repeat = page.getByRole("button", { name: "Repeat celebration audio" });
    await repeat.click();
    await expect(repeat).toHaveAttribute("aria-pressed", "true");
    expect((await audioState(page)).loop).toBe(true);

    await page.getByRole("button", { name: "Pause celebration audio" }).click();
    await expect.poll(async () => (await audioState(page)).paused).toBe(true);
    await expect(page.getByRole("button", { name: "Play celebration audio" })).toBeVisible();
  });

  test("is fully keyboard operable", async ({ page }) => {
    await page.goto("/live");
    const play = page.getByRole("button", { name: "Play celebration audio" });
    await play.focus();
    await expect(play).toBeFocused();
    await page.keyboard.press("Enter");
    await expectPlaying(page);

    const pause = page.getByRole("button", { name: "Pause celebration audio" });
    await expect(pause).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("celebration-audio-progress")).toBeFocused();
    const before = (await audioState(page)).currentTime;
    await page.keyboard.press("End");
    await expect.poll(async () => (await audioState(page)).currentTime).toBeGreaterThan(before + 30);

    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Mute celebration audio" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("celebration-audio-volume")).toBeFocused();
    await page.keyboard.press("Home");
    expect((await audioState(page)).muted).toBe(true);
    await page.keyboard.press("Tab");
    const repeat = page.getByRole("button", { name: "Repeat celebration audio" });
    await expect(repeat).toBeFocused();
    await page.keyboard.press("Space");
    await expect(repeat).toHaveAttribute("aria-pressed", "true");

    await pause.focus();
    await page.keyboard.press("Space");
    await expect.poll(async () => (await audioState(page)).paused).toBe(true);
  });

  test("shows a clear message when the audio cannot be loaded", async ({ page }) => {
    await page.route(`**${AUDIO_PATH}`, (route) => route.fulfill({ status: 404, body: "" }));
    await page.goto("/live");
    await page.getByRole("button", { name: "Play celebration audio" }).click();
    const alert = page.getByTestId("celebration-audio-error");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("could not be loaded");
    await expect(alert.getByRole("link", { name: "open the audio file directly" })).toHaveAttribute("href", AUDIO_PATH);
    // The broadcast area is unaffected by the audio failure.
    await expect(page.getByTestId("broadcast-status")).toBeVisible();
  });

  test("pauses when the visitor starts the embedded YouTube player", async ({ page }) => {
    await page.route("https://www.youtube-nocookie.com/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "<!doctype html><button>Play video</button>" }),
    );
    await page.goto("/live");
    await pushLiveStatus(page);
    const player = page.getByTestId("live-player");
    await expect(player).toBeVisible();

    await page.getByRole("button", { name: "Play celebration audio" }).click();
    await expectPlaying(page);

    await page.frameLocator('[data-testid="live-player"]').getByRole("button", { name: "Play video" }).click();
    await expect.poll(async () => (await audioState(page)).paused).toBe(true);
    await expect(page.getByRole("button", { name: "Play celebration audio" })).toBeVisible();
  });

  test("plays on a phone-sized screen without horizontal scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/live");
    const play = page.getByRole("button", { name: "Play celebration audio" });
    await play.scrollIntoViewIfNeeded();
    await play.tap().catch(() => play.click());
    await expectPlaying(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
