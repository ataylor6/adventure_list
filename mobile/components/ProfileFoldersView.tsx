import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AdventureFolder, PublicProfile } from '@/constants/profileFolders';
import { Colors } from '@/constants/theme';

type Props = {
  profile: PublicProfile;
  showBack?: boolean;
};

function FolderTile({
  folder,
  size,
  username,
}: {
  folder: AdventureFolder;
  size: number;
  username: string;
}) {
  const router = useRouter();

  return (
    <Pressable
      style={[styles.folderTile, { width: size, height: size }]}
      onPress={() =>
        router.push({
          pathname: '/user/[username]/folder/[folderId]',
          params: { username, folderId: folder.id },
        })
      }
    >
      <Image source={{ uri: folder.coverUrl }} style={styles.folderImage} contentFit="cover" />
      <View style={styles.folderScrim} />
      <View style={styles.folderMeta}>
        <Ionicons name="folder" size={16} color={Colors.cream} />
        <Text style={styles.folderTitle} numberOfLines={1}>
          {folder.title}
        </Text>
        <Text style={styles.folderCount}>{folder.photos.length}</Text>
      </View>
    </Pressable>
  );
}

export function ProfileFoldersView({ profile, showBack = false }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const gap = 3;
  const pad = 2;
  const size = (width - pad * 2 - gap * 2) / 3;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        {showBack ? (
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color={Colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Text style={styles.topUsername}>@{profile.username}</Text>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={profile.folders}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 24, gap }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.headerText}>
              <Text style={styles.displayName}>{profile.displayName}</Text>
              <Text style={styles.bio}>{profile.bio}</Text>
              <Text style={styles.folderHint}>
                {profile.folders.length} adventure folder
                {profile.folders.length === 1 ? '' : 's'}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <FolderTile folder={item} size={size} username={profile.username} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No folders yet.</Text>
        }
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
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  topUsername: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 18,
    alignItems: 'center',
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: Colors.card,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  folderHint: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.card,
  },
  folderTile: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.cardMuted,
  },
  folderImage: {
    ...StyleSheet.absoluteFillObject,
  },
  folderScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 22, 16, 0.28)',
  },
  folderMeta: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    gap: 2,
  },
  folderTitle: {
    color: Colors.cream,
    fontSize: 13,
    fontWeight: '700',
  },
  folderCount: {
    color: 'rgba(243, 237, 228, 0.85)',
    fontSize: 11,
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 40,
  },
});
