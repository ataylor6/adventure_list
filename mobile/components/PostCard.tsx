import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import type { Post } from '@/types/api';

type Props = {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function PostCard({ post, onLike, onSave }: Props) {
  const [heartVisible, setHeartVisible] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const bumpHeart = () => {
    setHeartVisible(true);
    scale.setValue(0);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.delay(400),
      Animated.timing(scale, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => setHeartVisible(false));
  };

  const onImagePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (!post.liked_by_me) onLike(post.id);
      bumpHeart();
    }
    lastTap.current = now;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar_url }} style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={styles.usernameRow}>
            <Text style={styles.username}>{post.user.username}</Text>
            {post.user.is_verified && (
              <Ionicons name="checkmark-circle" size={14} color="#3897F0" />
            )}
          </View>
          {post.location ? (
            <Text style={styles.location}>{post.location}</Text>
          ) : null}
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={Colors.text} />
      </View>

      <Pressable onPress={onImagePress}>
        <View>
          <Image
            source={{ uri: post.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          {heartVisible && (
            <Animated.View
              pointerEvents="none"
              style={[styles.heartOverlay, { transform: [{ scale }] }]}
            >
              <Ionicons name="heart" size={96} color="#fff" />
            </Animated.View>
          )}
        </View>
      </Pressable>

      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <Pressable onPress={() => onLike(post.id)} hitSlop={8}>
            <Ionicons
              name={post.liked_by_me ? 'heart' : 'heart-outline'}
              size={26}
              color={post.liked_by_me ? Colors.heart : Colors.text}
            />
          </Pressable>
          <Ionicons name="chatbubble-outline" size={24} color={Colors.text} />
          <Ionicons name="paper-plane-outline" size={24} color={Colors.text} />
        </View>
        <Pressable onPress={() => onSave(post.id)} hitSlop={8}>
          <Ionicons
            name={post.saved_by_me ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={Colors.text}
          />
        </Pressable>
      </View>

      <Text style={styles.likes}>{post.likes_count.toLocaleString()} likes</Text>

      <Text style={styles.caption}>
        <Text style={styles.username}>{post.user.username}</Text>
        {'  '}
        {post.caption}
      </Text>

      {post.comments_count > 0 && (
        <Text style={styles.viewComments}>
          View all {post.comments_count} comments
        </Text>
      )}

      <Text style={styles.time}>{timeAgo(post.created_at).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFEFEF',
  },
  headerText: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontWeight: '600',
    color: Colors.text,
    fontSize: 13,
  },
  location: {
    fontSize: 11,
    color: Colors.text,
    marginTop: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#EFEFEF',
  },
  heartOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  likes: {
    paddingHorizontal: 12,
    marginTop: 8,
    fontWeight: '600',
    fontSize: 13,
    color: Colors.text,
  },
  caption: {
    paddingHorizontal: 12,
    marginTop: 4,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  viewComments: {
    paddingHorizontal: 12,
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  time: {
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 8,
    fontSize: 10,
    color: Colors.textSecondary,
  },
});
