import { NextResponse } from "next/server";
import { getLiveBroadcast } from "@/lib/data/live-broadcast";
import { toPublicBroadcast } from "@/lib/live/broadcast";

/**
 * Public, read-only broadcast state polled by the /live page so viewers who
 * already have the page open see status changes (live → interrupted → ended)
 * without reloading. Contains only validated public viewing information.
 *
 * Short CDN caching keeps thousands of open pages from each hitting Supabase.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const broadcast = await getLiveBroadcast();
  return NextResponse.json(toPublicBroadcast(broadcast), {
    headers: {
      "Cache-Control": "public, max-age=15, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
