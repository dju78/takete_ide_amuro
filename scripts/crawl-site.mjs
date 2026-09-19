import http from "node:http";
import https from "node:https";

const BASE_URL = process.env.TARGET_URL || "http://localhost:3000";

const SEED_ROUTES = [
  "/",
  "/heritage",
  "/heritage/faith",
  "/heritage/faith/first-baptist-church",
  "/heritage/faith/manuscript-milestones",
  "/our-story",
  "/our-story/takete-tedo",
  "/gallery",
  "/tipu",
  "/tipu/branches",
  "/tipu/branches/ilorin",
  "/tipu/branches/lokoja",
  "/development",
  "/development/community-at-work",
  "/development/settlement-progress",
  "/news",
  "/events",
  "/centenary",
  "/centenary/calendar.ics",
  "/diaspora",
  "/diaspora/uk-europe",
  "/support",
  "/support/payment/failed",
  "/support/payment/pending",
  "/support/payment/success",
  "/kogi-quest",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
  "/education",
  "/our-people",
  "/families",
  "/families/compounds",
  "/families/contribute",
  "/oriki",
  "/oriki/contribute",
  "/archive",
  "/archive/oral-history",
  "/archive/from-hilltops-to-the-valley",
  "/archive/takete-history-original",
  "/archive/takete-ide-day-2025-records",
  "/heritage/agado",
  "/heritage/agbagba-ide",
  "/heritage/amuro-okun-context",
  "/heritage/anthem",
  "/heritage/ate",
  "/heritage/community-organisations",
  "/heritage/festivals",
  "/heritage/health-history",
  "/heritage/land-and-landscape",
  "/heritage/music-games",
  "/heritage/pacesetters",
  "/heritage/takete-ide-anthem",
  "/heritage/traditional-council",
  "/heritage/traditional-institution",
  "/heritage/traditional-marriage",
  "/takete-ide-day",
  "/takete-ide-day/2025",
  "/takete-ide-day/2024",
  "/takete-ide-day/cultural-attire",
  "/get-involved",
  "/search",
  "/search?q=Ilorin",
  "/search?q=centenary&type=event",
  "/cookies",
  "/weather",
  "/robots.txt",
  "/sitemap.xml",
];

function fetchUrl(urlPath) {
  return new Promise((resolve) => {
    const fullUrl = new URL(urlPath, BASE_URL);
    const client = fullUrl.protocol === "https:" ? https : http;
    const req = client.get(fullUrl, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          error: null,
        });
      });
    });

    req.on("error", (err) => {
      resolve({
        path: urlPath,
        statusCode: 0,
        headers: {},
        body: "",
        error: err.message,
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        path: urlPath,
        statusCode: 408,
        headers: {},
        body: "",
        error: "Timeout",
      });
    });
  });
}

async function runCrawl() {
  console.log(`Starting full-site crawl against: ${BASE_URL}`);
  const results = [];
  const visited = new Set();
  const queue = [...SEED_ROUTES];

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    const res = await fetchUrl(current);
    results.push(res);
  }

  const http2xx = results.filter((r) => r.statusCode >= 200 && r.statusCode < 300);
  const redirects = results.filter((r) => r.statusCode >= 300 && r.statusCode < 400);
  const http4xx = results.filter((r) => r.statusCode >= 400 && r.statusCode < 500);
  const http5xx = results.filter((r) => r.statusCode >= 500);
  const queryUrls = results.filter((r) => r.path.includes("?"));
  const pathnameRoutes = results.filter((r) => !r.path.includes("?"));

  const summary = {
    baseUrl: BASE_URL,
    totalUrlsRequested: results.length,
    uniquePathnameRoutes: pathnameRoutes.length,
    queryUrls: queryUrls.length,
    http2xx: http2xx.length,
    redirects: redirects.length,
    http4xx: http4xx.length,
    http5xx: http5xx.length,
    failures: results.filter((r) => r.statusCode !== 200 && r.statusCode !== 308).map((r) => ({ path: r.path, code: r.statusCode, error: r.error })),
  };

  console.log("\n=== CRAWL REPORT SUMMARY ===");
  console.log(JSON.stringify(summary, null, 2));

  if (http4xx.length > 0 || http5xx.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runCrawl();
