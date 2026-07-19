import * as Location from 'expo-location';

type ExifLike = Record<string, unknown> | null | undefined;

function toSigned(value: number, ref: unknown): number {
  const southOrWest = ref === 'S' || ref === 'W';
  return southOrWest ? -Math.abs(value) : Math.abs(value);
}

/** Convert EXIF GPS DMS arrays [deg, min, sec] to decimal degrees. */
function dmsToDecimal(dms: unknown): number | null {
  if (!Array.isArray(dms) || dms.length < 1) {
    if (typeof dms === 'number' && Number.isFinite(dms)) return dms;
    return null;
  }
  const [deg, min = 0, sec = 0] = dms.map((n) => Number(n));
  if (![deg, min, sec].every((n) => Number.isFinite(n))) return null;
  return deg + min / 60 + sec / 3600;
}

export function coordsFromExif(exif: ExifLike): { latitude: number; longitude: number } | null {
  if (!exif) return null;

  // Common flat keys from iOS ImagePicker
  const flatLat = exif.GPSLatitude ?? exif.latitude ?? exif.Latitude;
  const flatLng = exif.GPSLongitude ?? exif.longitude ?? exif.Longitude;
  const latRef = exif.GPSLatitudeRef ?? exif.LatitudeRef;
  const lngRef = exif.GPSLongitudeRef ?? exif.LongitudeRef;

  let latitude = dmsToDecimal(flatLat);
  let longitude = dmsToDecimal(flatLng);

  // Nested GPS dict (some Android / library shapes)
  const gps = exif.GPS ?? exif.gps;
  if ((latitude == null || longitude == null) && gps && typeof gps === 'object') {
    const g = gps as Record<string, unknown>;
    latitude = dmsToDecimal(g.Latitude ?? g.GPSLatitude ?? g.latitude);
    longitude = dmsToDecimal(g.Longitude ?? g.GPSLongitude ?? g.longitude);
  }

  if (latitude == null || longitude == null) return null;

  latitude = toSigned(latitude, latRef);
  longitude = toSigned(longitude, lngRef);

  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return { latitude, longitude };
}

export async function placeNameFromCoords(
  latitude: number,
  longitude: number,
): Promise<string> {
  try {
    const places = await Location.reverseGeocodeAsync({ latitude, longitude });
    const p = places[0];
    if (!p) {
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
    const parts = [p.city ?? p.subregion ?? p.district, p.region, p.country].filter(
      Boolean,
    ) as string[];
    if (parts.length > 0) return parts.join(', ');
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

export async function locationLabelFromExif(exif: ExifLike): Promise<string> {
  const coords = coordsFromExif(exif);
  if (!coords) {
    return 'Location unavailable';
  }
  return placeNameFromCoords(coords.latitude, coords.longitude);
}
