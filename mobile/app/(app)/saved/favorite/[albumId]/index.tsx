import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';
import { MissingState } from '@/components/MissingState';

export default function FavoriteAlbumScreen() {
  const router = useRouter();
  const { albumId } = useLocalSearchParams<{ albumId: string }>();
  const { resolveFavoriteAlbum, removeFavoriteAlbum } = useFeed();
  const album = resolveFavoriteAlbum(albumId ?? '');
  const { width } = useWindowDimensions();
  const gap = 3;
  const pad = 2;
  const size = (width - pad * 2 - gap * 2) / 3;

  if (!album) {
    return <MissingState title="Favorite not found" message="This saved album is unavailable." />;
  }

  const onRemove = () => {
    Alert.alert('Remove favorite?', `Remove “${album.title}” from your favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeFavoriteAlbum(album.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>
        <View style={styles.topCenter}>
          <View style={styles.labelRow}>
            <Ionicons name="heart" size={16} color={Colors.card} />
            <Text style={styles.topTitle}>{album.title}</Text>
          </View>
          <Text style={styles.topSub}>@{album.sourceUsername}</Text>
        </View>
        <Pressable onPress={onRemove} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="trash-outline" size={22} color="#B42318" />
        </Pressable>
      </View>

      <FlatList
        data={album.photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 24, gap }}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.photoTile, { width: size, height: size }]}
            onPress={() =>
              router.push({
                pathname: '/user/[username]/folder/[folderId]/photo/[photoId]',
                params: {
                  username: album.sourceUsername,
                  folderId: album.sourceFolderId,
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
    alignItems: 'center',
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
});
