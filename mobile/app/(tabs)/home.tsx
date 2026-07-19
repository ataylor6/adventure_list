import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdventureCard } from '@/components/AdventureCard';
import type { AdventureCategory } from '@/constants/adventureFeed';
import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';

type ExploreFilter = 'all' | AdventureCategory;

const FILTERS: { id: ExploreFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', label: 'All', icon: 'globe-outline' },
  { id: 'nature', label: 'Nature', icon: 'leaf-outline' },
  { id: 'city', label: 'City', icon: 'business-outline' },
];

function LeafBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Ionicons name="leaf-outline" size={120} color="rgba(70, 90, 55, 0.10)" style={styles.leaf1} />
      <Ionicons name="leaf-outline" size={90} color="rgba(70, 90, 55, 0.08)" style={styles.leaf2} />
      <Ionicons name="leaf-outline" size={140} color="rgba(70, 90, 55, 0.09)" style={styles.leaf3} />
      <Ionicons name="leaf-outline" size={100} color="rgba(70, 90, 55, 0.07)" style={styles.leaf4} />
      <Ionicons name="leaf-outline" size={80} color="rgba(70, 90, 55, 0.08)" style={styles.leaf5} />
      <Ionicons name="leaf-outline" size={110} color="rgba(70, 90, 55, 0.06)" style={styles.leaf6} />
    </View>
  );
}

export default function HomeScreen() {
  const { posts, user } = useFeed();
  const [filter, setFilter] = useState<ExploreFilter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((p) => p.category === filter);
  }, [posts, filter]);

  return (
    <View style={styles.root}>
      <LeafBackdrop />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.filterBar}>
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilter(item.id)}
              >
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={active ? Colors.cream : Colors.text}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AdventureCard post={item} />}
          contentContainerStyle={[
            styles.list,
            filtered.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {posts.length === 0 ? 'Your feed is empty' : `No ${filter} adventures`}
              </Text>
              <Text style={styles.emptyBody}>
                {posts.length === 0
                  ? `Logged in as @${user.username}. Tap + to upload a photo.`
                  : 'Try another filter or add a new post.'}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safe: {
    flex: 1,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(247, 244, 238, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(60, 42, 30, 0.12)',
  },
  chipActive: {
    backgroundColor: Colors.card,
    borderColor: Colors.card,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  chipTextActive: {
    color: Colors.cream,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  leaf1: { position: 'absolute', top: 40, left: -20, transform: [{ rotate: '-25deg' }] },
  leaf2: { position: 'absolute', top: 180, right: -10, transform: [{ rotate: '40deg' }] },
  leaf3: { position: 'absolute', top: 420, left: -40, transform: [{ rotate: '15deg' }] },
  leaf4: { position: 'absolute', top: 620, right: 20, transform: [{ rotate: '-50deg' }] },
  leaf5: { position: 'absolute', top: 860, left: 30, transform: [{ rotate: '70deg' }] },
  leaf6: { position: 'absolute', top: 1080, right: -30, transform: [{ rotate: '-15deg' }] },
});
