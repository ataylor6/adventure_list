import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { api } from '@/services/api';
import type { Post, UserProfile } from '@/types/api';

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const me = await api.getMyProfile();
      setProfile(me);
      const mine = await api.getProfilePosts(me.username);
      // Demo: show feed posts for "you" as empty — use maya's as grid demo if none
      if (mine.length === 0) {
        const feed = await api.getFeed();
        setPosts(feed.posts);
      } else {
        setPosts(mine);
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.text} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>Couldn’t load profile. Is the API running?</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.username}>{profile.username}</Text>
        <View style={styles.topActions}>
          <Ionicons name="add-outline" size={28} color={Colors.text} />
          <Ionicons name="menu-outline" size={28} color={Colors.text} />
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.statsRow}>
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
              <View style={styles.stat}>
                <Text style={styles.statNum}>{profile.posts_count}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNum}>{formatCount(profile.followers_count)}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNum}>{formatCount(profile.following_count)}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            <Text style={styles.displayName}>{profile.display_name}</Text>
            {!!profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            {!!profile.website && (
              <Text style={styles.website}>{profile.website.replace(/^https?:\/\//, '')}</Text>
            )}

            <View style={styles.buttons}>
              <Pressable style={styles.editBtn}>
                <Text style={styles.editText}>Edit profile</Text>
              </Pressable>
              <Pressable style={styles.editBtn}>
                <Text style={styles.editText}>Share profile</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Image source={{ uri: item.image_url }} style={styles.tile} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  topActions: {
    flexDirection: 'row',
    gap: 16,
  },
  header: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginRight: 18,
    backgroundColor: '#EFEFEF',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.text,
  },
  displayName: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.text,
  },
  bio: {
    fontSize: 13,
    color: Colors.text,
    marginTop: 2,
    lineHeight: 18,
  },
  website: {
    fontSize: 13,
    color: Colors.link,
    fontWeight: '600',
    marginTop: 2,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  editBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.text,
  },
  tile: {
    width: '33.333%',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: Colors.background,
    backgroundColor: '#EFEFEF',
  },
  error: {
    textAlign: 'center',
    marginTop: 40,
    color: Colors.textSecondary,
    paddingHorizontal: 24,
  },
});
