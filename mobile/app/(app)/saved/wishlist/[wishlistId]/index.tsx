import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MissingState } from '@/components/MissingState';
import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';

export default function WishlistAlbumScreen() {
  const router = useRouter();
  const { wishlistId } = useLocalSearchParams<{ wishlistId: string }>();
  const { resolveWishlistAlbum } = useFeed();
  const album = resolveWishlistAlbum(wishlistId ?? '');
  const { width } = useWindowDimensions();
  const gap = 3;
  const pad = 2;
  const size = (width - pad * 2 - gap * 2) / 3;

  if (!album) {
    return <MissingState title="Wishlist not found" message="This trip wishlist is unavailable." />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>
        <View style={styles.topCenter}>
          <View style={styles.labelRow}>
            <Ionicons name="bookmark" size={16} color={Colors.card} />
            <Text style={styles.topTitle}>{album.title}</Text>
          </View>
          <Text style={styles.topSub}>
            {album.photos.length} save{album.photos.length === 1 ? '' : 's'}
          </Text>
        </View>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/saved/wishlist/[wishlistId]/export',
              params: { wishlistId: album.id },
            })
          }
          hitSlop={12}
          style={styles.exportBtn}
          accessibilityRole="button"
          accessibilityLabel="Edit and export itinerary"
        >
          <Ionicons name="share-outline" size={24} color={Colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={album.photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 24, gap }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Save posts from other adventurers to build this trip wishlist.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.photoTile, { width: size, height: size }]}
            onPress={() =>
              router.push({
                pathname: '/saved/wishlist/[wishlistId]/photo/[photoId]',
                params: {
                  wishlistId: album.id,
                  photoId: item.id,
                },
              })
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.photo} contentFit="cover" />
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
  },
  exportBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  topSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  photoTile: {
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Colors.cardMuted,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  empty: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 40,
    paddingHorizontal: 28,
    lineHeight: 20,
  },
});
