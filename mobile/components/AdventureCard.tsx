import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { AdventurePost } from '@/constants/adventureFeed';
import { Colors } from '@/constants/theme';
import { openNearbyFromLocation } from '@/utils/openNearby';

type Props = {
  post: AdventurePost;
};

export function AdventureCard({ post }: Props) {
  const router = useRouter();

  const openPost = () => {
    if (!post.folderId) return;
    router.push({
      pathname: '/user/[username]/folder/[folderId]/photo/[photoId]',
      params: {
        username: post.username,
        folderId: post.folderId,
        photoId: post.id,
      },
    });
  };

  const openNearby = () => {
    openNearbyFromLocation(router, {
      location: post.location,
      latitude: post.latitude,
      longitude: post.longitude,
    });
  };

  return (
    <View style={styles.card}>
      <Pressable style={styles.imageWrap} onPress={openPost}>
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </Pressable>

      <Pressable style={styles.footer} onPress={openNearby} hitSlop={6}>
        <Ionicons name="location-sharp" size={16} color={Colors.textOnDark} />
        <Text style={styles.location} numberOfLines={1}>
          {post.location}
        </Text>
      </Pressable>
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
