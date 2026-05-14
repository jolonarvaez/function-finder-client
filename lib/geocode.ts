const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
    });

    const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
      headers: { "Accept-Language": "en" },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.display_name ?? null;
  } catch {
    return null;
  }
}

export type AddressSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  if (!query.trim()) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      limit: "5",
      addressdetails: "0",
    });

    const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: { "Accept-Language": "en" },
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
