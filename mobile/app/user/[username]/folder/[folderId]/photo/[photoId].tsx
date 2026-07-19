import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useFeed } from '@/context/FeedContext';

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function PhotoDetailScreen() {
  const router = useRouter();
  const { username, folderId, photoId } = useLocalSearchParams<{
    username: string;
    folderId: string;
    photoId: string;
  }>();
  const { user, myFolders, resolvePhoto, movePhoto, deletePhoto, createFolder } = useFeed();
  const [selectedFolderId, setSelectedFolderId] = useState(folderId ?? '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const data = resolvePhoto(username ?? '', folderId ?? '', photoId ?? '');
  const isOwn = (username ?? '').toLowerCase() === user.username.toLowerCase();

  const selectedFolderTitle = useMemo(() => {
    return myFolders.find((f) => f.id === selectedFolderId)?.title ?? data?.folder.title ?? 'Album';
  }, [myFolders, selectedFolderId, data?.folder.title]);

  if (!data) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Photo not found</Text>
      </View>
    );
  }

  const { photo, profile } = data;
  const hasDescription = Boolean(photo.description?.trim());
  const hasExtras = Boolean(
    photo.stayed?.trim() ||
      photo.at?.trim() ||
      photo.listenedTo?.trim() ||
      photo.wore?.trim(),
  );

  const onSelectFolder = (id: string) => {
    setSelectedFolderId(id);
    setCreatingNew(false);
    setNewAlbumName('');
    setDropdownOpen(false);
  };

  const onChooseNew = () => {
    setCreatingNew(true);
    setDropdownOpen(false);
  };

  const onCreateAlbum = () => {
    const name = newAlbumName.trim();
    if (!name) {
      Alert.alert('Name required', 'Enter a name for the new album.');
      return;
    }
    const folder = createFolder(name);
    setSelectedFolderId(folder.id);
    setCreatingNew(false);
    setNewAlbumName('');
  };

  const onSaveAlbum = () => {
    if (!selectedFolderId || selectedFolderId === folderId) return;
    const ok = movePhoto(photo.id, folderId ?? '', selectedFolderId);
    if (!ok) {
      Alert.alert('Could not move photo', 'That album is unavailable.');
      return;
    }
    router.replace({
      pathname: '/user/[username]/folder/[folderId]/photo/[photoId]',
      params: {
        username: user.username,
        folderId: selectedFolderId,
        photoId: photo.id,
      },
    });
  };

  const onDelete = () => {
    Alert.alert('Delete photo?', 'This removes it from the album and your feed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deletePhoto(photo.id, folderId ?? '');
          router.replace({
            pathname: '/user/[username]/folder/[folderId]',
            params: { username: user.username, folderId: folderId ?? '' },
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          @{profile.username}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Image
            source={{ uri: photo.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
          {photo.location ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={16} color={Colors.textOnDark} />
              <Text style={styles.locationText}>{photo.location}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.folderChip}>
          <Ionicons name="folder" size={14} color={Colors.card} />
          <Text style={styles.folderChipText}>{data.folder.title}</Text>
        </View>

        {hasDescription ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{photo.description}</Text>
          </View>
        ) : null}

        {hasExtras ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This adventure</Text>
            <DetailRow label="Stayed" value={photo.stayed} />
            <DetailRow label="At" value={photo.at} />
            <DetailRow label="Listened to" value={photo.listenedTo} />
            <DetailRow label="Wore" value={photo.wore} />
          </View>
        ) : null}

        {isOwn ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Album</Text>
            <Text style={styles.helper}>Move this photo to another album</Text>

            <Pressable style={styles.dropdown} onPress={() => setDropdownOpen(true)}>
              <View style={styles.dropdownLeft}>
                <Ionicons name="folder" size={16} color={Colors.text} />
                <Text style={styles.dropdownText}>{selectedFolderTitle}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
            </Pressable>

            {creatingNew ? (
              <View style={styles.newAlbumBox}>
                <Text style={styles.label}>New album name</Text>
                <TextInput
                  style={styles.input}
                  value={newAlbumName}
                  onChangeText={setNewAlbumName}
                  placeholder="e.g. Patagonia 2026"
                  placeholderTextColor="#8A837A"
                  autoFocus
                />
                <View style={styles.newAlbumActions}>
                  <Pressable
                    style={styles.secondaryBtn}
                    onPress={() => {
                      setCreatingNew(false);
                      setNewAlbumName('');
                      setSelectedFolderId(folderId ?? '');
                    }}
                  >
                    <Text style={styles.secondaryBtnText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.actionBtnCompact} onPress={onCreateAlbum}>
                    <Text style={styles.actionBtnText}>Create</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            <Pressable
              style={[
                styles.actionBtn,
                selectedFolderId === folderId && styles.actionBtnDisabled,
              ]}
              onPress={onSaveAlbum}
              disabled={selectedFolderId === folderId || creatingNew}
            >
              <Text style={styles.actionBtnText}>Update album</Text>
            </Pressable>

            <Pressable style={styles.deleteBtn} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color="#B42318" />
              <Text style={styles.deleteText}>Delete photo</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setDropdownOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose album</Text>
            <ScrollView style={styles.modalList} bounces={false}>
              {myFolders.map((folder) => {
                const active = selectedFolderId === folder.id;
                return (
                  <Pressable
                    key={folder.id}
                    style={[styles.modalRow, active && styles.modalRowActive]}
                    onPress={() => onSelectFolder(folder.id)}
                  >
                    <Ionicons
                      name="folder"
                      size={16}
                      color={active ? Colors.cream : Colors.text}
                    />
                    <Text style={[styles.modalRowText, active && styles.modalRowTextActive]}>
                      {folder.title}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark" size={18} color={Colors.cream} />
                    ) : null}
                  </Pressable>
                );
              })}
              <Pressable style={styles.modalRow} onPress={onChooseNew}>
                <Ionicons name="add-circle-outline" size={18} color={Colors.text} />
                <Text style={styles.modalRowText}>New</Text>
              </Pressable>
            </ScrollView>
          </View>
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
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 28,
    padding: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 22,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  locationText: {
    color: Colors.textOnDark,
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '90%',
  },
  folderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  folderChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.card,
  },
  section: {
    backgroundColor: 'rgba(247, 244, 238, 0.9)',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  helper: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  row: {
    gap: 2,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rowValue: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A8B59A',
    backgroundColor: '#F7F4EE',
    paddingHorizontal: 14,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  newAlbumBox: {
    gap: 8,
    marginTop: 2,
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
  newAlbumActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEBE3',
  },
  secondaryBtnText: {
    color: Colors.text,
    fontWeight: '600',
  },
  actionBtnCompact: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  actionBtnText: {
    color: Colors.cream,
    fontWeight: '700',
    fontSize: 15,
  },
  deleteBtn: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(180, 35, 24, 0.35)',
    backgroundColor: 'rgba(180, 35, 24, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: {
    color: '#B42318',
    fontWeight: '700',
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 16, 12, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: '#F7F4EE',
    borderRadius: 16,
    padding: 14,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  modalList: {
    maxHeight: 320,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  modalRowActive: {
    backgroundColor: Colors.card,
  },
  modalRowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  modalRowTextActive: {
    color: Colors.cream,
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
