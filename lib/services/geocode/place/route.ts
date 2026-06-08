import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("place_id");

  if (!placeId) {
    return NextResponse.json({ error: "Missing place_id" }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "geometry,formatted_address",
    key: API_KEY,
  });
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params}`);
  const data = await res.json();

  if (data.status !== "OK") {
    console.error("[geocode/place] Google status:", data.status, data.error_message);
    return NextResponse.json({ error: "Place not found" }, { status: 404 });
  }

  const location = data.result.geometry.location as { lat: number; lng: number };
  return NextResponse.json({
    formatted_address: data.result.formatted_address as string,
    lat: location.lat.toString(),
    lng: location.lng.toString(),
  });
}
