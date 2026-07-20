import * as Location from 'expo-location';

export type LatLng = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_MILES = 3958.8;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance in miles. */
export function milesBetween(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function isWithinMiles(origin: LatLng, point: LatLng, miles: number): boolean {
  return milesBetween(origin, point) <= miles;
}

/** Known demo place names → approximate coordinates. */
const PLACE_COORDS: Record<string, LatLng> = {
  'serengeti, tanzania, africa': { latitude: -2.3333, longitude: 34.8333 },
  'serengeti, tanzania': { latitude: -2.3333, longitude: 34.8333 },
  'tokyo, japan': { latitude: 35.6762, longitude: 139.6503 },
  'maasai mara, kenya': { latitude: -1.4061, longitude: 35.0117 },
  'new york, usa': { latitude: 40.7128, longitude: -74.006 },
  'kruger national park, south africa': { latitude: -23.9884, longitude: 31.5547 },
  'kruger, south africa': { latitude: -23.9884, longitude: 31.5547 },
  'amboseli, kenya': { latitude: -2.6527, longitude: 37.2606 },
  'okavango delta, botswana': { latitude: -19.2833, longitude: 22.7833 },
  'okavango, botswana': { latitude: -19.2833, longitude: 22.7833 },
  'chobe, botswana': { latitude: -17.8333, longitude: 25.1167 },
  'moremi, botswana': { latitude: -19.25, longitude: 23.35 },
  'savuti, botswana': { latitude: -18.5667, longitude: 24.0667 },
  'tsavo, kenya': { latitude: -2.9966, longitude: 38.4667 },
};

export function coordsFromPlaceLabel(label: string): LatLng | null {
  const key = label.trim().toLowerCase();
  if (!key) return null;
  if (PLACE_COORDS[key]) return PLACE_COORDS[key];
  // Fuzzy: match if known place is contained in label or vice versa
  for (const [place, coords] of Object.entries(PLACE_COORDS)) {
    if (key.includes(place) || place.includes(key)) return coords;
  }
  return null;
}

const geocodeCache = new Map<string, LatLng | null>();

export async function resolveCoords(
  label?: string | null,
  coords?: LatLng | null,
): Promise<LatLng | null> {
  if (coords?.latitude != null && coords?.longitude != null) {
    return coords;
  }
  if (!label?.trim()) return null;

  const known = coordsFromPlaceLabel(label);
  if (known) return known;

  const key = label.trim().toLowerCase();
  if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;

  try {
    const results = await Location.geocodeAsync(label.trim());
    const first = results[0];
    if (!first) {
      geocodeCache.set(key, null);
      return null;
    }
    const resolved = { latitude: first.latitude, longitude: first.longitude };
    geocodeCache.set(key, resolved);
    return resolved;
  } catch {
    geocodeCache.set(key, null);
    return null;
  }
}
