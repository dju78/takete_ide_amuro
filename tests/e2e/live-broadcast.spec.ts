import { test, expect, type Page } from "@playwright/test";
import {
  chatAvailable,
  facebookLinkKind,
  lagosLocalToInstant,
  instantToLagosLocal,
  normaliseVideoId,
  parseReplayLines,
  safePublicUrl,
  validateBroadcast,
  youtubeChatEmbedUrl,
  type PublicBroadcast,
} from "../../lib/live/broadcast";

/**
 * Centenary Live Broadcast Hub (/live).
 *
 * The real event has no video ID configured yet, so the page must show honest
 * fallbacks. The live/interrupted/ended states are exercised by intercepting the
 * public status endpoint the page polls — the same path a real status change
 * takes. The video ID used for those states is a placeholder that is never
 * shipped; no claim is made that any stream actually played.
 */

const FAKE_ID = "AbCdEfGhIjK";
const OFFICIAL_FACEBOOK = "https://www.facebook.com/profile.php?id=61595124084233";

function broadcast(overrides: Partial<PublicBroadcast> = {}): PublicBroadcast {
  return {
    title: "Takete-Ide Centenary Celebration — Live",
    videoId: FAKE_ID,
    status: "live",
    statusMessage: null,
    scheduledStart: null,
    chatEnabled: true,
    links: {
      youtube: "https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw",
      facebook: null,
      instagram: null,
      tiktok: null,
    },
    replays: [],
    updatedAt: null,
    ...overrides,
  };
}

/**
 * Serve a status from the polled endpoint and trigger an immediate poll.
 * Retries the trigger until the page has fetched it, because the listener only
 * exists once React has hydrated.
 */
async function pushStatus(page: Page, b: PublicBroadcast) {
  await page.unroute("**/api/live/status");
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

test.describe("Live configuration validation", () => {
  test("accepts public YouTube IDs and links", () => {
    expect(normaliseVideoId(FAKE_ID)).toBe(FAKE_ID);
    expect(normaliseVideoId(`https://www.youtube.com/watch?v=${FAKE_ID}&t=3`)).toBe(FAKE_ID);
    expect(normaliseVideoId(`https://youtu.be/${FAKE_ID}`)).toBe(FAKE_ID);
    expect(normaliseVideoId(`https://youtube.com/live/${FAKE_ID}?feature=share`)).toBe(FAKE_ID);
    expect(normaliseVideoId(`https://m.youtube.com/embed/${FAKE_ID}`)).toBe(FAKE_ID);
  });

  test("rejects invalid IDs, stream keys and management links", () => {
    expect(normaliseVideoId("")).toBeNull();
    expect(normaliseVideoId("short")).toBeNull();
    expect(normaliseVideoId("rtmp://a.rtmp.youtube.com/live2/abcd-efgh-ijkl-mnop")).toBeNull();
    expect(normaliseVideoId(`https://studio.youtube.com/video/${FAKE_ID}/livestreaming`)).toBeNull();
    expect(normaliseVideoId(`https://evil.example/watch?v=${FAKE_ID}`)).toBeNull();

    expect(safePublicUrl("https://www.facebook.com/SomePage", "facebook")).toBe("https://www.facebook.com/SomePage");
    expect(safePublicUrl("http://www.facebook.com/SomePage", "facebook")).toBeNull();
    expect(safePublicUrl("https://www.facebook.com/live/producer/123", "facebook")).toBeNull();
    expect(safePublicUrl("https://www.facebook.com/x?stream_key=FB-123", "facebook")).toBeNull();
    expect(safePublicUrl("https://www.youtube.com/channel/x", "facebook")).toBeNull();

    // The confirmed official profile.php?id= address is accepted with its id intact…
    expect(safePublicUrl(OFFICIAL_FACEBOOK, "facebook")).toBe(OFFICIAL_FACEBOOK);
    expect(new URL(safePublicUrl(OFFICIAL_FACEBOOK, "facebook")!).searchParams.get("id")).toBe("61595124084233");
    expect(safePublicUrl("https://m.facebook.com/profile.php?id=61595124084233", "facebook")).not.toBeNull();
    // …but look-alike hosts, credentials and management pages are not.
    expect(safePublicUrl("https://facebook.com.evil.example/profile.php?id=61595124084233", "facebook")).toBeNull();
    expect(safePublicUrl("https://evilfacebook.com/profile.php?id=61595124084233", "facebook")).toBeNull();
    expect(safePublicUrl("https://user:pw@www.facebook.com/profile.php?id=1", "facebook")).toBeNull();
    expect(safePublicUrl("https://business.facebook.com/latest/home", "facebook")).toBeNull();
    expect(safePublicUrl("https://www.facebook.com/professional_dashboard", "facebook")).toBeNull();
    expect(safePublicUrl("https://www.facebook.com/settings?tab=security", "facebook")).toBeNull();
    expect(safePublicUrl("https://www.facebook.com/profile.php?id=1&access_token=abc", "facebook")).toBeNull();

    // A Page/profile address is labelled as a page; only real video links say "watch".
    expect(facebookLinkKind(OFFICIAL_FACEBOOK)).toBe("page");
    expect(facebookLinkKind("https://www.facebook.com/somepage/videos/123")).toBe("video");
    expect(facebookLinkKind("https://fb.watch/abc123/")).toBe("video");
    expect(safePublicUrl("javascript:alert(1)", "youtube")).toBeNull();
  });

  test("invalid configuration falls back safely and reports issues", () => {
    const { broadcast: b, issues } = validateBroadcast(
      {
        videoId: "not a video",
        status: "streaming",
        scheduledStart: "2026-10-31 10:00",
        facebookUrl: "rtmps://live-api-s.facebook.com:443/rtmp/FB-secret",
        replays: [{ title: "", video: "x" }],
      },
      "file",
    );
    expect(b.videoId).toBeNull();
    expect(b.status).toBe("scheduled");
    expect(b.scheduledStart).toBeNull();
    expect(b.links.facebook).toBeNull();
    expect(b.links.youtube).toBe("https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw");
    expect(b.replays).toHaveLength(0);
    expect(issues.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(b)).not.toContain("FB-secret");
  });

  test("Lagos time conversion and replay parsing", () => {
    expect(lagosLocalToInstant("2026-10-31T10:00")).toBe("2026-10-31T09:00:00.000Z");
    expect(instantToLagosLocal("2026-10-31T09:00:00.000Z")).toBe("2026-10-31T10:00");
    expect(lagosLocalToInstant("31/10/2026")).toBeNull();

    const replays = parseReplayLines(`Opening | 1 | https://youtu.be/${FAKE_ID}\nThanksgiving | https://www.facebook.com/page/videos/1\n\n`);
    expect(replays).toEqual([
      { id: "replay-1", title: "Opening", dayNumber: 1, video: `https://youtu.be/${FAKE_ID}` },
      { id: "replay-2", title: "Thanksgiving", dayNumber: null, video: "https://www.facebook.com/page/videos/1" },
    ]);
    const { broadcast: b } = validateBroadcast({ replays }, "file");
    expect(b.replays[0]).toMatchObject({ videoId: FAKE_ID, dayNumber: 1 });
    expect(b.replays[1]).toMatchObject({ videoId: null, url: "https://www.facebook.com/page/videos/1" });
  });

  test("chat embed uses the page hostname and only opens while live", () => {
    expect(youtubeChatEmbedUrl(FAKE_ID, "takete-ide.org")).toBe(
      `https://www.youtube.com/live_chat?v=${FAKE_ID}&embed_domain=takete-ide.org`,
    );
    expect(youtubeChatEmbedUrl(FAKE_ID, "deploy-preview-18--takete.netlify.app")).toContain(
      "embed_domain=deploy-preview-18--takete.netlify.app",
    );
    expect(chatAvailable({ videoId: FAKE_ID, status: "live", chatEnabled: true })).toBe(true);
    expect(chatAvailable({ videoId: FAKE_ID, status: "interrupted", chatEnabled: true })).toBe(true);
    expect(chatAvailable({ videoId: FAKE_ID, status: "scheduled", chatEnabled: true })).toBe(false);
    expect(chatAvailable({ videoId: FAKE_ID, status: "ended", chatEnabled: true })).toBe(false);
    expect(chatAvailable({ videoId: FAKE_ID, status: "live", chatEnabled: false })).toBe(false);
    expect(chatAvailable({ videoId: null, status: "live", chatEnabled: true })).toBe(false);
  });
});

test.describe("/live page — unconfigured broadcast", () => {
  test("shows heading, dates, timezone and honest fallbacks", async ({ page }) => {
    const response = await page.goto("/live");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "Takete-Ide Centenary Celebration — Live" })).toBeVisible();
    await expect(page.getByText("29–31 October 2026").first()).toBeVisible();
    await expect(page.getByText("West Africa Time (WAT, UTC+1) — Africa/Lagos").first()).toBeVisible();

    await expect(page.getByTestId("broadcast-status")).toHaveAttribute("data-status", "scheduled");
    await expect(page.getByTestId("player-fallback")).toBeVisible();
    // No YouTube player is embedded until a video is configured. (Other hosts may
    // inject their own frames, e.g. Netlify's review drawer on deploy previews.)
    await expect(page.locator('iframe[src*="youtube"]')).toHaveCount(0);
    await expect(page.getByText(/start time will be announced/i)).toBeVisible();

    await expect(page.getByRole("link", { name: /Watch on YouTube/ })).toHaveAttribute(
      "href",
      "https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw",
    );
    // Confirmed official Facebook page — labelled as the page, not as a stream.
    const facebook = page.getByTestId("facebook-link");
    await expect(facebook).toHaveAttribute("href", OFFICIAL_FACEBOOK);
    await expect(facebook).toHaveAttribute("target", "_blank");
    await expect(facebook).toHaveAttribute("rel", /noopener/);
    await expect(facebook).toContainText("Takete-Ide on Facebook");
    await expect(page.getByRole("link", { name: /Watch on Facebook/ })).toHaveCount(0);
    await expect(page.getByTestId("facebook-note")).toContainText("official Takete-Ide Facebook page");
    // Confirmed Instagram profile is linked and labelled as a profile; unconfirmed TikTok stays hidden.
    await expect(page.getByRole("link", { name: /Takete-Ide on Instagram/ })).toHaveAttribute(
      "href",
      "https://www.instagram.com/taketeideofficial/",
    );
    await expect(page.getByRole("link", { name: /TikTok/ })).toHaveCount(0);
  });

  test("lists all three programme days with WAT labelling and no invented times", async ({ page }) => {
    await page.goto("/live");
    for (const day of [1, 2, 3]) await expect(page.getByTestId(`programme-day-${day}`)).toBeVisible();
    await expect(page.getByTestId("programme-day-1")).toContainText("29 October 2026");
    await expect(page.getByTestId("programme-day-2")).toContainText("30 October 2026");
    await expect(page.getByTestId("programme-day-3")).toContainText("31 October 2026");
    await expect(page.getByText("All times are West Africa Time (WAT, UTC+1) — Africa/Lagos.")).toBeVisible();
    await expect(page.getByText("Session times to be announced").first()).toBeVisible();
  });

  test("replays section shows an empty state", async ({ page }) => {
    await page.goto("/live");
    await expect(page.getByRole("heading", { name: "Replays" })).toBeVisible();
    await expect(page.getByTestId("replays-empty")).toBeVisible();
  });

  test("sharing: WhatsApp link and copy link", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/live");
    const wa = page.getByRole("link", { name: /Share on WhatsApp/ });
    const href = await wa.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/\?text=/);
    expect(decodeURIComponent(href!.split("text=")[1])).toContain("https://takete-ide.org/live");

    await page.getByRole("button", { name: "Copy link" }).click();
    await expect(page.getByRole("button", { name: "Link copied" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("https://takete-ide.org/live");
  });

  test("copy link falls back to selectable text when the clipboard is blocked", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: () => Promise.reject(new Error("blocked")) },
        configurable: true,
      });
    });
    await page.goto("/live");
    await page.getByRole("button", { name: "Copy link" }).click();
    await expect(page.getByText(/Copying is blocked in this browser/)).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Copying is blocked/ })).toBeFocused();
  });

  test("links to the Celebration Studio", async ({ page }) => {
    await page.goto("/live");
    await page.getByRole("link", { name: "Open the Celebration Studio" }).click();
    await expect(page).toHaveURL(/\/celebration-studio$/);
  });

  test("sends a scoped Content Security Policy that allows only YouTube frames", async ({ request }) => {
    const res = await request.get("/live");
    const csp = res.headers()["content-security-policy"] ?? "";
    expect(csp).toContain("frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(res.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });

  test("status API exposes only public fields", async ({ request }) => {
    const res = await request.get("/api/live/status");
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.status).toBe("scheduled");
    expect(body).not.toHaveProperty("source");
    expect(Object.keys(body).sort()).toEqual(
      ["chatEnabled", "links", "replays", "scheduledStart", "status", "statusMessage", "title", "updatedAt", "videoId"].sort(),
    );
    expect(body.links.facebook).toBe(OFFICIAL_FACEBOOK);
    expect(body.links.instagram).toBe("https://www.instagram.com/taketeideofficial/");
    expect(body.links.tiktok).toBeNull();
    expect(JSON.stringify(body)).not.toMatch(/rtmp|stream_?key|token|password|supabase/i);
  });

  test("share metadata points at production with the invitation image", async ({ page }) => {
    await page.goto("/live");
    await expect(page).toHaveTitle(/Takete-Ide Centenary Celebration — Live/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://takete-ide.org/live");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://takete-ide.org/live");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /29–31 October 2026/);
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toBe("https://takete-ide.org/images/takete-ide/centenary-invitation.jpg");
    const img = await page.request.get("/images/takete-ide/centenary-invitation.jpg");
    expect(img.ok()).toBe(true);
    expect(img.headers()["content-type"]).toContain("image/jpeg");
  });

  test("header menu and footer link to /live", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 }); // desktop mega-menu breakpoint
    await page.goto("/");
    await expect(page.locator('footer a[href="/live"]')).toHaveText("Watch Live");
    // Desktop menus open on hover (a click on the heading toggles it closed again).
    await page.locator("header").getByRole("button", { name: /Centenary 2026/ }).first().hover();
    await page.locator('header a[href="/live"]').first().click();
    await expect(page).toHaveURL(/\/live$/);
    await expect(page.getByRole("heading", { level: 1, name: "Takete-Ide Centenary Celebration — Live" })).toBeVisible();
  });

  test("is reachable from the Centenary page and navigation", async ({ page }) => {
    await page.goto("/centenary");
    await expect(page.locator('a[href="/live"]').first()).toBeAttached();
  });

  test("keyboard users can reach the main controls with visible focus", async ({ page }) => {
    await page.goto("/live");
    const reached = new Set<string>();
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press("Tab");
      const name = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.innerText?.trim() ?? "");
      if (name) reached.add(name.split("\n")[0]);
    }
    for (const label of ["Official YouTube channel", "Watch on YouTube", "Share on WhatsApp", "Copy link", "Open the Celebration Studio"]) {
      expect([...reached].some((r) => r.startsWith(label)), `Tab should reach "${label}"`).toBe(true);
    }
  });
});

test.describe("/live page — broadcast states (status endpoint mocked)", () => {
  test("live: player, embedded chat with embed_domain, sign-in guidance", async ({ page }) => {
    await page.goto("/live");
    await pushStatus(page, broadcast());
    await expect(page.getByTestId("broadcast-status")).toHaveAttribute("data-status", "live");

    const player = page.getByTestId("live-player");
    await expect(player).toHaveAttribute("src", new RegExp(`^https://www\\.youtube-nocookie\\.com/embed/${FAKE_ID}`));
    await expect(player).toHaveAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    await expect(player).toHaveAttribute("title", /YouTube video player/);

    // embed_domain must be the page's own hostname (production, preview or localhost).
    const hostname = new URL(page.url()).hostname;
    await expect(page.getByTestId("live-chat")).toHaveAttribute(
      "src",
      `https://www.youtube.com/live_chat?v=${FAKE_ID}&embed_domain=${hostname}`,
    );
    await expect(page.getByRole("link", { name: /Open chat on YouTube/ })).toHaveAttribute(
      "href",
      `https://www.youtube.com/live_chat?is_popout=1&v=${FAKE_ID}`,
    );
    await expect(page.getByText(/To post a message you must be signed in/)).toBeVisible();
    await expect(page.getByText(/Comments posted on Facebook are separate/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Watch on YouTube/ })).toHaveAttribute(
      "href",
      `https://www.youtube.com/watch?v=${FAKE_ID}`,
    );
  });

  test("interrupted: alert shown, player and chat kept", async ({ page }) => {
    await page.goto("/live");
    await pushStatus(page, broadcast({ status: "interrupted", statusMessage: "Restoring power at the venue." }));
    await expect(page.getByRole("alert").filter({ hasText: "temporarily interrupted" })).toBeVisible();
    await expect(page.getByText("Restoring power at the venue.")).toBeVisible();
    await expect(page.getByTestId("live-player")).toBeVisible();
    await expect(page.getByTestId("live-chat")).toBeVisible();
  });

  test("a specific Facebook video link is labelled 'Watch on Facebook'", async ({ page }) => {
    await page.goto("/live");
    const video = "https://www.facebook.com/somepage/videos/1234567890";
    await pushStatus(page, broadcast({ links: { ...broadcast().links, facebook: video } }));
    await expect(page.getByTestId("facebook-link")).toHaveAttribute("href", video);
    await expect(page.getByTestId("facebook-link")).toContainText("Watch on Facebook");
    await expect(page.getByTestId("facebook-note")).toHaveCount(0);
  });

  test("replays published after a session appear on open pages with working links", async ({ page }) => {
    await page.goto("/live");
    await expect(page.getByTestId("replays-empty")).toBeVisible();
    const fbVideo = "https://www.facebook.com/somepage/videos/1234567890";
    await pushStatus(
      page,
      broadcast({
        status: "ended",
        replays: [
          { id: "r1", title: "Day 1 — Opening", dayNumber: 1, videoId: FAKE_ID, url: null },
          { id: "r2", title: "Thanksgiving service", dayNumber: null, videoId: null, url: fbVideo },
        ],
      }),
    );
    const list = page.getByTestId("replay-list");
    await expect(list.getByRole("heading", { name: "Day 1 — Opening" })).toBeVisible();
    await expect(list).toContainText("29 October 2026");
    await expect(list.getByRole("link", { name: /Watch on YouTube/ })).toHaveAttribute("href", `https://www.youtube.com/watch?v=${FAKE_ID}`);
    await expect(list.getByRole("link", { name: /Watch on Facebook/ })).toHaveAttribute("href", fbVideo);
    await list.getByRole("button", { name: "Play recording: Day 1 — Opening" }).click();
    await expect(list.locator("iframe")).toHaveAttribute("src", new RegExp(`youtube-nocookie\.com/embed/${FAKE_ID}.*autoplay=1`));
  });

  test("ended: no chat, replay pointer shown", async ({ page }) => {
    await page.goto("/live");
    await pushStatus(page, broadcast({ status: "ended" }));
    await expect(page.getByTestId("broadcast-status")).toHaveAttribute("data-status", "ended");
    await expect(page.getByText("This broadcast has ended")).toBeVisible();
    await expect(page.getByTestId("live-chat")).toHaveCount(0);
  });

  test("scheduled with a start time shows WAT", async ({ page }) => {
    await page.goto("/live");
    await pushStatus(page, broadcast({ status: "scheduled", scheduledStart: "2026-10-31T09:00:00.000Z" }));
    await expect(page.getByTestId("scheduled-start")).toContainText("31 October 2026");
    await expect(page.getByTestId("scheduled-start")).toContainText("10:00");
    await expect(page.getByTestId("scheduled-start")).toContainText("WAT");
  });

  test("a changed video ID asks before switching streams", async ({ page }) => {
    await page.goto("/live");
    await pushStatus(page, broadcast());
    await expect(page.getByTestId("live-player")).toHaveAttribute("src", new RegExp(FAKE_ID));
    await pushStatus(page, broadcast({ videoId: "ZyXwVuTsRqP" }));
    await expect(page.getByTestId("live-player")).toHaveAttribute("src", new RegExp(FAKE_ID));
    await page.getByRole("button", { name: "Switch to the new stream" }).click();
    await expect(page.getByTestId("live-player")).toHaveAttribute("src", /ZyXwVuTsRqP/);
  });
});

test.describe("/live page — mobile", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

  test("no horizontal scroll; chat falls back to YouTube link", async ({ page }) => {
    await page.goto("/live");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    await pushStatus(page, broadcast());
    await expect(page.getByTestId("live-player")).toBeVisible();
    await expect(page.getByTestId("live-chat")).toHaveCount(0);
    await expect(page.getByTestId("chat-mobile-note")).toBeVisible();
    await expect(page.getByRole("link", { name: /Open chat on YouTube/ })).toHaveAttribute(
      "href",
      `https://www.youtube.com/watch?v=${FAKE_ID}`,
    );
    const after = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(after).toBeLessThanOrEqual(0);
  });
});
