import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

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

function activeTab(pathname: string): TabKey | null {
  if (pathname.includes('/search')) return 'search';
  if (pathname.includes('/create')) return 'create';
  if (pathname.includes('/reels')) return 'reels';
  if (pathname.includes('/profile') || pathname.includes('/saved')) return 'profile';
  if (pathname.includes('/home')) return 'home';
  // Viewing another user — no main tab highlighted
  if (pathname.includes('/user/')) return null;
  return 'home';
}

export function AppTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const current = activeTab(pathname);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {TABS.map((tab) => {
        const focused = current === tab.key;
        const color = focused ? Colors.tabIcon : Colors.tabIconInactive;

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

        return (
          <Pressable
            key={tab.key}
            onPress={() => router.replace(tab.href)}
            style={styles.slot}
            accessibilityRole="button"
            accessibilityLabel={tab.key}
          >
            <Ionicons
              name={focused ? tab.iconFocused : tab.icon}
              size={26}
              color={color}
            />
          </Pressable>
        );
      })}
    </View>
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
});
