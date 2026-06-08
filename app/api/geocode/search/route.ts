import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json({ predictions: [] });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({ input, key: API_KEY });
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`);
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.error("[geocode/search] Google status:", data.status, data.error_message);
    return NextResponse.json({ predictions: [] });
  }

  type Prediction = { description: string; place_id: string };
  const predictions = (data.predictions ?? []).map((p: Prediction) => ({
    description: p.description,
    place_id: p.place_id,
  }));

  return NextResponse.json({ predictions });
}
