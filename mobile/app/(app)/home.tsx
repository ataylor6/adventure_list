import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdventureCard } from '@/components/AdventureCard';
import {
  ADVENTURE_CATEGORIES,
  type AdventureCategory,
} from '@/constants/adventureFeed';
import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';

type ExploreFilter = 'all' | AdventureCategory;

const FILTERS: {
  id: ExploreFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'all', label: 'All', icon: 'globe-outline' },
  ...ADVENTURE_CATEGORIES,
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
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((p) => p.tags.includes(filter));
  }, [posts, filter]);

  const selected = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  const emptyLabel =
    filter === 'all'
      ? 'adventures'
      : selected.label.toLowerCase();

  const onPick = (id: ExploreFilter) => {
    setFilter(id);
    setMenuOpen(false);
  };

  return (
    <View style={styles.root}>
      <LeafBackdrop />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            style={styles.dropdownBtn}
            onPress={() => setMenuOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Filter adventures"
          >
            <Ionicons name={selected.icon} size={16} color={Colors.text} />
            <Text style={styles.dropdownLabel}>{selected.label}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.listWrap}>
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
                  {posts.length === 0 ? 'Your feed is empty' : `No ${emptyLabel} adventures`}
                </Text>
                <Text style={styles.emptyBody}>
                  {posts.length === 0
                    ? `Logged in as @${user.username}. Tap + to upload a photo.`
                    : 'Try another filter or add a new post.'}
                </Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <SafeAreaView edges={['top']} style={styles.menuSafe}>
            <Pressable style={styles.menuCard} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.menuTitle}>Filter by</Text>
              <ScrollView style={styles.menuList} bounces={false}>
                {FILTERS.map((item) => {
                  const active = filter === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.menuRow, active && styles.menuRowActive]}
                      onPress={() => onPick(item.id)}
                    >
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={active ? Colors.cream : Colors.text}
                      />
                      <Text style={[styles.menuRowText, active && styles.menuRowTextActive]}>
                        {item.label}
                      </Text>
                      {active ? (
                        <Ionicons name="checkmark" size={18} color={Colors.cream} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </SafeAreaView>
        </Pressable>
      </Modal>
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
  header: {
    height: 52,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    justifyContent: 'center',
  },
  dropdownBtn: {
    alignSelf: 'flex-start',
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
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  listWrap: {
    flex: 1,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    paddingTop: 48,
    paddingHorizontal: 36,
    alignItems: 'center',
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
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 16, 12, 0.35)',
  },
  menuSafe: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menuCard: {
    backgroundColor: '#F7F4EE',
    borderRadius: 16,
    padding: 12,
    maxHeight: '70%',
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
  menuList: {
    maxHeight: 420,
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
  leaf1: { position: 'absolute', top: 40, left: -20, transform: [{ rotate: '-25deg' }] },
  leaf2: { position: 'absolute', top: 180, right: -10, transform: [{ rotate: '40deg' }] },
  leaf3: { position: 'absolute', top: 420, left: -40, transform: [{ rotate: '15deg' }] },
  leaf4: { position: 'absolute', top: 620, right: 20, transform: [{ rotate: '-50deg' }] },
  leaf5: { position: 'absolute', top: 860, left: 30, transform: [{ rotate: '70deg' }] },
  leaf6: { position: 'absolute', top: 1080, right: -30, transform: [{ rotate: '-15deg' }] },
});
