import { test, expect } from "@playwright/test";

/**
 * Breadcrumb text must meet WCAG 2.2 AA contrast (4.5:1) wherever it is used —
 * on the ivory page background and on the purple hero banners alike.
 *
 * Contrast is measured from the rendered page: the text colour (including any
 * opacity) is composited over the real background behind it, walking up the
 * ancestors and taking the worst case of any gradient stops.
 */

const ROUTES = [
  "/accessibility", "/archive", "/archive/from-hilltops-to-the-valley", "/archive/oral-history",
  "/celebration-studio", "/centenary", "/centenary/celebration-studio", "/contact", "/cookies",
  "/development", "/development/community-at-work", "/development/settlement-progress",
  "/diaspora", "/diaspora/uk-europe", "/education", "/events", "/families", "/families/compounds",
  "/gallery", "/get-involved", "/heritage", "/heritage/agado", "/heritage/agbagba-ide",
  "/heritage/amuro-okun-context", "/heritage/ate", "/heritage/community-organisations",
  "/heritage/faith", "/heritage/faith/first-baptist-church", "/heritage/faith/manuscript-milestones",
  "/heritage/festivals", "/heritage/health-history", "/heritage/land-and-landscape",
  "/heritage/music-games", "/heritage/pacesetters", "/heritage/takete-ide-anthem",
  "/heritage/traditional-council", "/heritage/traditional-institution", "/heritage/traditional-marriage",
  "/kogi-quest", "/live", "/news", "/oriki", "/our-people", "/our-story", "/our-story/takete-tedo",
  "/privacy", "/search", "/support", "/support/payment/failed", "/support/payment/pending",
  "/support/payment/success", "/takete-ide-day", "/takete-ide-day/2025", "/takete-ide-day/cultural-attire",
  "/terms", "/tipu", "/tipu/branches", "/tipu/branches/ilorin", "/tipu/branches/lokoja", "/weather",
];

const MIN_RATIO = 4.5;

for (const route of ROUTES) {
  test(`breadcrumb contrast ≥ ${MIN_RATIO}:1 on ${route}`, async ({ page }) => {
    await page.goto(route);
    const nav = page.locator("nav[aria-label='Breadcrumb']").first();
    await expect(nav).toBeVisible();

    const results = await nav.evaluate((navEl) => {
      type RGBA = [number, number, number, number];

      const ctx = document.createElement("canvas").getContext("2d")!;
      // Canvas normalises any CSS colour syntax (rgb, oklab, color-mix…) to rgba.
      const parse = (css: string): RGBA => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b, a / 255];
      };
      const over = (top: RGBA, bottom: RGBA): RGBA => {
        const a = top[3] + bottom[3] * (1 - top[3]);
        if (a === 0) return [0, 0, 0, 0];
        const mix = (i: number) => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a;
        return [mix(0), mix(1), mix(2), a];
      };
      const luminance = ([r, g, b]: RGBA) => {
        const lin = (c: number) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      const ratio = (a: RGBA, b: RGBA) => {
        const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
        return (l1 + 0.05) / (l2 + 0.05);
      };

      /** Every possible background behind `el` (several when a gradient is involved). */
      const backgrounds = (el: Element): RGBA[] => {
        const layers: RGBA[][] = [];
        for (let node: Element | null = el; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          const stops = (style.backgroundImage.match(/(rgba?|oklab|oklch|color)\([^()]*(\([^()]*\)[^()]*)*\)/g) ?? []).map(parse);
          const colour = parse(style.backgroundColor);
          const options = stops.length ? stops.map((s) => over(s, colour)) : [colour];
          layers.push(options);
          if (options.every((o) => o[3] >= 0.999)) break;
        }
        let result: RGBA[] = [[255, 255, 255, 1]];
        for (const options of layers.reverse()) {
          result = result.flatMap((below) => options.map((o) => over(o, below)));
        }
        return result;
      };

      const opacity = (el: Element) => {
        let o = 1;
        for (let node: Element | null = el; node; node = node.parentElement) o *= Number(getComputedStyle(node).opacity);
        return o;
      };

      return [...navEl.querySelectorAll("a, [aria-current='page']")].map((el) => {
        const fg = parse(getComputedStyle(el).color);
        fg[3] *= opacity(el);
        const worst = Math.min(...backgrounds(el).map((bg) => ratio(over(fg, bg), bg)));
        return { text: (el as HTMLElement).innerText.trim(), ratio: Math.round(worst * 100) / 100 };
      });
    });

    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.ratio, `"${r.text}" on ${route} has contrast ${r.ratio}:1`).toBeGreaterThanOrEqual(MIN_RATIO);
    }
  });
}
