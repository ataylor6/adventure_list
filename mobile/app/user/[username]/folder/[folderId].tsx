import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';

export default function FolderPhotosScreen() {
  const router = useRouter();
  const { username, folderId } = useLocalSearchParams<{
    username: string;
    folderId: string;
  }>();
  const { resolveFolder } = useFeed();
  const data = resolveFolder(username ?? '', folderId ?? '');
  const { width } = useWindowDimensions();
  const gap = 3;
  const pad = 2;
  const size = (width - pad * 2 - gap * 2) / 3;

  if (!data) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Folder not found</Text>
      </View>
    );
  }

  const { folder } = data;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>
        <View style={styles.topCenter}>
          <View style={styles.folderLabel}>
            <Ionicons name="folder" size={16} color={Colors.card} />
            <Text style={styles.topTitle}>{folder.title}</Text>
          </View>
          <Text style={styles.topSub}>
            {folder.photos.length} photo{folder.photos.length === 1 ? '' : 's'}
          </Text>
        </View>
        <View style={styles.backBtn} />
      </View>

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  topCenter: {
    alignItems: 'center',
    gap: 2,
  },
  folderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  topSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  photoTile: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.cardMuted,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  missingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
