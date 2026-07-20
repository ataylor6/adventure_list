import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

type Props = {
  username?: string;
  /** When set, center shows `@user : album` instead of just `@user`. */
  albumName?: string;
  /** Optional line under the center title (e.g. photo count). */
  subtitle?: string;
  right?: ReactNode;
};

/**
 * Shared header for photo + album pages.
 * Album: centered @username : album name
 * Photo: back + action only (username lives in the album chip)
 */
export function UserContentHeader({ username, albumName, subtitle, right }: Props) {
  const router = useRouter();
  const showTitle = Boolean(username);

  const openProfile = () => {
    if (!username) return;
    router.push({
      pathname: '/user/[username]',
      params: { username },
    });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.side}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>

        {showTitle ? (
          <View style={styles.center} pointerEvents="box-none">
            <View style={styles.titleRow}>
              <Pressable onPress={openProfile} hitSlop={6}>
                <Text style={styles.username} numberOfLines={1}>
                  @{username}
                </Text>
              </Pressable>
              {albumName ? (
                <Text style={styles.albumPart} numberOfLines={1}>
                  {' '}
                  : {albumName}
                </Text>
              ) : null}
            </View>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        ) : null}

        <View style={styles.side}>{right ?? null}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 10,
  },
  bar: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  side: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 52,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    paddingHorizontal: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.card,
  },
  albumPart: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.card,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
