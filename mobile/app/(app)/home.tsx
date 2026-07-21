import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type View as RNView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdventureCard } from '@/components/AdventureCard';
import {
  categoriesForMode,
  categoryMeta,
  type AdventureCategory,
} from '@/constants/adventureFeed';
import { Colors } from '@/constants/theme';
import { useExploreMode } from '@/context/ExploreModeContext';
import { useFeed } from '@/context/FeedContext';

type FeedScope = 'new' | 'friends';

const SCOPES: {
  id: FeedScope;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'new', label: 'New adventures', icon: 'sparkles-outline' },
  { id: 'friends', label: 'Friends', icon: 'people-outline' },
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
  const { posts, user, travelCompanions } = useFeed();
  const { mode } = useExploreMode();
  const [selectedTags, setSelectedTags] = useState<AdventureCategory[]>([]);
  const [scope, setScope] = useState<FeedScope>('new');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const dropdownRef = useRef<RNView>(null);

  const modeCategories = categoriesForMode(mode);

  useEffect(() => {
    setSelectedTags([]);
    setScope('new');
    setMenuOpen(false);
  }, [mode]);

  const openMenu = () => {
    dropdownRef.current?.measureInWindow((_x, y, _width, height) => {
      setMenuTop(y + height + 6);
      setMenuOpen(true);
    });
  };

  const filtered = useMemo(() => {
    const companionSet = new Set(travelCompanions.map((u) => u.toLowerCase()));
    return posts.filter((p) => {
      if ((p.feedMode ?? 'travel') !== mode) return false;
      if (scope === 'friends' && !companionSet.has(p.username.toLowerCase())) {
        return false;
      }
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => p.tags.includes(tag))
      ) {
        return false;
      }
      return true;
    });
  }, [posts, selectedTags, scope, travelCompanions, mode]);

  const categorySummary =
    selectedTags.length === 0
      ? 'All categories'
      : selectedTags.length === 1
        ? (categoryMeta(selectedTags[0])?.label ?? '1 category')
        : `${selectedTags.length} categories`;

  const emptyLabel =
    selectedTags.length === 0
      ? scope === 'friends'
        ? 'friend'
        : mode === 'local'
          ? 'local plans'
          : 'adventures'
      : selectedTags
          .map((id) => categoryMeta(id)?.label ?? id)
          .join(', ')
          .toLowerCase();

  const toggleTag = (id: AdventureCategory) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.root}>
      <LeafBackdrop />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.filters}>
          <View style={styles.modeTitleRow}>
            <Text style={styles.modeTitle}>{mode === 'local' ? 'Local' : 'Travel'}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scopeRow}
          >
            {SCOPES.map((item) => {
              const active = scope === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.scopeChip, active && styles.scopeChipActive]}
                  onPress={() => setScope(item.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={item.label}
                >
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={active ? Colors.cream : Colors.text}
                  />
                  <Text style={[styles.scopeLabel, active && styles.scopeLabelActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.categoryRow}>
            <Pressable
              ref={dropdownRef}
              style={styles.dropdownBtn}
              onPress={openMenu}
              accessibilityRole="button"
              accessibilityLabel="Filter by category"
            >
              <Ionicons name="options-outline" size={14} color={Colors.text} />
              <Text style={styles.dropdownLabel} numberOfLines={1}>
                {categorySummary}
              </Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
            </Pressable>
          </View>
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
                  {posts.length === 0
                    ? 'Your feed is empty'
                    : scope === 'friends' && travelCompanions.length === 0
                      ? 'No travel companions yet'
                      : `No ${emptyLabel}`}
                </Text>
                <Text style={styles.emptyBody}>
                  {posts.length === 0
                    ? `Logged in as @${user.username}. Tap + to upload a photo.`
                    : scope === 'friends' && travelCompanions.length === 0
                      ? 'Tap Travel with on someone’s profile to see their posts here.'
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
          <Pressable
            style={[styles.menuCard, { top: menuTop }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>
                {mode === 'local' ? 'Local categories' : 'Travel categories'}
              </Text>
              {selectedTags.length > 0 ? (
                <Pressable onPress={() => setSelectedTags([])} hitSlop={8}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              ) : null}
            </View>
            <ScrollView style={styles.menuList} bounces={false}>
              {modeCategories.map((item) => {
                const checked = selectedTags.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.menuRow, checked && styles.menuRowChecked]}
                    onPress={() => toggleTag(item.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                  >
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                      {checked ? (
                        <Ionicons name="checkmark" size={10} color={Colors.cream} />
                      ) : null}
                    </View>
                    <Ionicons
                      name={item.icon}
                      size={14}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.menuRowText}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable style={styles.doneBtn} onPress={() => setMenuOpen(false)}>
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          </Pressable>
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
  filters: {
    gap: 6,
    paddingBottom: 6,
  },
  modeTitleRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  modeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  scopeRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryRow: {
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  scopeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  scopeChipActive: {
    backgroundColor: Colors.card,
    borderColor: Colors.card,
  },
  scopeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  scopeLabelActive: {
    color: Colors.cream,
  },
  dropdownBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    maxWidth: '100%',
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    flexShrink: 1,
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  menuCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 12,
    maxHeight: '62%',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  menuList: {
    maxHeight: 360,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuRowChecked: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  menuRowText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.35)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.card,
    borderColor: Colors.card,
  },
  doneBtn: {
    marginTop: 6,
    height: 34,
    borderRadius: 999,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.cream,
  },
  leaf1: { position: 'absolute', top: 40, left: -20, transform: [{ rotate: '-25deg' }] },
  leaf2: { position: 'absolute', top: 180, right: -10, transform: [{ rotate: '40deg' }] },
  leaf3: { position: 'absolute', top: 420, left: -40, transform: [{ rotate: '15deg' }] },
  leaf4: { position: 'absolute', top: 620, right: 20, transform: [{ rotate: '-50deg' }] },
  leaf5: { position: 'absolute', top: 860, left: 30, transform: [{ rotate: '70deg' }] },
  leaf6: { position: 'absolute', top: 1080, right: -30, transform: [{ rotate: '-15deg' }] },
});
