import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AdventureFolder, PublicProfile } from '@/constants/profileFolders';
import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';

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
  const { user, updateProfile } = useFeed();
  const { width } = useWindowDimensions();
  const gap = 3;
  const pad = 2;
  const size = (width - pad * 2 - gap * 2) / 3;
  const isOwn = profile.username.toLowerCase() === user.username.toLowerCase();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(profile.displayName);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);
  const [picking, setPicking] = useState(false);

  const openEdit = () => {
    setEditName(profile.displayName);
    setEditBio(profile.bio);
    setEditAvatar(profile.avatarUrl);
    setEditOpen(true);
  };

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to update your profile photo.');
      return;
    }

    setPicking(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setEditAvatar(result.assets[0].uri);
      }
    } finally {
      setPicking(false);
    }
  };

  const saveProfile = () => {
    updateProfile({
      displayName: editName,
      bio: editBio,
      avatarUrl: editAvatar,
    });
    setEditOpen(false);
  };

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
        {isOwn ? (
          <View style={styles.topActions}>
            <Pressable
              onPress={openEdit}
              hitSlop={10}
              style={styles.iconBtn}
              accessibilityLabel="Edit profile"
            >
              <Ionicons name="create-outline" size={22} color={Colors.text} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/saved')}
              hitSlop={10}
              style={styles.iconBtn}
              accessibilityLabel="Open saved favorites and trip wishlists"
            >
              <Ionicons name="bookmark" size={22} color={Colors.text} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.backBtn} />
        )}
      </View>

      <FlatList
        data={profile.folders}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 24, gap }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable
              onPress={isOwn ? openEdit : undefined}
              disabled={!isOwn}
              style={styles.avatarWrap}
            >
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatar}
                contentFit="cover"
              />
              {isOwn ? (
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera" size={12} color={Colors.cream} />
                </View>
              ) : null}
            </Pressable>
            <View style={styles.headerText}>
              <Text style={styles.displayName}>{profile.displayName}</Text>
              <Text style={styles.bio}>{profile.bio || 'No bio yet.'}</Text>
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
        ListEmptyComponent={<Text style={styles.empty}>No folders yet.</Text>}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setEditOpen(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Edit profile</Text>

            <Pressable style={styles.avatarPicker} onPress={pickAvatar} disabled={picking}>
              <Image source={{ uri: editAvatar }} style={styles.editAvatar} contentFit="cover" />
              <View style={styles.avatarPickerLabel}>
                <Ionicons name="camera-outline" size={16} color={Colors.card} />
                <Text style={styles.avatarPickerText}>
                  {picking ? 'Opening…' : 'Change photo'}
                </Text>
              </View>
            </Pressable>

            <Text style={styles.label}>Display name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor="#8A837A"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="A short description of your adventures"
              placeholderTextColor="#8A837A"
              multiline
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.secondaryBtn} onPress={() => setEditOpen(false)}>
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={saveProfile}>
                <Text style={styles.primaryBtnText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: Colors.card,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  modalCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  avatarPicker: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  editAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.card,
  },
  avatarPickerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarPickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.card,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A8B59A',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.text,
  },
  inputMultiline: {
    minHeight: 88,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  primaryBtn: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.cream,
  },
});
