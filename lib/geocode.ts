const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
    });

    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { "Accept-Language": "en" },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.display_name ?? null;
  } catch {
    return null;
  }
}
