import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, type View as RNView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { FeedMode } from '@/constants/adventureFeed';
import { Colors } from '@/constants/theme';
import { useExploreMode } from '@/context/ExploreModeContext';

type TabKey = 'home' | 'search' | 'create' | 'reels' | 'profile';

type TabItem = {
  key: TabKey;
  href: '/(app)/home' | '/(app)/search' | '/(app)/create' | '/(app)/reels' | '/(app)/profile';
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const TABS: TabItem[] = [
  { key: 'home', href: '/(app)/home', icon: 'globe-outline', iconFocused: 'globe' },
  { key: 'search', href: '/(app)/search', icon: 'search-outline', iconFocused: 'search' },
  { key: 'create', href: '/(app)/create', icon: 'add', iconFocused: 'add' },
  { key: 'reels', href: '/(app)/reels', icon: 'location-outline', iconFocused: 'location' },
  { key: 'profile', href: '/(app)/profile', icon: 'person-outline', iconFocused: 'person' },
];

const MODE_OPTIONS: {
  id: FeedMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'local', label: 'Local', icon: 'home-outline' },
  { id: 'travel', label: 'Travel', icon: 'airplane-outline' },
];

function activeTab(pathname: string): TabKey | null {
  if (pathname.includes('/search')) return 'search';
  if (pathname.includes('/create')) return 'create';
  if (pathname.includes('/reels')) return 'reels';
  if (pathname.includes('/profile') || pathname.includes('/saved')) return 'profile';
  if (pathname.includes('/home')) return 'home';
  if (pathname.includes('/user/')) return null;
  return 'home';
}

export function AppTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const current = activeTab(pathname);
  const { mode, selectMode } = useExploreMode();
  const locationDisabled = mode === 'local';
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0, width: 0 });
  const globeRef = useRef<RNView>(null);

  const openModeMenu = () => {
    globeRef.current?.measureInWindow((x, y, width) => {
      setMenuAnchor({ x, y, width });
      setModeMenuOpen(true);
    });
  };

  const onSelectMode = (next: FeedMode) => {
    selectMode(next);
    setModeMenuOpen(false);
    if (current !== 'home') {
      router.replace('/(app)/home');
    }
  };

  return (
    <>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {TABS.map((tab) => {
          const focused = current === tab.key;
          const disabled = tab.key === 'reels' && locationDisabled;
          const color = disabled
            ? Colors.border
            : focused
              ? Colors.tabIcon
              : Colors.tabIconInactive;

          if (tab.key === 'create') {
            return (
              <Pressable
                key={tab.key}
                onPress={() => router.replace(tab.href)}
                style={styles.slot}
                accessibilityRole="button"
                accessibilityLabel="Create"
              >
                <View style={styles.createBtn}>
                  <Ionicons name="add" size={32} color={Colors.cream} />
                </View>
              </Pressable>
            );
          }

          if (tab.key === 'home') {
            return (
              <Pressable
                key={tab.key}
                ref={globeRef}
                onPress={() => {
                  if (current !== 'home') {
                    router.replace(tab.href);
                  }
                  openModeMenu();
                }}
                style={styles.slot}
                accessibilityRole="button"
                accessibilityLabel="Explore Local or Travel"
              >
                <Ionicons
                  name={focused ? tab.iconFocused : tab.icon}
                  size={26}
                  color={color}
                />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                if (disabled) return;
                router.replace(tab.href);
              }}
              style={[styles.slot, disabled && styles.slotDisabled]}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ disabled }}
              accessibilityLabel={
                tab.key === 'reels'
                  ? locationDisabled
                    ? 'Nearby unavailable in Local'
                    : 'Nearby'
                  : tab.key
              }
            >
              <Ionicons
                name={focused && !disabled ? tab.iconFocused : tab.icon}
                size={26}
                color={color}
              />
            </Pressable>
          );
        })}
      </View>

      <Modal
        visible={modeMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModeMenuOpen(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setModeMenuOpen(false)}>
          <View
            style={[
              styles.modeMenu,
              {
                left: Math.max(12, menuAnchor.x + menuAnchor.width / 2 - 84),
                bottom: Math.max(insets.bottom + 64, 72),
              },
            ]}
          >
            {MODE_OPTIONS.map((option) => {
              const active = mode === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.modeRow, active && styles.modeRowActive]}
                  onPress={() => onSelectMode(option.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Ionicons
                    name={option.icon}
                    size={18}
                    color={active ? Colors.cream : Colors.text}
                  />
                  <Text style={[styles.modeRowText, active && styles.modeRowTextActive]}>
                    {option.label}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark" size={16} color={Colors.cream} />
                  ) : (
                    <View style={styles.modeCheckSpacer} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    backgroundColor: Colors.tabBar,
    borderTopWidth: 0,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  slotDisabled: {
    opacity: 0.45,
  },
  createBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: -18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentBlue,
    shadowColor: Colors.accentBlueGlow,
    shadowOpacity: 0.85,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modeMenu: {
    position: 'absolute',
    width: 168,
    borderRadius: 14,
    padding: 6,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    gap: 2,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
  },
  modeRowActive: {
    backgroundColor: Colors.card,
  },
  modeRowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  modeRowTextActive: {
    color: Colors.cream,
  },
  modeCheckSpacer: {
    width: 16,
  },
});
