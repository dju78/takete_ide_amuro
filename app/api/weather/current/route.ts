import { NextResponse } from "next/server";
import { getCurrentWeather } from "@/lib/weather/service";

export async function GET() {
  const current = await getCurrentWeather();
  if (!current) {
    return NextResponse.json({ available: false }, { status: 503 });
  }
  return NextResponse.json({ available: true, current });
}
