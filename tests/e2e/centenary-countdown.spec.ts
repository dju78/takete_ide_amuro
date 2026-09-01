import { test, expect } from "@playwright/test";
import {
  getLagosTimestamp,
  isSameDayInLagos,
  calculateTimeRemaining,
  getProgrammeCountdown,
  getNextCentenaryProgramme,
} from "@/lib/utils/centenary-countdown";
import type { CentenaryProgrammeItem } from "@/lib/media/community-programme";

const MOCK_PROGRAMMES: CentenaryProgrammeItem[] = [
  {
    id: "prog-day-1",
    title: "Centenary Opening & Heritage Programme",
    dayNumber: 1,
    dayLabel: "Day 1",
    date: "2026-10-29",
    dateLabel: "Thursday, 29 October 2026",
    venue: "UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State",
    confirmed: true,
    displayOrder: 1,
  },
  {
    id: "prog-day-2",
    title: "Centenary Cultural & Community Eve",
    dayNumber: 2,
    dayLabel: "Day 2",
    date: "2026-10-30",
    dateLabel: "Friday, 30 October 2026",
    startTime: "14:00",
    endTime: "18:00",
    timeLabel: "2:00 PM",
    venue: "UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State",
    confirmed: true,
    displayOrder: 2,
  },
  {
    id: "prog-day-3",
    title: "2026 Takete-Ide Day Centenary Celebration",
    dayNumber: 3,
    dayLabel: "Day 3 — Main Centenary Celebration",
    date: "2026-10-31",
    dateLabel: "Saturday, 31 October 2026",
    startTime: "10:00",
    endTime: "17:00",
    timeLabel: "10:00 AM Prompt",
    venue: "UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State",
    isGrandCelebration: true,
    confirmed: true,
    displayOrder: 3,
  },
];

test.describe("Centenary Timezone & Countdown Calculations", () => {
  test("getLagosTimestamp correctly sets UTC+1 offset", () => {
    const ts = getLagosTimestamp("2026-10-31", "10:00");
    const d = new Date(ts);
    // 10:00 AM in Lagos (UTC+1) is 09:00 AM UTC
    expect(d.toISOString()).toBe("2026-10-31T09:00:00.000Z");
  });

  test("calculateTimeRemaining never produces negative numbers", () => {
    const zero = calculateTimeRemaining(0);
    expect(zero.days).toBe(0);
    expect(zero.hours).toBe(0);
    expect(zero.minutes).toBe(0);
    expect(zero.seconds).toBe(0);

    const neg = calculateTimeRemaining(-50000);
    expect(neg.days).toBe(0);
    expect(neg.hours).toBe(0);
    expect(neg.minutes).toBe(0);
    expect(neg.seconds).toBe(0);
  });

  test("calculates exact days, hours, minutes, and seconds", () => {
    const diff = (5 * 86400 + 3 * 3600 + 15 * 60 + 42) * 1000;
    const res = calculateTimeRemaining(diff);
    expect(res.days).toBe(5);
    expect(res.hours).toBe(3);
    expect(res.minutes).toBe(15);
    expect(res.seconds).toBe(42);
  });

  test("programme without confirmed start time returns unconfirmed_time state", () => {
    const now = new Date("2026-09-01T12:00:00Z").getTime();
    const res = getProgrammeCountdown(MOCK_PROGRAMMES[0], now);
    expect(res.state).toBe("unconfirmed_time");
    expect(res.formattedRemaining).toBe("Schedule details to be confirmed");
  });

  test("event with confirmed startTime but NO endTime is NOT automatically completed after 8 hours", () => {
    const noEndTimeProgramme: CentenaryProgrammeItem = {
      id: "prog-no-end",
      title: "Centenary Gathering",
      dayNumber: 1,
      dayLabel: "Day 1",
      date: "2026-10-29",
      dateLabel: "Thursday, 29 October 2026",
      startTime: "10:00",
      venue: "UBE School Field, Takete-Ide, Mopamuro L.G.A., Kogi State",
      confirmed: true,
      displayOrder: 1,
    };

    // 8 hours after start (18:00 Lagos time -> 17:00 UTC)
    const eightHoursLater = new Date("2026-10-29T17:00:00Z").getTime();
    const res8 = getProgrammeCountdown(noEndTimeProgramme, eightHoursLater);
    expect(res8.state).toBe("happening_now");
    expect(res8.state).not.toBe("completed");
    expect(res8.formattedRemaining).toBe("Happening Now");

    // 14 hours after start (00:00 Lagos time next day -> 23:00 UTC)
    const fourteenHoursLater = new Date("2026-10-29T23:00:00Z").getTime();
    const res14 = getProgrammeCountdown(noEndTimeProgramme, fourteenHoursLater);
    expect(res14.state).toBe("happening_now");
    expect(res14.state).not.toBe("completed");

    // When explicitly marked completed via status
    const completedProgramme: CentenaryProgrammeItem = {
      ...noEndTimeProgramme,
      status: "completed",
    };
    const resCompleted = getProgrammeCountdown(completedProgramme, eightHoursLater);
    expect(resCompleted.state).toBe("completed");
    expect(resCompleted.formattedRemaining).toBe("Completed");
  });

  test("upcoming programme returns upcoming countdown state", () => {
    const now = new Date("2026-09-01T12:00:00Z").getTime();
    const res = getProgrammeCountdown(MOCK_PROGRAMMES[1], now);
    expect(res.state).toBe("upcoming");
    expect(res.formattedRemaining).toMatch(/Starts in \d+d \d+h \d+m \d+s/);
  });

  test("programme happening today before start time returns starting_today state", () => {
    // Oct 30, 2026 at 08:00 AM Lagos time (07:00 UTC), event starts at 14:00 Lagos time
    const now = new Date("2026-10-30T07:00:00Z").getTime();
    const res = getProgrammeCountdown(MOCK_PROGRAMMES[1], now);
    expect(res.state).toBe("starting_today");
    expect(res.formattedRemaining).toMatch(/Today · Starts in \d+h \d+m/);
  });

  test("programme during active hours returns happening_now state", () => {
    // Oct 30, 2026 at 15:00 Lagos time (14:00 UTC), event is 14:00 - 18:00
    const now = new Date("2026-10-30T14:00:00Z").getTime();
    const res = getProgrammeCountdown(MOCK_PROGRAMMES[1], now);
    expect(res.state).toBe("happening_now");
    expect(res.formattedRemaining).toMatch(/Ends in \d+h \d+m/);
  });

  test("programme after end time returns completed state", () => {
    // Oct 30, 2026 at 19:00 Lagos time (18:00 UTC)
    const now = new Date("2026-10-30T18:00:00Z").getTime();
    const res = getProgrammeCountdown(MOCK_PROGRAMMES[1], now);
    expect(res.state).toBe("completed");
    expect(res.formattedRemaining).toBe("Completed");
  });

  test("getNextCentenaryProgramme automatically advances to the next upcoming programme", () => {
    // Before Day 2
    const beforeDay2 = new Date("2026-09-01T12:00:00Z").getTime();
    const next1 = getNextCentenaryProgramme(MOCK_PROGRAMMES, beforeDay2);
    expect(next1.programme?.id).toBe("prog-day-2");
    expect(next1.isAllCompleted).toBe(false);

    // After Day 2 has ended, advances to Day 3
    const afterDay2 = new Date("2026-10-30T19:00:00Z").getTime();
    const next2 = getNextCentenaryProgramme(MOCK_PROGRAMMES, afterDay2);
    expect(next2.programme?.id).toBe("prog-day-3");
    expect(next2.isAllCompleted).toBe(false);

    // After Day 3 has ended, marks all completed
    const afterDay3 = new Date("2026-11-01T00:00:00Z").getTime();
    const next3 = getNextCentenaryProgramme(MOCK_PROGRAMMES, afterDay3);
    expect(next3.programme).toBeNull();
    expect(next3.isAllCompleted).toBe(true);
  });
});

test.describe("Centenary UI & Responsive Experience", () => {
  test("Centenary page renders complete hero, nav, programme, highlights and support", async ({ page }) => {
    await page.goto("/centenary");

    // Hero content
    await expect(page.getByText("TAKETE-IDE DAY & CENTENARY CELEBRATION 2026").first()).toBeVisible();
    await expect(page.getByText("29–31 October 2026").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Celebrating 100 Years of Heritage", level: 1 })).toBeVisible();
    await expect(page.getByText(/A historic celebration of Takete-Ide/i)).toBeVisible();
    await expect(page.getByText("Saturday, 31 October 2026").first()).toBeVisible();
    await expect(page.getByText(/UBE School Field/).first()).toBeVisible();
    await expect(page.getByText(/FAITH, UNITY AND PROGRESS/).first()).toBeVisible();

    // In-page navigation
    await expect(page.getByRole("navigation", { name: "Centenary sections" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Programme" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Highlights" })).toBeVisible();

    // Programme schedule cards: Day 1 and 2 display Programme details to be confirmed
    await expect(page.getByRole("heading", { name: "Centenary Programme" })).toBeVisible();
    await expect(page.locator("#programme").getByText("Thursday, 29 October 2026")).toBeVisible();
    await expect(page.locator("#programme").getByText("Friday, 30 October 2026")).toBeVisible();
    await expect(page.locator("#programme").getByText("Saturday, 31 October 2026")).toBeVisible();

    const unconfirmedNotices = await page.locator("#programme").getByText("Programme details to be confirmed").count();
    expect(unconfirmedNotices).toBe(2);

    await expect(page.locator("#programme").getByRole("heading", { name: "2026 Takete-Ide Day Centenary Celebration" })).toBeVisible();

    // Highlights
    await expect(page.getByRole("heading", { name: "Event Highlights" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cultural Display" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Awards & Recognitions" })).toBeVisible();

    // Support section without online checkout
    await expect(page.getByRole("heading", { name: "Support the Centenary" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Contribution Details" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Pay Online|Pay with Card/i })).toHaveCount(0);
  });

  for (const viewport of [
    { width: 320, height: 600, label: "320px mobile" },
    { width: 375, height: 667, label: "375px mobile" },
    { width: 768, height: 1024, label: "768px tablet" },
    { width: 1280, height: 800, label: "desktop" },
  ]) {
    test(`renders cleanly without horizontal overflow at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/centenary");

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});
