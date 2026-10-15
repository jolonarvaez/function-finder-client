import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
  }

  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (
    !Number.isFinite(latNum) ||
    !Number.isFinite(lngNum) ||
    latNum < -90 ||
    latNum > 90 ||
    lngNum < -180 ||
    lngNum > 180
  ) {
    return NextResponse.json({ error: "Invalid lat/lng" }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({ latlng: `${latNum},${lngNum}`, key: API_KEY });
  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
  const data = await res.json();

  if (data.status !== "OK" || !data.results?.length) {
    console.error("[geocode/reverse] Google status:", data.status, data.error_message);
    return NextResponse.json({ address: null });
  }

  return NextResponse.json({ address: data.results[0].formatted_address as string });
}
