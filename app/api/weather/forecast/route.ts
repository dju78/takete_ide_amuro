import { NextResponse } from "next/server";
import { getForecast } from "@/lib/weather/service";

export async function GET() {
  const forecast = await getForecast();
  if (!forecast) {
    return NextResponse.json({ available: false }, { status: 503 });
  }
  return NextResponse.json({ available: true, forecast });
}
