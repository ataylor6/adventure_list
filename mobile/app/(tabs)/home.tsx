import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostCard } from '@/components/PostCard';
import { StoriesRow } from '@/components/StoriesRow';
import { Colors } from '@/constants/theme';
import { api } from '@/services/api';
import type { Post, Story } from '@/types/api';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [feed, storyRes] = await Promise.all([api.getFeed(), api.getStories()]);
      setPosts(feed.posts);
      setStories(storyRes.stories);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const onLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              likes_count: p.likes_count + (p.liked_by_me ? -1 : 1),
            }
          : p,
      ),
    );
    try {
      const res = await api.likePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked_by_me: res.liked, likes_count: res.likes_count }
            : p,
        ),
      );
    } catch {
      // optimistic UI stays; refresh will reconcile
    }
  };

  const onSave = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, saved_by_me: !p.saved_by_me } : p)),
    );
    try {
      const res = await api.savePost(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? res : p)));
    } catch {
      // ignore for skeleton
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>Gram</Text>
        <View style={styles.topActions}>
          <Ionicons name="heart-outline" size={26} color={Colors.text} />
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.text} />
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.text} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Couldn’t reach the API</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <Text style={styles.errorHint}>
            Start the backend on port 8000, then pull to refresh.
          </Text>
          <Pressable style={styles.retry} onPress={load}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard post={item} onLike={onLike} onSave={onSave} />
          )}
          ListHeaderComponent={<StoriesRow stories={stories} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontStyle: 'italic',
    color: Colors.text,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  errorBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  retry: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: Colors.text,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
