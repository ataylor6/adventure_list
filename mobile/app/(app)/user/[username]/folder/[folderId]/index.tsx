import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';
import { MissingState } from '@/components/MissingState';
import { UserContentHeader } from '@/components/UserContentHeader';

export default function FolderPhotosScreen() {
  const router = useRouter();
  const { username, folderId } = useLocalSearchParams<{
    username: string;
    folderId: string;
  }>();
  const {
    user,
    resolveFolder,
    saveAlbumToFavorites,
    isAlbumFavorited,
    removeFavoriteAlbum,
    favoriteAlbums,
  } = useFeed();
  const data = resolveFolder(username ?? '', folderId ?? '');
  const { width } = useWindowDimensions();
  const gap = 3;
  const pad = 2;
  const size = (width - pad * 2 - gap * 2) / 3;

  if (!data) {
    return <MissingState title="Folder not found" message="This album is unavailable." />;
  }

  const { folder, profile } = data;
  const isOwn = profile.username.toLowerCase() === user.username.toLowerCase();
  const favorited = !isOwn && isAlbumFavorited(profile.username, folder.id);

  const onToggleFavorite = () => {
    if (isOwn) return;
    if (favorited) {
      const existing = favoriteAlbums.find(
        (a) =>
          a.sourceUsername.toLowerCase() === profile.username.toLowerCase() &&
          a.sourceFolderId === folder.id,
      );
      if (!existing) return;
      Alert.alert('Remove favorite?', `Remove “${folder.title}” from your favorites?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavoriteAlbum(existing.id),
        },
      ]);
      return;
    }
    const saved = saveAlbumToFavorites(profile.username, folder.id);
    if (!saved) {
      Alert.alert('Could not save', 'This album could not be added to favorites.');
      return;
    }
    Alert.alert('Saved to favorites', `“${folder.title}” is in your favorites.`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <UserContentHeader
        username={profile.username}
        albumName={folder.title}
        subtitle={`${folder.photos.length} photo${folder.photos.length === 1 ? '' : 's'}`}
        right={
          !isOwn ? (
            <Pressable onPress={onToggleFavorite} hitSlop={12}>
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={24}
                color={favorited ? '#C45C3E' : Colors.text}
              />
            </Pressable>
          ) : undefined
        }
      />

      <FlatList
        data={folder.photos}
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
                  username: username ?? '',
                  folderId: folderId ?? '',
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
