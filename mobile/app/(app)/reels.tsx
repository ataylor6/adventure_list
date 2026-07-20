import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdventureCard } from '@/components/AdventureCard';
import type { AdventurePost } from '@/constants/adventureFeed';
import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';
import {
  coordsFromPlaceLabel,
  isWithinMiles,
  milesBetween,
  resolveCoords,
  type LatLng,
} from '@/utils/geo';

const RADIUS_OPTIONS = [5, 10, 15, 20] as const;
type RadiusMiles = (typeof RADIUS_OPTIONS)[number];

type NearbyPost = AdventurePost & { distanceMiles: number };

function postCoords(post: AdventurePost): LatLng | null {
  if (post.latitude != null && post.longitude != null) {
    return { latitude: post.latitude, longitude: post.longitude };
  }
  return coordsFromPlaceLabel(post.location);
}

export default function NearbyScreen() {
  const { posts } = useFeed();
  const params = useLocalSearchParams<{
    lat?: string;
    lng?: string;
    label?: string;
  }>();

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [label, setLabel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState<RadiusMiles>(5);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const lat = params.lat ? Number(params.lat) : NaN;
      const lng = params.lng ? Number(params.lng) : NaN;
      const paramLabel = typeof params.label === 'string' ? params.label : '';

      const fromParams =
        Number.isFinite(lat) && Number.isFinite(lng)
          ? { latitude: lat, longitude: lng }
          : null;

      const resolved = await resolveCoords(paramLabel || null, fromParams);
      if (cancelled) return;

      if (!resolved) {
        setOrigin(null);
        setLabel(paramLabel);
        setError(
          paramLabel
            ? `Couldn’t find coordinates for “${paramLabel}”.`
            : 'Tap a location on a photo to see nearby adventures.',
        );
        setLoading(false);
        return;
      }

      setOrigin(resolved);
      setLabel(paramLabel || `${resolved.latitude.toFixed(3)}, ${resolved.longitude.toFixed(3)}`);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params.lat, params.lng, params.label]);

  const nearby = useMemo(() => {
    if (!origin) return [] as NearbyPost[];

    const results: NearbyPost[] = [];
    for (const post of posts) {
      const point = postCoords(post);
      if (!point || !isWithinMiles(origin, point, radius)) continue;
      results.push({
        ...post,
        distanceMiles: milesBetween(origin, point),
      });
    }

    return results.sort((a, b) => a.distanceMiles - b.distanceMiles);
  }, [origin, posts, radius]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="location" size={18} color={Colors.card} />
            <Text style={styles.title}>Nearby</Text>
          </View>
          <Pressable
            style={styles.dropdownBtn}
            onPress={() => setMenuOpen(true)}
            accessibilityLabel="Choose search radius"
          >
            <Text style={styles.dropdownLabel}>{radius} mi</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
          </Pressable>
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>
          {label ? `Within ${radius} miles of ${label}` : `Places within ${radius} miles`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.card} />
          <Text style={styles.hint}>Finding nearby adventures…</Text>
        </View>
      ) : error && !origin ? (
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={nearby}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AdventureCard post={item} />}
          contentContainerStyle={[styles.list, nearby.length === 0 && styles.listEmpty]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No adventures within {radius} miles</Text>
              <Text style={styles.emptyBody}>
                Try a wider radius, another photo location, or upload a post near here.
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <SafeAreaView edges={['top']} style={styles.menuSafe}>
            <Pressable style={styles.menuCard} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.menuTitle}>Search radius</Text>
              {RADIUS_OPTIONS.map((miles) => {
                const active = radius === miles;
                return (
                  <Pressable
                    key={miles}
                    style={[styles.menuRow, active && styles.menuRowActive]}
                    onPress={() => {
                      setRadius(miles);
                      setMenuOpen(false);
                    }}
                  >
                    <Text style={[styles.menuRowText, active && styles.menuRowTextActive]}>
                      {miles} miles
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark" size={18} color={Colors.cream} />
                    ) : null}
                  </Pressable>
                );
              })}
            </Pressable>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    justifyContent: 'center',
    gap: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(247, 244, 238, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(60, 42, 30, 0.12)',
  },
  dropdownLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 12,
  },
  hint: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  empty: {
    paddingTop: 48,
    paddingHorizontal: 36,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 16, 12, 0.35)',
  },
  menuSafe: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  menuCard: {
    width: 200,
    backgroundColor: '#F7F4EE',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#1A140F',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  menuRowActive: {
    backgroundColor: Colors.card,
  },
  menuRowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  menuRowTextActive: {
    color: Colors.cream,
  },
});
