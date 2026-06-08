export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.address ?? null;
  } catch {
    return null;
  }
}

export type AddressSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

export type PlacePrediction = {
  display_name: string;
  place_id: string;
};

export async function searchAddress(query: string): Promise<PlacePrediction[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`/api/geocode/search?input=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.predictions ?? []).map((p: { description: string; place_id: string }) => ({
      display_name: p.description,
      place_id: p.place_id,
    }));
  } catch {
    return [];
  }
}

export async function getPlaceDetails(placeId: string): Promise<AddressSuggestion | null> {
  try {
    const res = await fetch(`/api/geocode/place?place_id=${encodeURIComponent(placeId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      display_name: data.formatted_address,
      lat: data.lat,
      lon: data.lng,
    };
  } catch {
    return null;
  }
}
