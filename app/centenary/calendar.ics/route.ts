import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";
import { getCentenary } from "@/lib/data/community-programme";

export async function GET() {
  const centenary = await getCentenary();

  // 3-day event starting 2026-10-29 through 2026-10-31 (exclusive end 2026-11-01 for all-day)
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Takete-Ide Progressive Union//Centenary 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Takete-Ide Centenary 2026",
    "X-WR-TIMEZONE:Africa/Lagos",
    "BEGIN:VEVENT",
    "UID:centenary-2026@takete-ide.org",
    "DTSTAMP:20260101T000000Z",
    "DTSTART;VALUE=DATE:20261029",
    "DTEND;VALUE=DATE:20261101",
    `SUMMARY:${centenary.title}`,
    `DESCRIPTION:${centenary.theme || centenary.intro} - More info: ${siteConfig.url}/centenary`,
    `LOCATION:${centenary.venue}, Takete-Ide, Kogi State, Nigeria`,
    `URL:${siteConfig.url}/centenary`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="takete-ide-centenary-2026.ics"',
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
