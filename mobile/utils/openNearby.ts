import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { Router } from 'expo-router';

import { coordsFromPlaceLabel } from '@/utils/geo';

type LocationNavInput = {
  location: string;
  latitude?: number;
  longitude?: number;
};

/** Open the Nearby tab filtered to posts within 5 miles of this place. */
export function openNearbyFromLocation(router: Router, input: LocationNavInput) {
  const label = input.location.trim();
  if (!label && input.latitude == null) return;

  const known =
    input.latitude != null && input.longitude != null
      ? { latitude: input.latitude, longitude: input.longitude }
      : coordsFromPlaceLabel(label);

  const params: Record<string, string> = {};
  if (label) params.label = label;
  if (known) {
    params.lat = String(known.latitude);
    params.lng = String(known.longitude);
  }

  router.push({
    pathname: '/(app)/reels',
    params,
  } as Href);
}
