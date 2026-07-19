import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { AdventurePost } from '@/constants/adventureFeed';
import { Colors } from '@/constants/theme';

type Props = {
  post: AdventurePost;
};

export function AdventureCard({ post }: Props) {
  const router = useRouter();

  const openProfile = () => {
    router.push({
      pathname: '/user/[username]',
      params: { username: post.username },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {post.username ? (
          <Pressable style={styles.author} onPress={openProfile}>
            {post.avatarUrl ? (
              <Image
                source={{ uri: post.avatarUrl }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]} />
            )}
            <Text style={styles.username}>@{post.username}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Ionicons name="location-sharp" size={16} color={Colors.textOnDark} />
        <Text style={styles.location} numberOfLines={1}>
          {post.location}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 36,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 18,
    shadowColor: '#1A140F',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  imageWrap: {
    borderRadius: 28,
    overflow: 'hidden',
    aspectRatio: 0.92,
    backgroundColor: Colors.cardMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  author: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(30, 22, 16, 0.35)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    paddingLeft: 4,
    borderRadius: 999,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: 'rgba(243, 237, 228, 0.85)',
  },
  avatarFallback: {
    backgroundColor: Colors.cardMuted,
  },
  username: {
    color: Colors.textOnDark,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
    paddingRight: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  location: {
    color: Colors.textOnDark,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    maxWidth: '90%',
  },
});
